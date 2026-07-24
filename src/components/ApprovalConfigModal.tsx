import React, { useState } from 'react';
import { ReportApprovalInfo, ValidationResult } from '../types';
import { downloadExcelReport } from '../utils/excelReport';
import { FileSpreadsheet, X, Download } from 'lucide-react';

interface ApprovalConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: ValidationResult[];
  approvalInfo: ReportApprovalInfo;
  onUpdateApprovalInfo: (info: ReportApprovalInfo) => void;
}

export const ApprovalConfigModal: React.FC<ApprovalConfigModalProps> = ({
  isOpen,
  onClose,
  results,
  approvalInfo,
  onUpdateApprovalInfo
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<ReportApprovalInfo>(approvalInfo);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    onUpdateApprovalInfo(form);
    try {
      await downloadExcelReport(results, form);
      onClose();
    } catch (err) {
      console.error('Failed to generate excel report:', err);
      alert('엑셀 파일 생성 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  const total = results.length;
  const passCnt = results.filter((r) => r.status === 'PASS').length;
  const failCnt = total - passCnt;
  const passRate = total > 0 ? ((passCnt / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-950/80 border border-sky-800/80 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">엑셀 QA 리포트 상단 결재란 서식 설정</h3>
              <p className="text-xs text-slate-400 font-mono">PRD-IPS-2026-001 Section 6 결재 블록 자동 양식</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">문서 번호 (Document No)</label>
              <input
                type="text"
                value={form.docNumber}
                onChange={(e) => setForm({ ...form, docNumber: e.target.value })}
                className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">검수 일자 (Inspection Date)</label>
              <input
                type="date"
                value={form.inspectionDate}
                onChange={(e) => setForm({ ...form, inspectionDate: e.target.value })}
                className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">검수자 (Inspector Name)</label>
              <input
                type="text"
                value={form.inspectorName}
                onChange={(e) => setForm({ ...form, inspectorName: e.target.value })}
                className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">승인자 서명란 (Approver)</label>
              <input
                type="text"
                value={form.approverName}
                onChange={(e) => setForm({ ...form, approverName: e.target.value })}
                className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Live Excel Layout Preview */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              생성될 엑셀 상단 레이아웃 실시간 미리보기 (PRD Section 6 규격)
            </h4>

            <div className="border border-slate-700 rounded-xl overflow-hidden text-xs bg-slate-950 font-sans">
              {/* Excel Title */}
              <div className="bg-slate-900 border-b border-slate-800 p-3 text-center font-bold text-slate-100 text-sm">
                S1000D XML 품질 검수 결과 보고서
              </div>

              {/* Approval Grid */}
              <div className="grid grid-cols-4 border-b border-slate-800 text-center font-mono">
                <div className="bg-slate-900 border-r border-slate-800 p-2 font-bold text-slate-300">문 서 번 호</div>
                <div className="border-r border-slate-800 p-2 text-sky-300">{form.docNumber}</div>
                <div className="bg-slate-900 border-r border-slate-800 p-2 font-bold text-slate-300">검 수 일 자</div>
                <div className="p-2 text-slate-300">{form.inspectionDate}</div>
              </div>

              <div className="grid grid-cols-4 border-b border-slate-800 text-center font-mono">
                <div className="bg-slate-900 border-r border-slate-800 p-2 font-bold text-slate-300">검  수  자</div>
                <div className="border-r border-slate-800 p-2 text-slate-200">{form.inspectorName}</div>
                <div className="bg-slate-900 border-r border-slate-800 p-2 font-bold text-slate-300">승  인  자</div>
                <div className="p-2 text-slate-400 italic">{form.approverName}</div>
              </div>

              {/* Summary Bar */}
              <div className="bg-slate-800/80 p-2.5 px-4 text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>[검수 요약]</span>
                <span>전체: {total}건</span>
                <span className="text-emerald-400">PASS: {passCnt}건</span>
                <span className="text-rose-400">FAIL: {failCnt}건</span>
                <span className="text-sky-300">통과율: {passRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg transition"
          >
            취소
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-lg shadow-md shadow-sky-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? '엑셀 리포트 생성 중...' : '엑셀 보고서 다운로드 (.xlsx)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

