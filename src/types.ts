export type ValidationStatus = 'PASS' | 'FAIL' | 'WARNING';

export type ErrorCategory = 
  | 'None'
  | 'XML Syntax Error'
  | 'Spec / Metadata Error'
  | 'DMC Mismatch'
  | 'XSD Schema Error';

export interface ValidationErrorDetail {
  line?: number;
  column?: number;
  category: ErrorCategory;
  message: string;
  snippet?: string;
}

export interface ExtractedDmc {
  modelIdentCode?: string;
  systemCode?: string;
  subSystemCode?: string;
  subSubCode?: string;
  assyCode?: string;
  disassyCode?: string;
  disassyCodeVariant?: string;
  infoCode?: string;
  infoCodeVariant?: string;
  itemLocationCode?: string;
}

export interface ExtractedHeaderMetadata {
  issueDate?: {
    year?: string;
    month?: string;
    day?: string;
    fullDate?: string;
  };
  security?: {
    securityClassification?: string;
    commercialClassification?: string;
  };
  techData?: {
    dmTitle?: string;
    techName?: string;
    infoName?: string;
  };
  responsiblePartnerCompany?: string;
  originator?: string;
  language?: {
    languageIsoCode?: string;
    countryIsoCode?: string;
  };
}

export interface ValidationResult {
  id: string;
  filename: string;
  status: ValidationStatus;
  primaryCategory: ErrorCategory;
  dmcInFilename?: string;
  extractedDmc?: ExtractedDmc;
  dmcMatchDetails?: {
    filenameModel?: string;
    xmlModel?: string;
    filenameSystem?: string;
    xmlSystem?: string;
    isMatch: boolean;
    reason?: string;
  };
  metadata?: ExtractedHeaderMetadata;
  errors: ValidationErrorDetail[];
  rawXml: string;
  fileSize: number;
  lastModified: number;
}

export interface ReportApprovalInfo {
  docNumber: string;
  inspectionDate: string;
  inspectorName: string;
  approverName: string;
  projectName: string;
  department: string;
}

export interface ValidationRuleConfig {
  checkSyntax: boolean;
  checkXsd: boolean;
  checkDmcMatch: boolean;
  checkHeaderMetadata: boolean;
  requiredHeaderTags: string[];
  customXsdContent?: string;
  customXsdFilename?: string;
}

export interface SummaryStats {
  totalCount: number;
  passCount: number;
  failCount: number;
  warningCount: number;
  passRatePercentage: number;
  syntaxErrorsCount: number;
  metadataErrorsCount: number;
  dmcErrorsCount: number;
  xsdErrorsCount: number;
}
