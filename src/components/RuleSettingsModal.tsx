import React, { useState } from 'react';
import { ValidationRuleConfig } from '../types';
import { Settings, X, Check, Shield, FileCheck, Code, Tag } from 'lucide-react';

interface RuleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ValidationRuleConfig;
  onUpdateConfig: (config: ValidationRuleConfig) => void;
}

export const RuleSettingsModal: React.FC<RuleSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<ValidationRuleConfig>(config);

  const handleSave = () => {
    onUpdateConfig(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-950/80 border border-sky-800/80 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">S1000D 검수 규칙 및 Linter 설정</h3>
              <p className="text-xs text-slate-400 font-mono">한화에어로스페이스 IPS QA Linter 엔진옵션</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {/* FR-1 Syntax Toggle */}
            <label className="flex items-start gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={form.checkSyntax}
                onChange={(e) => setForm({ ...form, checkSyntax: e.target.checked })}
                className="mt-1 rounded border-slate-700 text-sky-500 focus:ring-sky-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                  <Code className="w-3.5 h-3.5 text-rose-400" />
                  FR-1: XML Syntax 문법 검사 활성화
                </span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  태그 닫힘 누락, 속성 따옴표 에러, 구문 오류 감지 시 즉시 FAIL 처리
                </p>
              </div>
            </label>

            {/* FR-2 XSD Schema Toggle */}
            <label className="flex items-start gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={form.checkXsd}
                onChange={(e) => setForm({ ...form, checkXsd: e.target.checked })}
                className="mt-1 rounded border-slate-700 text-sky-500 focus:ring-sky-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                  <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                  FR-2: S1000D XSD 스키마 유효성 검증
                </span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  기본 s1000d_dummy.xsd 또는 프로젝트별 커스텀 XSD 스키마 규격 준수성 검증
                </p>
              </div>
            </label>

            {/* FR-3 DMC Match Toggle */}
            <label className="flex items-start gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={form.checkDmcMatch}
                onChange={(e) => setForm({ ...form, checkDmcMatch: e.target.checked })}
                className="mt-1 rounded border-slate-700 text-sky-500 focus:ring-sky-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  FR-3: DMC & 파일명 매칭 검사 Engine
                </span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  파일명 규격(DMC-K9A1-12-001)과 내부 &lt;dmCode modelIdentCode="K9A1" systemCode="12"&gt; 일치성 검증
                </p>
              </div>
            </label>

            {/* FR-4 Header Metadata Scan Toggle */}
            <label className="flex items-start gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={form.checkHeaderMetadata}
                onChange={(e) => setForm({ ...form, checkHeaderMetadata: e.target.checked })}
                className="mt-1 rounded border-slate-700 text-sky-500 focus:ring-sky-500 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  FR-4: 필수 Header 메타데이터 스캔 Engine
                </span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  S1000D 필수 헤더 &lt;issueDate&gt; (발행일자) 및 &lt;security&gt; (보안등급) 존재 여부 검사
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg transition"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-lg shadow-md shadow-sky-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>규칙 설정 저장</span>
          </button>
        </div>
      </div>
    </div>
  );
};

