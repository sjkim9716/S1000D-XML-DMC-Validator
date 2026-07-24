import React, { useRef, useState } from 'react';
import { UploadCloud, FileCode, FolderUp, Sparkles, Shield, FileType } from 'lucide-react';
import JSZip from 'jszip';

interface UploadZoneProps {
  onFilesSelected: (files: { filename: string; content: string; lastModified: number; size: number }[]) => void;
  onLoadSamples: () => void;
  activeXsdName: string;
  onXsdUploaded: (filename: string, content: string) => void;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesSelected,
  onLoadSamples,
  activeXsdName,
  onXsdUploaded,
  isProcessing
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const xsdInputRef = useRef<HTMLInputElement>(null);

  const processFileEntries = async (fileList: FileList | File[]) => {
    const parsedFiles: { filename: string; content: string; lastModified: number; size: number }[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const filename = file.name;

      if (filename.endsWith('.zip')) {
        try {
          const zip = await JSZip.loadAsync(file);
          for (const relativePath of Object.keys(zip.files)) {
            const zipEntry = zip.files[relativePath];
            if (!zipEntry.dir && relativePath.toLowerCase().endsWith('.xml')) {
              const text = await zipEntry.async('string');
              const cleanName = relativePath.split('/').pop() || relativePath;
              parsedFiles.push({
                filename: cleanName,
                content: text,
                lastModified: file.lastModified,
                size: text.length
              });
            }
          }
        } catch (err) {
          console.error('Failed to parse zip file:', err);
        }
      } else if (filename.toLowerCase().endsWith('.xml')) {
        const text = await file.text();
        parsedFiles.push({
          filename: file.name,
          content: text,
          lastModified: file.lastModified,
          size: file.size
        });
      } else if (filename.toLowerCase().endsWith('.xsd')) {
        const text = await file.text();
        onXsdUploaded(file.name, text);
      }
    }

    if (parsedFiles.length > 0) {
      onFilesSelected(parsedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileEntries(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileEntries(e.target.files);
    }
  };

  const handleXsdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      file.text().then((text) => {
        onXsdUploaded(file.name, text);
      });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
      {/* Top Banner & Security Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-sky-400" />
            S1000D XML 파일 업로드 & 검수 스캔
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            단일/다중 XML, 폴더 전체, 또는 .ZIP 압축파일을 드래그앤드롭하세요.
          </p>
        </div>

        {/* Security & XSD Status Badges */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 text-slate-300 text-[11px] px-3 py-1 rounded-lg">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono">사내 폐쇄망 100% 로컬 검수</span>
          </div>

          <div
            onClick={() => xsdInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-sky-950/40 border border-sky-800/60 text-sky-300 text-[11px] px-3 py-1 rounded-lg cursor-pointer hover:bg-sky-900/50 transition"
            title="클릭하여 커스텀 S1000D XSD 스키마 파일(.xsd) 업로드"
          >
            <FileType className="w-3.5 h-3.5 text-sky-400" />
            <span>스키마: <strong className="font-mono text-white underline">{activeXsdName}</strong></span>
          </div>
          <input
            ref={xsdInputRef}
            type="file"
            accept=".xsd"
            className="hidden"
            onChange={handleXsdInputChange}
          />
        </div>
      </div>

      {/* Main Drag & Drop Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer ${
          isDragOver
            ? 'border-sky-400 bg-sky-950/30 shadow-[0_0_20px_rgba(14,165,233,0.15)]'
            : 'border-slate-800 hover:border-slate-600 bg-slate-950/60'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xml,.zip,.xsd"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore - webkitdirectory is non-standard but widely supported
          webkitdirectory=""
          directory=""
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400 shadow-inner">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-100">
            XML 파일들을 이 곳으로 끌어다 놓으세요
          </p>
          <p className="text-xs text-slate-400 mt-1">
            지원 형식: <span className="font-mono text-sky-300 font-semibold">.XML</span>, <span className="font-mono text-sky-300 font-semibold">.ZIP</span>, 또는 커스텀 <span className="font-mono text-sky-300 font-semibold">.XSD</span> 스키마
          </p>
        </div>

        {/* Buttons inside box */}
        <div className="flex items-center gap-3 mt-2 flex-wrap justify-center" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-1.5 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-lg shadow-md shadow-sky-500/20 transition flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5" />
            파일 선택
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <FolderUp className="w-3.5 h-3.5 text-sky-400" />
            폴더 단위 업로드
          </button>

          <button
            onClick={onLoadSamples}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-amber-300 rounded-lg border border-amber-900/60 transition flex items-center gap-1.5"
            title="FR-7 규격 검증용 더미 샘플 4종 자동 로드"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            샘플 더미 로드 (FR-7)
          </button>
        </div>
      </div>
    </div>
  );
};

