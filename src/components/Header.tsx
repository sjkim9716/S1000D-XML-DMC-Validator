import React from 'react';
import { ShieldCheck, FileSpreadsheet, Code, Settings, Sparkles, Layers } from 'lucide-react';

interface HeaderProps {
  onExportExcel: () => void;
  onLoadDummySamples: () => void;
  onOpenPythonScripts: () => void;
  onOpenSettings: () => void;
  selectedProject: string;
  onSelectProject: (proj: string) => void;
  totalFiles: number;
}

export const Header: React.FC<HeaderProps> = ({
  onExportExcel,
  onLoadDummySamples,
  onOpenPythonScripts,
  onOpenSettings,
  selectedProject,
  onSelectProject,
  totalFiles
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand & App Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-white tracking-tighter shadow-md shadow-sky-500/20 text-sm">
              S1K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 rounded">
                  HANWHA IPS
                </span>
                <span className="text-xs text-sky-300 font-mono font-bold hidden sm:inline-block">PRD-IPS-2026-001</span>
                <span className="text-xs bg-slate-800 text-sky-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono font-bold">
                  v1.0
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                S1000D XML & DMC Validator
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider hidden lg:inline-block">
                  — IPS QA Linter Engine
                </span>
              </h1>
            </div>
          </div>

          {/* Center: Project Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/80">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs text-slate-300 font-medium">프로젝트:</span>
            <select
              value={selectedProject}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-sky-300 border border-slate-700 rounded px-2.5 py-1 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="K9A1 자주포">K9A1 자주포 (M12/M15)</option>
              <option value="레드백 장갑차">레드백(Redback) 장갑차 (M25)</option>
              <option value="천무 다연장">천무 다연장 (M30)</option>
              <option value="범용 S1000D">범용 S1000D 표준</option>
            </select>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            {/* Local Secure Mode indicator badge from design */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700/80">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-[11px] font-mono font-medium text-slate-300">LOCAL_SECURE_MODE</span>
            </div>

            <button
              onClick={onLoadDummySamples}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              title="FR-7 테스트용 샘플 XML 자동 생성 및 로드"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">샘플 로드</span>
            </button>

            <button
              onClick={onOpenPythonScripts}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
              title="사내 오프라인 파이썬 스크립트 보기"
            >
              <Code className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Python</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-800 transition"
              title="검수 규칙 설정"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onExportExcel}
              disabled={totalFiles === 0}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 transition ${
                totalFiles > 0
                  ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">EXPORT EXCEL</span>
              <span className="sm:hidden">엑셀</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

