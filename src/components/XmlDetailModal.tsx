import React, { useState } from 'react';
import { ValidationResult } from '../types';
import { X, CheckCircle2, AlertOctagon, FileCode, Tag, Shield, Calendar, Building2, Copy, Check } from 'lucide-react';

interface XmlDetailModalProps {
  result: ValidationResult | null;
  onClose: () => void;
}

export const XmlDetailModal: React.FC<XmlDetailModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  const [copied, setCopied] = useState(false);

  const xmlLines = result.rawXml.split('\n');
  const errorLineMap = new Map<number, string>();
  result.errors.forEach((e) => {
    if (e.line) errorLineMap.set(e.line, e.message);
  });

  const handleCopyXml = () => {
    navigator.clipboard.writeText(result.rawXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${result.status === 'PASS' ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]' : 'bg-rose-950/80 border border-rose-800 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]'}`}>
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">{result.filename}</h3>
                {result.status === 'PASS' ? (
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-xs font-bold">
                    PASS
                  </span>
                ) : (
                  <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded text-xs font-bold">
                    FAIL ({result.primaryCategory})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                SIZE: {(result.fileSize / 1024).toFixed(2)} KB | TIME: {new Date(result.lastModified).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyXml}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copied ? '복사완료' : 'XML 복사'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Column: Error Summary & Metadata Card (1/3 width) */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/60 p-4 space-y-4 overflow-y-auto">
            {/* DMC Comparison Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-sky-400" />
                DMC 코드 검증
              </h4>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">파일명 DMC:</span>
                  <span className="font-mono font-bold text-sky-300">{result.dmcInFilename || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">XML dmCode:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {result.extractedDmc?.modelIdentCode ? `${result.extractedDmc.modelIdentCode}-${result.extractedDmc.systemCode}` : '미추출'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">매칭 상태:</span>
                  {result.dmcMatchDetails?.isMatch !== false ? (
                    <span className="text-emerald-400 font-bold">일치 (OK)</span>
                  ) : (
                    <span className="text-rose-400 font-bold">불일치 (Mismatch)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Header Metadata Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                S1000D 메타데이터
              </h4>

              <div className="space-y-2 text-slate-300">
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">발행일자 (&lt;issueDate&gt;)</p>
                    <p className="font-mono font-semibold text-white">{result.metadata?.issueDate?.fullDate || <span className="text-rose-400 italic">누락됨</span>}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">보안등급 (&lt;security&gt;)</p>
                    <p className="font-mono font-semibold text-white">{result.metadata?.security?.securityClassification || <span className="text-rose-400 italic">누락됨</span>}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">담당 업체 (&lt;responsiblePartnerCompany&gt;)</p>
                    <p className="font-semibold text-slate-200">{result.metadata?.responsiblePartnerCompany || '미지정'}</p>
                  </div>
                </div>

                {result.metadata?.techData?.dmTitle && (
                  <div className="pt-1.5 border-t border-slate-800">
                    <p className="text-[10px] text-slate-400 font-mono uppercase">제목 (&lt;dmTitle&gt;)</p>
                    <p className="font-semibold text-sky-300">{result.metadata.techData.dmTitle}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Log Callout Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                검수 에러 로그 목록 ({result.errors.length})
              </h4>

              {result.errors.length === 0 ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>모든 문법, DMC, 헤더 규격을 만족합니다.</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {result.errors.map((err, idx) => (
                    <div key={idx} className="p-2.5 bg-rose-950/30 border border-rose-900/60 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between text-rose-300 font-bold">
                        <span>{err.category}</span>
                        {err.line && <span className="font-mono text-[10px] bg-rose-900/60 px-1.5 py-0.5 rounded">Line {err.line}</span>}
                      </div>
                      <p className="text-slate-200 leading-snug">{err.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Code Editor View with line numbers & error highlights */}
          <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden font-mono text-xs">
            <div className="p-2.5 bg-slate-900 border-b border-slate-800 text-slate-400 text-xs flex justify-between items-center font-mono">
              <span className="text-sky-400 font-semibold">XML Source Viewer</span>
              <span className="text-[11px] text-slate-500">TOTAL LINES: {xmlLines.length}</span>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-0 text-slate-300 leading-relaxed">
              {xmlLines.map((lineText, idx) => {
                const lineNum = idx + 1;
                const errorMsg = errorLineMap.get(lineNum);
                const isErrorLine = !!errorMsg;

                return (
                  <div key={idx} className={`flex items-start group ${isErrorLine ? 'bg-rose-950/50 border-l-4 border-rose-500 py-1 -mx-4 px-4' : 'hover:bg-slate-900/50'}`}>
                    {/* Line number */}
                    <span className={`w-12 text-right pr-4 select-none flex-shrink-0 ${isErrorLine ? 'text-rose-400 font-bold' : 'text-slate-600'}`}>
                      {lineNum}
                    </span>

                    {/* Code content */}
                    <div className="flex-1 overflow-x-auto whitespace-pre">
                      <span className={isErrorLine ? 'text-rose-200 font-bold' : 'text-slate-200'}>
                        {lineText || ' '}
                      </span>
                      {isErrorLine && (
                        <div className="text-[11px] font-sans text-rose-300 bg-rose-900/40 p-1.5 mt-1 rounded border border-rose-800/80 flex items-center gap-1.5">
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

