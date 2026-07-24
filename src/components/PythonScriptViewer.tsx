import React, { useState } from 'react';
import { PYTHON_LINTER_SCRIPT, PYTHON_GENERATE_SAMPLES_SCRIPT, SAMPLE_FILES, SAMPLE_XSD_SCHEMA } from '../utils/sampleData';
import { Download, Copy, Check, X, Terminal, PackageCheck } from 'lucide-react';
import JSZip from 'jszip';

interface PythonScriptViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonScriptViewer: React.FC<PythonScriptViewerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'LINTER' | 'SAMPLES'>('LINTER');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const scriptText = activeTab === 'LINTER' ? PYTHON_LINTER_SCRIPT : PYTHON_GENERATE_SAMPLES_SCRIPT;
  const scriptName = activeTab === 'LINTER' ? 's1000d_linter.py' : 'generate_samples.py';

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = scriptName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullZipPackage = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      
      // Add python scripts
      zip.file('s1000d_linter.py', PYTHON_LINTER_SCRIPT);
      zip.file('generate_samples.py', PYTHON_GENERATE_SAMPLES_SCRIPT);
      zip.file('s1000d_dummy.xsd', SAMPLE_XSD_SCHEMA);

      // Add sample XMLs
      SAMPLE_FILES.forEach((f) => {
        zip.file(f.filename, f.content);
      });

      // Add requirements.txt
      zip.file('requirements.txt', 'lxml>=4.9.0\nopenpyxl>=3.1.0\n');

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Hanwha_S1000D_Offline_Linter_Package.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate offline zip package:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-950/80 border border-sky-800/80 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">사내 폐쇄망 오프라인 파이썬 소스 코드 (FR-7)</h3>
              <p className="text-xs text-slate-400 font-mono">Windows 10/11 로컬 PC 단독 실행 스크립트 모듈</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Action Bar */}
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('LINTER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer font-mono ${
                activeTab === 'LINTER'
                  ? 'bg-sky-500 text-white font-bold shadow-sm shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              s1000d_linter.py (코어 엔진)
            </button>
            <button
              onClick={() => setActiveTab('SAMPLES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer font-mono ${
                activeTab === 'SAMPLES'
                  ? 'bg-sky-500 text-white font-bold shadow-sm shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              generate_samples.py (더미 생성기)
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copied ? '복사 완료' : '코드 복사'}</span>
            </button>

            <button
              onClick={handleDownloadSingle}
              className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-lg flex items-center gap-1 transition cursor-pointer font-mono"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{scriptName} 다운로드</span>
            </button>

            <button
              onClick={handleDownloadFullZipPackage}
              disabled={isZipping}
              className="px-3.5 py-1 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-lg flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition cursor-pointer"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>전체 패키지(.ZIP) 다운로드</span>
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="flex-1 bg-slate-950 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed">
          <pre>{scriptText}</pre>
        </div>
      </div>
    </div>
  );
};

