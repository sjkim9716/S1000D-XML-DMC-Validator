import React, { useState } from 'react';
import { 
  ValidationResult, 
  ValidationStatus, 
  ErrorCategory 
} from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Eye, 
  Trash2, 
  RefreshCw, 
  FileText
} from 'lucide-react';

interface ResultsTableProps {
  results: ValidationResult[];
  onSelectResult: (result: ValidationResult) => void;
  onRemoveResult: (id: string) => void;
  onClearAll: () => void;
  onRevalidateAll: () => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  onSelectResult,
  onRemoveResult,
  onClearAll,
  onRevalidateAll
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | ValidationStatus | ErrorCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter logic
  const filteredResults = results.filter((item) => {
    // Category or Status filter
    if (activeFilter === 'PASS') {
      if (item.status !== 'PASS') return false;
    } else if (activeFilter === 'FAIL') {
      if (item.status !== 'FAIL') return false;
    } else if (activeFilter !== 'ALL') {
      if (item.primaryCategory !== activeFilter) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.filename.toLowerCase().includes(q);
      const matchDmc = (item.dmcInFilename || '').toLowerCase().includes(q);
      const matchDetail = item.errors.some((e) => e.message.toLowerCase().includes(q));
      return matchName || matchDmc || matchDetail;
    }

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredResults.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredResults.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchDelete = () => {
    selectedIds.forEach((id) => onRemoveResult(id));
    setSelectedIds([]);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-md overflow-hidden space-y-0">
      {/* Table Controls Header */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-medium">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-sky-500 text-white border-sky-400 font-bold shadow-sm shadow-sky-500/20'
                : 'text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            전체 ({results.length})
          </button>

          <button
            onClick={() => setActiveFilter('PASS')}
            className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'PASS'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 font-bold'
                : 'text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
            PASS ({results.filter((r) => r.status === 'PASS').length})
          </button>

          <button
            onClick={() => setActiveFilter('FAIL')}
            className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'FAIL'
                ? 'bg-rose-950/80 text-rose-300 border-rose-700 font-bold'
                : 'text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]"></span>
            FAIL ({results.filter((r) => r.status === 'FAIL').length})
          </button>

          <button
            onClick={() => setActiveFilter('DMC Mismatch')}
            className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
              activeFilter === 'DMC Mismatch'
                ? 'bg-amber-950/80 text-amber-300 border-amber-700 font-bold'
                : 'text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            DMC 불일치 ({results.filter((r) => r.primaryCategory === 'DMC Mismatch').length})
          </button>

          <button
            onClick={() => setActiveFilter('Spec / Metadata Error')}
            className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
              activeFilter === 'Spec / Metadata Error'
                ? 'bg-sky-950/80 text-sky-300 border-sky-700 font-bold'
                : 'text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            메타데이터 누락 ({results.filter((r) => r.primaryCategory === 'Spec / Metadata Error').length})
          </button>

          <button
            onClick={() => setActiveFilter('XML Syntax Error')}
            className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
              activeFilter === 'XML Syntax Error'
                ? 'bg-rose-950/80 text-rose-300 border-rose-700 font-bold'
                : 'text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            문법 오류 ({results.filter((r) => r.primaryCategory === 'XML Syntax Error').length})
          </button>
        </div>

        {/* Search Bar & Table Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="파일명 또는 DMC 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <button
            onClick={onRevalidateAll}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 rounded-lg transition"
            title="모든 파일 재검수 스캔"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="px-2.5 py-1 text-xs font-semibold bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>선택 삭제 ({selectedIds.length})</span>
            </button>
          )}

          {results.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded-lg transition"
            >
              전체 비우기
            </button>
          )}
        </div>
      </div>

      {/* Main Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800 tracking-wider">
            <tr>
              <th className="py-3 px-3 text-center w-10">
                <input
                  type="checkbox"
                  checked={filteredResults.length > 0 && selectedIds.length === filteredResults.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-700 text-sky-500 focus:ring-sky-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3 text-center w-20">상태</th>
              <th className="py-3 px-4 w-64">파일명</th>
              <th className="py-3 px-4 w-48">XML 내부 DMC</th>
              <th className="py-3 px-4 w-44">오류 카테고리</th>
              <th className="py-3 px-4">검수 결과 상세</th>
              <th className="py-3 px-3 text-center w-24">상세검사</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-sky-400" />
                  <p className="text-sm font-medium font-sans text-slate-300">검수할 XML 파일이 존재하지 않거나 조건에 부합하는 항목이 없습니다.</p>
                  <p className="text-xs mt-1 font-sans text-slate-500">상단에서 파일 드래그앤드롭 또는 [샘플 로드]를 실행하세요.</p>
                </td>
              </tr>
            ) : (
              filteredResults.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const hasDmcMatchError = item.primaryCategory === 'DMC Mismatch';

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/50 transition cursor-pointer ${
                      item.status === 'FAIL' ? 'bg-rose-950/10' : ''
                    } ${isSelected ? 'bg-sky-950/30' : ''}`}
                    onClick={() => onSelectResult(item)}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(item.id)}
                        className="rounded border-slate-700 text-sky-500 focus:ring-sky-500 cursor-pointer"
                      />
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center font-sans">
                      {item.status === 'PASS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                          <CheckCircle2 className="w-3 h-3" />
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-950/80 text-rose-400 border border-rose-800/80 shadow-[0_0_8px_rgba(244,63,94,0.15)]">
                          <XCircle className="w-3 h-3" />
                          FAIL
                        </span>
                      )}
                    </td>

                    {/* Filename */}
                    <td className="py-3 px-4 font-semibold text-slate-100 truncate max-w-[240px]">
                      {item.filename}
                    </td>

                    {/* Extracted DMC */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.extractedDmc?.modelIdentCode ? (
                        <span className={`px-2 py-0.5 rounded border text-[11px] ${
                          hasDmcMatchError 
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800/80' 
                            : 'bg-slate-950 text-sky-300 border-slate-800'
                        }`}>
                          {item.extractedDmc.modelIdentCode}-{item.extractedDmc.systemCode || '00'}
                        </span>
                      ) : (
                        <span className="text-slate-600 italic">미추출</span>
                      )}
                    </td>

                    {/* Primary Category */}
                    <td className="py-3 px-4 font-sans">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium border ${
                        item.primaryCategory === 'None'
                          ? 'bg-slate-950 text-slate-400 border-slate-800'
                          : item.primaryCategory === 'XML Syntax Error'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                          : item.primaryCategory === 'DMC Mismatch'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                          : 'bg-sky-950/80 text-sky-300 border-sky-800'
                      }`}>
                        {item.primaryCategory}
                      </span>
                    </td>

                    {/* Inspection Log Detail */}
                    <td className="py-3 px-4 font-sans text-slate-300 max-w-md truncate">
                      {item.errors.length > 0 ? (
                        <span className="text-rose-300 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          {item.errors[0].message}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">모든 S1000D 규격 검사 통과</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectResult(item)}
                          className="p-1 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded transition"
                          title="XML 소스 및 에러 라인 상세 확인"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveResult(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                          title="목록에서 제거"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

