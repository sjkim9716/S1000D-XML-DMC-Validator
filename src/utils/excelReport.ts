import ExcelJS from 'exceljs';
import { ValidationResult, ReportApprovalInfo } from '../types';

export async function downloadExcelReport(
  results: ValidationResult[],
  approvalInfo: ReportApprovalInfo
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Hanwha Aerospace IPS Element Development Part';
  workbook.lastModifiedBy = approvalInfo.inspectorName;
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('QA 검수 보고서', {
    views: [{ showGridLines: true }]
  });

  // Styles definition
  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: '94A3B8' } },
    left: { style: 'thin', color: { argb: '94A3B8' } },
    bottom: { style: 'thin', color: { argb: '94A3B8' } },
    right: { style: 'thin', color: { argb: '94A3B8' } }
  };

  const thickBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'medium', color: { argb: '1E293B' } },
    left: { style: 'medium', color: { argb: '1E293B' } },
    bottom: { style: 'medium', color: { argb: '1E293B' } },
    right: { style: 'medium', color: { argb: '1E293B' } }
  };

  const labelFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'F1F5F9' } // Light slate gray
  };

  const summaryFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'E2E8F0' }
  };

  const tableHeaderFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '1E293B' } // Dark slate navy
  };

  const passFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'DCFCE7' } // Soft Emerald Green
  };

  const failFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FEE2E2' } // Soft Crimson Red
  };

  // Row 1: Title Header
  worksheet.mergeCells('A1:D1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'S1000D XML 품질 검수 결과 보고서';
  titleCell.font = { name: '맑은 고딕', size: 16, bold: true, color: { argb: '0F172A' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 36;

  // Row 2: Approval Block Line 1
  const cellA2 = worksheet.getCell('A2');
  cellA2.value = '문  서  번  호';
  cellA2.fill = labelFill;
  cellA2.font = { name: '맑은 고딕', size: 10, bold: true };
  cellA2.alignment = { horizontal: 'center', vertical: 'middle' };
  cellA2.border = thinBorder;

  const cellB2 = worksheet.getCell('B2');
  cellB2.value = approvalInfo.docNumber || 'PRD-IPS-2026-QA01';
  cellB2.font = { name: '맑은 고딕', size: 10 };
  cellB2.alignment = { horizontal: 'center', vertical: 'middle' };
  cellB2.border = thinBorder;

  const cellC2 = worksheet.getCell('C2');
  cellC2.value = '검  수  일  자';
  cellC2.fill = labelFill;
  cellC2.font = { name: '맑은 고딕', size: 10, bold: true };
  cellC2.alignment = { horizontal: 'center', vertical: 'middle' };
  cellC2.border = thinBorder;

  const cellD2 = worksheet.getCell('D2');
  cellD2.value = approvalInfo.inspectionDate || new Date().toISOString().split('T')[0];
  cellD2.font = { name: '맑은 고딕', size: 10 };
  cellD2.alignment = { horizontal: 'center', vertical: 'middle' };
  cellD2.border = thinBorder;
  worksheet.getRow(2).height = 24;

  // Row 3: Approval Block Line 2
  const cellA3 = worksheet.getCell('A3');
  cellA3.value = '검  수  자';
  cellA3.fill = labelFill;
  cellA3.font = { name: '맑은 고딕', size: 10, bold: true };
  cellA3.alignment = { horizontal: 'center', vertical: 'middle' };
  cellA3.border = thinBorder;

  const cellB3 = worksheet.getCell('B3');
  cellB3.value = approvalInfo.inspectorName || 'IPS 요소개발 신입';
  cellB3.font = { name: '맑은 고딕', size: 10 };
  cellB3.alignment = { horizontal: 'center', vertical: 'middle' };
  cellB3.border = thinBorder;

  const cellC3 = worksheet.getCell('C3');
  cellC3.value = '승  인  자';
  cellC3.fill = labelFill;
  cellC3.font = { name: '맑은 고딕', size: 10, bold: true };
  cellC3.alignment = { horizontal: 'center', vertical: 'middle' };
  cellC3.border = thinBorder;

  const cellD3 = worksheet.getCell('D3');
  cellD3.value = approvalInfo.approverName || '(인/서명)';
  cellD3.font = { name: '맑은 고딕', size: 10, italic: true };
  cellD3.alignment = { horizontal: 'center', vertical: 'middle' };
  cellD3.border = thinBorder;
  worksheet.getRow(3).height = 24;

  // Row 4: Empty separator
  worksheet.getRow(4).height = 12;

  // Row 5: Summary Block
  const total = results.length;
  const passCnt = results.filter(r => r.status === 'PASS').length;
  const failCnt = total - passCnt;
  const passRate = total > 0 ? ((passCnt / total) * 100).toFixed(1) : '0.0';

  worksheet.mergeCells('A5:D5');
  const summaryCell = worksheet.getCell('A5');
  summaryCell.value = `[검수 요약]  전체: ${total}건  |  PASS: ${passCnt}건  |  FAIL: ${failCnt}건  |  통과율: ${passRate}%`;
  summaryCell.font = { name: '맑은 고딕', size: 11, bold: true, color: { argb: '1E293B' } };
  summaryCell.fill = summaryFill;
  summaryCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  summaryCell.border = thinBorder;
  worksheet.getRow(5).height = 28;

  // Row 6: Empty separator
  worksheet.getRow(6).height = 10;

  // Row 7: Data Table Headers
  const headers = ['파일명', '상태', '오류 카테고리', '상세 에러 내역'];
  headers.forEach((h, idx) => {
    const colIndex = idx + 1;
    const cell = worksheet.getCell(7, colIndex);
    cell.value = h;
    cell.font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = tableHeaderFill;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thickBorder;
  });
  worksheet.getRow(7).height = 26;

  // Row 8+: Data Rows
  results.forEach((item, index) => {
    const rowIndex = 8 + index;
    const row = worksheet.getRow(rowIndex);

    // Col A: Filename
    const fnCell = row.getCell(1);
    fnCell.value = item.filename;
    fnCell.font = { name: '맑은 고딕', size: 10 };
    fnCell.alignment = { vertical: 'middle' };
    fnCell.border = thinBorder;

    // Col B: Status
    const statusCell = row.getCell(2);
    statusCell.value = item.status;
    statusCell.font = { name: '맑은 고딕', size: 10, bold: true };
    statusCell.alignment = { horizontal: 'center', vertical: 'middle' };
    statusCell.border = thinBorder;
    if (item.status === 'PASS') {
      statusCell.fill = passFill;
      statusCell.font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: '15803D' } };
    } else {
      statusCell.fill = failFill;
      statusCell.font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: 'B91C1C' } };
    }

    // Col C: Category
    const catCell = row.getCell(3);
    catCell.value = item.primaryCategory;
    catCell.font = { name: '맑은 고딕', size: 10 };
    catCell.alignment = { horizontal: 'center', vertical: 'middle' };
    catCell.border = thinBorder;

    // Col D: Detail
    const detailCell = row.getCell(4);
    const detailText = item.errors.length > 0
      ? item.errors.map(e => e.message).join('\n')
      : '모든 규격 검사 통과';
    detailCell.value = detailText;
    detailCell.font = { name: '맑은 고딕', size: 9 };
    detailCell.alignment = { vertical: 'middle', wrapText: true };
    detailCell.border = thinBorder;

    row.height = item.errors.length > 2 ? 40 : 26;
  });

  // Column Widths
  worksheet.getColumn(1).width = 32; // Filename
  worksheet.getColumn(2).width = 12; // Status
  worksheet.getColumn(3).width = 24; // Category
  worksheet.getColumn(4).width = 68; // Detail

  // Generate Buffer and Trigger Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `S1000D_QA_Report_${approvalInfo.docNumber}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
