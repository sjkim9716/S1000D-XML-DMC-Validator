import React from 'react';
import { CheckCircle2, AlertTriangle, FileCode2, BarChart3, AlertOctagon, Sparkles } from 'lucide-react';
import { SummaryStats } from '../types';

interface SummaryMetricsProps {
  stats: SummaryStats;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ stats }) => {
  const {
    totalCount,
    passCount,
    failCount,
    passRatePercentage,
    syntaxErrorsCount,
    metadataErrorsCount,
    dmcErrorsCount,
    xsdErrorsCount
  } = stats;

  return (
    <div className="space-y-4">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Files Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between hover:border-slate-700 transition">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">전체 XML 데이터 모듈</p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1.5">{totalCount} <span className="text-xs font-sans font-normal text-slate-400">건</span></p>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">IETM BUILD READY</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-sky-950/60 border border-sky-800/60 flex items-center justify-center text-sky-400">
            <FileCode2 className="w-5 h-5" />
          </div>
        </div>

        {/* PASS Card */}
        <div className="bg-slate-900/90 border border-emerald-900/50 rounded-xl p-4 shadow-sm flex items-center justify-between hover:border-emerald-800 transition">
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">규격 통과 (PASS)</p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 mt-1.5">{passCount} <span className="text-xs font-sans font-normal text-emerald-500">건</span></p>
            <p className="text-[11px] text-emerald-500/80 mt-1 font-mono">QUALIFIED 100%</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* FAIL Card */}
        <div className="bg-slate-900/90 border border-rose-900/50 rounded-xl p-4 shadow-sm flex items-center justify-between hover:border-rose-800 transition">
          <div>
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">결함 파일 (FAIL)</p>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-rose-400 mt-1.5">{failCount} <span className="text-xs font-sans font-normal text-rose-500">건</span></p>
            <p className="text-[11px] text-rose-500/80 mt-1 font-mono">ACTION REQUIRED</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        {/* Pass Rate Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between hover:border-slate-700 transition">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">품질 통과율 (Pass Rate)</p>
            <p className={`text-2xl sm:text-3xl font-mono font-bold mt-1.5 ${passRatePercentage >= 90 ? 'text-emerald-400' : passRatePercentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
              {passRatePercentage.toFixed(1)}<span className="text-sm font-sans">%</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">TARGET: 100.0%</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-sky-400">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Secondary Category Breakdown Bar */}
      {failCount > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">오류 유형 세부 분석:</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]"></span>
              <span className="text-slate-400">XML Syntax:</span>
              <span className="font-mono font-bold text-rose-400">{syntaxErrorsCount}건</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]"></span>
              <span className="text-slate-400">DMC 코드:</span>
              <span className="font-mono font-bold text-amber-400">{dmcErrorsCount}건</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_6px_#0ea5e9]"></span>
              <span className="text-slate-400">메타데이터:</span>
              <span className="font-mono font-bold text-sky-400">{metadataErrorsCount}건</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_#a855f7]"></span>
              <span className="text-slate-400">XSD 스키마:</span>
              <span className="font-mono font-bold text-purple-400">{xsdErrorsCount}건</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

