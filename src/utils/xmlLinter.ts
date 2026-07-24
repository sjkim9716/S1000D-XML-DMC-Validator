import { 
  ValidationResult, 
  ValidationErrorDetail, 
  ExtractedDmc, 
  ExtractedHeaderMetadata, 
  ValidationRuleConfig, 
  ErrorCategory 
} from '../types';

export function validateXmlContent(
  filename: string,
  rawXml: string,
  fileSize: number,
  lastModified: number,
  config: ValidationRuleConfig
): ValidationResult {
  const resultId = `${filename}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const errors: ValidationErrorDetail[] = [];
  let primaryCategory: ErrorCategory = 'None';
  
  // Clean BOM or invisible zero-width spaces
  const cleanXml = rawXml.replace(/^\uFEFF/, '').trim();
  const lines = cleanXml.split('\n');

  // -------------------------------------------------------------
  // FR-1: XML Syntax Validation
  // -------------------------------------------------------------
  let xmlDoc: Document | null = null;
  if (config.checkSyntax) {
    const parser = new DOMParser();
    xmlDoc = parser.parseFromString(cleanXml, 'application/xml');
    
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      const errorText = parserError.textContent || 'Unknown XML Syntax Error';
      
      // Try to extract line number from parser error message
      let lineNum = 1;
      const lineMatch = errorText.match(/line\s+(\d+)/i) || errorText.match(/line:\s*(\d+)/i) || errorText.match(/줄\s*(\d+)/);
      if (lineMatch) {
        lineNum = parseInt(lineMatch[1], 10);
      } else {
        // Fallback: estimate line of unclosed bracket or error
        for (let i = 0; i < lines.length; i++) {
          if ((lines[i].includes('<') && !lines[i].includes('>')) || 
              (lines[i].match(/="[^"]*$/))) {
            lineNum = i + 1;
            break;
          }
        }
      }

      errors.push({
        line: lineNum,
        category: 'XML Syntax Error',
        message: `XML 문법 오류: ${errorText.replace(/Below is a rendering of the page.*/, '').trim()}`,
        snippet: lines[lineNum - 1] || ''
      });

      return {
        id: resultId,
        filename,
        status: 'FAIL',
        primaryCategory: 'XML Syntax Error',
        dmcInFilename: extractDmcFromFilename(filename),
        errors,
        rawXml,
        fileSize,
        lastModified
      };
    }
  }

  if (!xmlDoc) {
    const parser = new DOMParser();
    xmlDoc = parser.parseFromString(cleanXml, 'text/xml');
  }

  // -------------------------------------------------------------
  // Extract DMC & Header Metadata
  // -------------------------------------------------------------
  const extractedDmc = parseDmcFromXml(xmlDoc);
  const metadata = parseHeaderMetadataFromXml(xmlDoc);
  const dmcInFilename = extractDmcFromFilename(filename);

  // -------------------------------------------------------------
  // FR-3: DMC & Filename Matching Engine
  // -------------------------------------------------------------
  let dmcMatchDetails: ValidationResult['dmcMatchDetails'] = undefined;
  if (config.checkDmcMatch) {
    const fnParsed = parseDmcCodeFromString(filename);
    const xmlModel = extractedDmc.modelIdentCode || '';
    const xmlSystem = extractedDmc.systemCode || '';

    dmcMatchDetails = {
      filenameModel: fnParsed.modelIdentCode,
      xmlModel: xmlModel,
      filenameSystem: fnParsed.systemCode,
      xmlSystem: xmlSystem,
      isMatch: true
    };

    if (!extractedDmc.modelIdentCode && !extractedDmc.systemCode) {
      dmcMatchDetails.isMatch = false;
      dmcMatchDetails.reason = '<dmCode> 태그 또는 필수 DMC 속성이 존재하지 않습니다.';
      
      const line = findTagLineNumber(lines, 'dmCode') || 1;
      errors.push({
        line,
        category: 'Spec / Metadata Error',
        message: '[DMC Error] XML 내부 <dmCode> 태그가 누락되었거나 속성이 정의되지 않았습니다.',
        snippet: lines[line - 1] || ''
      });
      if (primaryCategory === 'None') primaryCategory = 'Spec / Metadata Error';
    } else if (fnParsed.modelIdentCode || fnParsed.systemCode) {
      const modelMatch = !fnParsed.modelIdentCode || 
        fnParsed.modelIdentCode.toUpperCase() === xmlModel.toUpperCase();
      const systemMatch = !fnParsed.systemCode || 
        fnParsed.systemCode === xmlSystem;

      if (!modelMatch || !systemMatch) {
        dmcMatchDetails.isMatch = false;
        dmcMatchDetails.reason = `파일명 내 DMC(${fnParsed.modelIdentCode || '?'}-${fnParsed.systemCode || '?'})와 XML <dmCode>(${xmlModel}-${xmlSystem}) 불일치`;

        const line = findTagLineNumber(lines, 'dmCode') || 1;
        errors.push({
          line,
          category: 'DMC Mismatch',
          message: `[DMC Mismatch] 파일명 DMC(${fnParsed.modelIdentCode || '?'}-${fnParsed.systemCode || '?'})와 XML dmCode(${xmlModel}-${xmlSystem})가 일치하지 않습니다.`,
          snippet: lines[line - 1] || ''
        });
        if (primaryCategory === 'None') primaryCategory = 'DMC Mismatch';
      }
    }
  }

  // -------------------------------------------------------------
  // FR-4: Mandatory Header Metadata Scan Engine
  // -------------------------------------------------------------
  if (config.checkHeaderMetadata) {
    // 1. Issue Date Check
    if (!metadata.issueDate || (!metadata.issueDate.year && !metadata.issueDate.fullDate)) {
      const line = findTagLineNumber(lines, 'dmAddress') || 1;
      errors.push({
        line,
        category: 'Spec / Metadata Error',
        message: '[Metadata Error] 필수 메타데이터 <issueDate> (발행일자) 태그 및 속성이 누락되었습니다.',
        snippet: lines[line - 1] || ''
      });
      if (primaryCategory === 'None') primaryCategory = 'Spec / Metadata Error';
    }

    // 2. Security Classification Check
    if (!metadata.security || !metadata.security.securityClassification) {
      const line = findTagLineNumber(lines, 'dmStatus') || findTagLineNumber(lines, 'identAndStatusSection') || 1;
      errors.push({
        line,
        category: 'Spec / Metadata Error',
        message: '[Metadata Error] 필수 메타데이터 <security> (보안등급 securityClassification) 태그/속성이 누락되었습니다.',
        snippet: lines[line - 1] || ''
      });
      if (primaryCategory === 'None') primaryCategory = 'Spec / Metadata Error';
    }
  }

  // -------------------------------------------------------------
  // FR-2: S1000D Structure / XSD Schema Rules Engine
  // -------------------------------------------------------------
  if (config.checkXsd) {
    // Structural rules validation
    const rootEl = xmlDoc.documentElement;
    if (rootEl.nodeName !== 'dmodule' && rootEl.nodeName !== 'pm') {
      errors.push({
        line: 1,
        category: 'XSD Schema Error',
        message: `[XSD Violation] S1000D 최상위 루트 태그는 <dmodule> 또는 <pm> 이어야 합니다. (현재: <${rootEl.nodeName}>)`,
        snippet: lines[0] || ''
      });
      if (primaryCategory === 'None') primaryCategory = 'XSD Schema Error';
    }

    const identSection = xmlDoc.querySelector('identAndStatusSection');
    if (!identSection) {
      errors.push({
        line: 1,
        category: 'XSD Schema Error',
        message: '[XSD Violation] S1000D 필수 구역 <identAndStatusSection> 이 존재하지 않습니다.',
        snippet: lines[0] || ''
      });
      if (primaryCategory === 'None') primaryCategory = 'XSD Schema Error';
    }

    const contentSection = xmlDoc.querySelector('content');
    if (!contentSection) {
      errors.push({
        line: lines.length,
        category: 'XSD Schema Error',
        message: '[XSD Violation] S1000D 본문 구역 <content> 가 존재하지 않습니다.',
        snippet: lines[lines.length - 1] || ''
      });
      if (primaryCategory === 'None') primaryCategory = 'XSD Schema Error';
    }
  }

  const finalStatus = errors.length === 0 ? 'PASS' : 'FAIL';

  return {
    id: resultId,
    filename,
    status: finalStatus,
    primaryCategory: errors.length > 0 ? (primaryCategory !== 'None' ? primaryCategory : errors[0].category) : 'None',
    dmcInFilename,
    extractedDmc,
    dmcMatchDetails,
    metadata,
    errors,
    rawXml,
    fileSize,
    lastModified
  };
}

// Helpers
function extractDmcFromFilename(filename: string): string {
  const match = filename.match(/DMC-[A-Za-z0-9_-]+/i);
  if (match) return match[0];
  return filename.replace(/\.xml$/i, '');
}

function parseDmcCodeFromString(str: string): { modelIdentCode?: string; systemCode?: string } {
  // Standard DMC pattern: DMC-MODEL-SYSTEM...
  const match = str.match(/DMC-([A-Za-z0-9]+)-([0-9]{2})/i) ||
                str.match(/([A-Za-z0-9]+)-([0-9]{2})-[0-9]{3}/i);
  if (match) {
    return {
      modelIdentCode: match[1],
      systemCode: match[2]
    };
  }
  return {};
}

function parseDmcFromXml(xmlDoc: Document): ExtractedDmc {
  const dmCodeNode = xmlDoc.querySelector('dmCode');
  if (!dmCodeNode) return {};

  return {
    modelIdentCode: dmCodeNode.getAttribute('modelIdentCode') || undefined,
    systemCode: dmCodeNode.getAttribute('systemCode') || undefined,
    subSystemCode: dmCodeNode.getAttribute('subSystemCode') || undefined,
    subSubCode: dmCodeNode.getAttribute('subSubCode') || undefined,
    assyCode: dmCodeNode.getAttribute('assyCode') || undefined,
    disassyCode: dmCodeNode.getAttribute('disassyCode') || undefined,
    disassyCodeVariant: dmCodeNode.getAttribute('disassyCodeVariant') || undefined,
    infoCode: dmCodeNode.getAttribute('infoCode') || undefined,
    infoCodeVariant: dmCodeNode.getAttribute('infoCodeVariant') || undefined,
    itemLocationCode: dmCodeNode.getAttribute('itemLocationCode') || undefined,
  };
}

function parseHeaderMetadataFromXml(xmlDoc: Document): ExtractedHeaderMetadata {
  const result: ExtractedHeaderMetadata = {};

  // issueDate
  const issueDateNode = xmlDoc.querySelector('issueDate');
  if (issueDateNode) {
    const yr = issueDateNode.getAttribute('year');
    const mo = issueDateNode.getAttribute('month');
    const dy = issueDateNode.getAttribute('day');
    result.issueDate = {
      year: yr || undefined,
      month: mo || undefined,
      day: dy || undefined,
      fullDate: yr && mo && dy ? `${yr}-${mo}-${dy}` : issueDateNode.textContent?.trim()
    };
  }

  // security
  const securityNode = xmlDoc.querySelector('security');
  if (securityNode) {
    result.security = {
      securityClassification: securityNode.getAttribute('securityClassification') || undefined,
      commercialClassification: securityNode.getAttribute('commercialClassification') || undefined,
    };
  }

  // dmTitle
  const dmTitleNode = xmlDoc.querySelector('dmTitle');
  if (dmTitleNode) {
    const techName = dmTitleNode.querySelector('techName')?.textContent?.trim();
    const infoName = dmTitleNode.querySelector('infoName')?.textContent?.trim();
    result.techData = {
      techName,
      infoName,
      dmTitle: [techName, infoName].filter(Boolean).join(' - ')
    };
  }

  // responsiblePartnerCompany
  const partnerNode = xmlDoc.querySelector('responsiblePartnerCompany');
  if (partnerNode) {
    const name = partnerNode.querySelector('enterpriseName')?.textContent?.trim();
    const code = partnerNode.getAttribute('enterpriseCode');
    result.responsiblePartnerCompany = name || code || undefined;
  }

  return result;
}

function findTagLineNumber(lines: string[], tagName: string): number {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`<${tagName}`)) {
      return i + 1;
    }
  }
  return 1;
}
