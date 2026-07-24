import React, { useState, useEffect } from 'react';
import { 
  ValidationResult, 
  ValidationRuleConfig, 
  ReportApprovalInfo, 
  SummaryStats 
} from './types';
import { validateXmlContent } from './utils/xmlLinter';
import { SAMPLE_FILES, SAMPLE_XSD_SCHEMA } from './utils/sampleData';
import { Header } from './components/Header';
import { SummaryMetrics } from './components/SummaryMetrics';
import { UploadZone } from './components/UploadZone';
import { ResultsTable } from './components/ResultsTable';
import { XmlDetailModal } from './components/XmlDetailModal';
import { ApprovalConfigModal } from './components/ApprovalConfigModal';
import { RuleSettingsModal } from './components/RuleSettingsModal';
import { PythonScriptViewer } from './components/PythonScriptViewer';
import { ShieldCheck, Info, FileText } from 'lucide-react';

export default function App() {
  const [selectedProject, setSelectedProject] = useState('K9A1 자주포');
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ValidationResult | null>(null);

  // Modals state
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isPythonModalOpen, setIsPythonModalOpen] = useState(false);

  // Rule Config
  const [ruleConfig, setRuleConfig] = useState<ValidationRuleConfig>({
    checkSyntax: true,
    checkXsd: true,
    checkDmcMatch: true,
    checkHeaderMetadata: true,
    requiredHeaderTags: ['issueDate', 'security']
  });

  // Approval Header Info for Excel
  const [approvalInfo, setApprovalInfo] = useState<ReportApprovalInfo>({
    docNumber: 'PRD-IPS-2026-QA01',
    inspectionDate: new Date().toISOString().slice(0, 10),
    inspectorName: 'IPS 요소개발 신입',
    approverName: '(인/서명)',
    projectName: 'K9A1 자주포',
    department: '한화에어로스페이스 IPS 요소개발 파트'
  });

  // Active XSD Schema
  const [activeXsd, setActiveXsd] = useState<{ filename: string; content: string }>({
    filename: 's1000d_dummy.xsd',
    content: SAMPLE_XSD_SCHEMA
  });

  // Auto-load sample test files on first render if list is empty
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    const parsedResults = SAMPLE_FILES.map((sample) =>
      validateXmlContent(
        sample.filename,
        sample.content,
        sample.content.length,
        Date.now(),
        ruleConfig
      )
    );
    setResults(parsedResults);
  };

  const handleFilesSelected = (files: { filename: string; content: string; lastModified: number; size: number }[]) => {
    const newResults = files.map((f) =>
      validateXmlContent(f.filename, f.content, f.size, f.lastModified, ruleConfig)
    );

    // Filter duplicates by filename
    setResults((prev) => {
      const existingNames = new Set(prev.map((p) => p.filename));
      const filteredNew = newResults.filter((nr) => !existingNames.has(nr.filename));
      const updatedExisting = prev.map((p) => {
        const replaceMatch = newResults.find((nr) => nr.filename === p.filename);
        return replaceMatch || p;
      });
      return [...updatedExisting, ...filteredNew];
    });
  };

  const handleRevalidateAll = () => {
    setResults((prev) =>
      prev.map((p) =>
        validateXmlContent(p.filename, p.rawXml, p.fileSize, p.lastModified, ruleConfig)
      )
    );
  };

  const handleRemoveResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAll = () => {
    setResults([]);
  };

  const handleXsdUploaded = (filename: string, content: string) => {
    setActiveXsd({ filename, content });
    setRuleConfig((prev) => ({
      ...prev,
      customXsdFilename: filename,
      customXsdContent: content
    }));
    alert(`커스텀 XSD 스키마 [${filename}]가 성공적으로 반영되었습니다.`);
  };

  // Calculate Summary Metrics
  const totalCount = results.length;
  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = totalCount - passCount;
  const passRatePercentage = totalCount > 0 ? (passCount / totalCount) * 100 : 0;

  const syntaxErrorsCount = results.filter((r) => r.primaryCategory === 'XML Syntax Error').length;
  const metadataErrorsCount = results.filter((r) => r.primaryCategory === 'Spec / Metadata Error').length;
  const dmcErrorsCount = results.filter((r) => r.primaryCategory === 'DMC Mismatch').length;
  const xsdErrorsCount = results.filter((r) => r.primaryCategory === 'XSD Schema Error').length;

  const summaryStats: SummaryStats = {
    totalCount,
    passCount,
    failCount,
    warningCount: 0,
    passRatePercentage,
    syntaxErrorsCount,
    metadataErrorsCount,
    dmcErrorsCount,
    xsdErrorsCount
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      {/* Top Header */}
      <Header
        onExportExcel={() => setIsApprovalModalOpen(true)}
        onLoadDummySamples={loadSampleData}
        onOpenPythonScripts={() => setIsPythonModalOpen(true)}
        onOpenSettings={() => setIsRuleModalOpen(true)}
        selectedProject={selectedProject}
        onSelectProject={(proj) => {
          setSelectedProject(proj);
          setApprovalInfo((prev) => ({ ...prev, projectName: proj }));
        }}
        totalFiles={results.length}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Document Context Banner */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>한화에어로스페이스 IPS 요소개발파트</strong> — 무기체계 수출(K9, 레드백) S1000D IETM 전자식 기술교범 품질 검수기
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>문서번호: PRD-IPS-2026-001</span>
            <span>•</span>
            <span>보안등급: 사내비 (100% Offline Local Engine)</span>
          </div>
        </div>

        {/* Metric Cards */}
        <SummaryMetrics stats={summaryStats} />

        {/* Drag & Drop Upload Zone */}
        <UploadZone
          onFilesSelected={handleFilesSelected}
          onLoadSamples={loadSampleData}
          activeXsdName={activeXsd.filename}
          onXsdUploaded={handleXsdUploaded}
          isProcessing={false}
        />

        {/* Results Table */}
        <ResultsTable
          results={results}
          onSelectResult={(item) => setSelectedResult(item)}
          onRemoveResult={handleRemoveResult}
          onClearAll={handleClearAll}
          onRevalidateAll={handleRevalidateAll}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>Hanwha Aerospace IPS Element Development Team © 2026. All rights reserved.</p>
        <p className="text-[11px] text-slate-600 mt-0.5">S1000D Issue 4.1/4.2 XML & DMC Linter Engine v1.0</p>
      </footer>

      {/* Modals */}
      <XmlDetailModal
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />

      <ApprovalConfigModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        results={results}
        approvalInfo={approvalInfo}
        onUpdateApprovalInfo={setApprovalInfo}
      />

      <RuleSettingsModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        config={ruleConfig}
        onUpdateConfig={(cfg) => {
          setRuleConfig(cfg);
          handleRevalidateAll();
        }}
      />

      <PythonScriptViewer
        isOpen={isPythonModalOpen}
        onClose={() => setIsPythonModalOpen(false)}
      />
    </div>
  );
}
