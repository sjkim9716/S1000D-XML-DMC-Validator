export const SAMPLE_XSD_SCHEMA = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified">
  <!-- S1000D Dummy Verification Schema for Hanwha Aerospace IPS -->
  <xs:element name="dmodule">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="identAndStatusSection">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="dmAddress">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="dmIdent">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="dmCode">
                            <xs:complexType>
                              <xs:attribute name="modelIdentCode" type="xs:string" use="required"/>
                              <xs:attribute name="systemCode" type="xs:string" use="required"/>
                              <xs:attribute name="subSystemCode" type="xs:string" use="optional"/>
                              <xs:attribute name="subSubCode" type="xs:string" use="optional"/>
                              <xs:attribute name="assyCode" type="xs:string" use="optional"/>
                              <xs:attribute name="disassyCode" type="xs:string" use="optional"/>
                              <xs:attribute name="disassyCodeVariant" type="xs:string" use="optional"/>
                              <xs:attribute name="infoCode" type="xs:string" use="optional"/>
                              <xs:attribute name="infoCodeVariant" type="xs:string" use="optional"/>
                              <xs:attribute name="itemLocationCode" type="xs:string" use="optional"/>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="issueDate" minOccurs="0">
                            <xs:complexType>
                              <xs:attribute name="year" type="xs:string"/>
                              <xs:attribute name="month" type="xs:string"/>
                              <xs:attribute name="day" type="xs:string"/>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="dmTitle" minOccurs="0">
                            <xs:complexType>
                              <xs:sequence>
                                <xs:element name="techName" type="xs:string" minOccurs="0"/>
                                <xs:element name="infoName" type="xs:string" minOccurs="0"/>
                              </xs:sequence>
                            </xs:complexType>
                          </xs:element>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="dmAddressItems" minOccurs="0">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="issueDate" minOccurs="0">
                      <xs:complexType>
                        <xs:attribute name="year" type="xs:string" use="required"/>
                        <xs:attribute name="month" type="xs:string" use="required"/>
                        <xs:attribute name="day" type="xs:string" use="required"/>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="dmStatus">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="security">
                      <xs:complexType>
                        <xs:attribute name="securityClassification" type="xs:string" use="required"/>
                        <xs:attribute name="commercialClassification" type="xs:string" use="optional"/>
                      </xs:complexType>
                    </xs:element>
                    <xs:element name="responsiblePartnerCompany" minOccurs="0">
                      <xs:complexType>
                        <xs:attribute name="enterpriseCode" type="xs:string"/>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="content">
          <xs:complexType>
            <xs:sequence>
              <xs:any minOccurs="0" maxOccurs="unbounded" processContents="lax"/>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`;

export const SAMPLE_FILES = [
  {
    filename: 'DMC-K9A1-12-001.xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<!-- S1000D Issue 4.1 Data Module - Hanwha Aerospace K9A1 Self-Propelled Howitzer -->
<dmodule xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="s1000d_dummy.xsd">
  <identAndStatusSection>
    <dmAddress>
      <dmIdent>
        <dmCode modelIdentCode="K9A1" systemCode="12" subSystemCode="0" subSubCode="0" assyCode="00" disassyCode="00" disassyCodeVariant="A" infoCode="001" infoCodeVariant="A" itemLocationCode="D"/>
        <issueDate year="2026" month="07" day="24"/>
        <dmTitle>
          <techName>K9A1 주포 서보 구동장치</techName>
          <infoName>시스템 개요 및 작동 원리</infoName>
        </dmTitle>
      </dmIdent>
    </dmAddress>
    <dmAddressItems>
      <issueDate year="2026" month="07" day="24"/>
    </dmAddressItems>
    <dmStatus>
      <security securityClassification="01" commercialClassification="Restricted"/>
      <responsiblePartnerCompany enterpriseCode="13579">
        <enterpriseName>한화에어로스페이스 IPS 요소개발파트</enterpriseName>
      </responsiblePartnerCompany>
    </dmStatus>
  </identAndStatusSection>
  <content>
    <description>
      <para>본 기술교범 데이터 모듈(DMC)은 K9A1 자주포 주포 서보 구동장치의 정상 작동 범위 및 점검 절차를 정의합니다.</para>
    </description>
  </content>
</dmodule>`
  },
  {
    filename: 'DMC-K9A1-12-002.xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<!-- S1000D Data Module with DMC Mismatch Error -->
<dmodule xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="s1000d_dummy.xsd">
  <identAndStatusSection>
    <dmAddress>
      <dmIdent>
        <!-- 파일명은 DMC-K9A1-12-002.xml (SystemCode=12) 이지만, 내부 태그는 systemCode="15" 로 불일치함 -->
        <dmCode modelIdentCode="K9A1" systemCode="15" subSystemCode="1" subSubCode="0" assyCode="00" disassyCode="00" disassyCodeVariant="A" infoCode="002" infoCodeVariant="A" itemLocationCode="D"/>
        <issueDate year="2026" month="07" day="24"/>
        <dmTitle>
          <techName>K9A1 유압 제어 밸브</techName>
          <infoName>정비 및 교환 절차</infoName>
        </dmTitle>
      </dmIdent>
    </dmAddress>
    <dmStatus>
      <security securityClassification="01"/>
      <responsiblePartnerCompany enterpriseCode="13579"/>
    </dmStatus>
  </identAndStatusSection>
  <content>
    <description>
      <para>유압 제어 밸브 분해 점검 시 유압유 분출 주의.</para>
    </description>
  </content>
</dmodule>`
  },
  {
    filename: 'DMC-K9A1-12-003.xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<!-- S1000D Data Module with Broken XML Syntax Error (Unclosed issueDate tag) -->
<dmodule xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <identAndStatusSection>
    <dmAddress>
      <dmIdent>
        <dmCode modelIdentCode="K9A1" systemCode="12" subSystemCode="0" subSubCode="0"/>
        <!-- 아래 issueDate 태그의 닫힘 표기(/>)가 누락되어 문법 에러 발생 -->
        <issueDate year="2026" month="07" day="24"
        <dmTitle>
          <techName>포탑 선회 기어박스</techName>
        </dmTitle>
      </dmIdent>
    </dmAddress>
    <dmStatus>
      <security securityClassification="01">
    </dmStatus>
  </identAndStatusSection>
  <content>
    <para>기어박스 윤활유 상태 점검 항목.</para>
  </content>
</dmodule>`
  },
  {
    filename: 'DMC-REDBACK-25-100.xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<!-- Redback IFV Data Module with Missing Mandatory Security Header -->
<dmodule xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="s1000d_dummy.xsd">
  <identAndStatusSection>
    <dmAddress>
      <dmIdent>
        <dmCode modelIdentCode="REDBACK" systemCode="25" subSystemCode="1" subSubCode="0" assyCode="00" disassyCode="00" disassyCodeVariant="A" infoCode="100" infoCodeVariant="A" itemLocationCode="D"/>
        <!-- <issueDate> 태그가 완전히 누락됨 -->
        <dmTitle>
          <techName>Redback 궤도 장력 조절 시스템</techName>
          <infoName>자동 장력 장치 제어기</infoName>
        </dmTitle>
      </dmIdent>
    </dmAddress>
    <dmStatus>
      <!-- 필수 메타데이터인 <security> 보안등급 태그가 누락됨 -->
      <responsiblePartnerCompany enterpriseCode="13579"/>
    </dmStatus>
  </identAndStatusSection>
  <content>
    <description>
      <para>궤도 장력 자동 제어 모듈 점검 가이드.</para>
    </description>
  </content>
</dmodule>`
  }
];

export const PYTHON_LINTER_SCRIPT = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
S1000D XML & DMC Validator Linter (Core Engine)
Hanwha Aerospace IPS Element Development Part
PRD-IPS-2026-001 Reference Implementation
"""

import os
import sys
import glob
import re
from xml.etree import ElementTree as ET
try:
    from lxml import etree
    LXML_AVAILABLE = True
except ImportError:
    LXML_AVAILABLE = False
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from datetime import datetime

def validate_s1000d_xml(filepath, xsd_path=None):
    filename = os.path.basename(filepath)
    errors = []
    category = "None"
    status = "PASS"
    
    # 1. XML Syntax Check
    try:
        if LXML_AVAILABLE:
            parser = etree.XMLParser(recover=False)
            tree = etree.parse(filepath, parser)
            root = tree.getroot()
        else:
            tree = ET.parse(filepath)
            root = tree.getroot()
    except Exception as e:
        return {
            "filename": filename,
            "status": "FAIL",
            "category": "XML Syntax Error",
            "detail": f"XML 문법 오류: {str(e)}"
        }

    # 2. XSD Schema Validation
    if xsd_path and os.path.exists(xsd_path) and LXML_AVAILABLE:
        try:
            xsd_doc = etree.parse(xsd_path)
            schema = etree.XMLSchema(xsd_doc)
            if not schema.validate(tree):
                log = schema.error_log
                errors.append(f"[XSD Violation] {log.last_error.message if log else 'Schema non-compliant'}")
                category = "XSD Schema Error"
        except Exception as ex:
            errors.append(f"[XSD Parser Error] {str(ex)}")
            category = "XSD Schema Error"

    # 3. DMC & Filename Matching Engine
    # Extract dmCode attributes
    dm_code_node = root.find(".//dmCode")
    if dm_code_node is not None:
        model_xml = dm_code_node.get("modelIdentCode", "")
        system_xml = dm_code_node.get("systemCode", "")
        
        # Check against filename patterns (e.g. DMC-K9A1-12-001.xml)
        dmc_match = re.search(r"DMC-([A-Za-z0-9]+)-([0-9]{2})", filename)
        if dmc_match:
            model_fn = dmc_match.group(1)
            system_fn = dmc_match.group(2)
            
            if model_xml.upper() != model_fn.upper() or system_xml != system_fn:
                errors.append(f"[DMC Mismatch] 파일명({model_fn}-{system_fn})과 XML dmCode({model_xml}-{system_xml}) 불일치")
                if category == "None":
                    category = "DMC Mismatch"
    else:
        errors.append("[DMC Error] <dmCode> 태그 누락")
        if category == "None":
            category = "Spec / Metadata Error"

    # 4. Mandatory Header Scan
    issue_date = root.find(".//issueDate")
    if issue_date is None:
        errors.append("[Metadata Error] 필수 헤더 <issueDate> (발행일자) 태그 누락")
        if category == "None":
            category = "Spec / Metadata Error"

    security = root.find(".//security")
    if security is None or not security.get("securityClassification"):
        errors.append("[Metadata Error] 필수 헤더 <security> (보안등급) 태그/속성 누락")
        if category == "None":
            category = "Spec / Metadata Error"

    if errors:
        status = "FAIL"
        detail = " | ".join(errors)
    else:
        status = "PASS"
        detail = "모든 규격 검사 통과"

    return {
        "filename": filename,
        "status": status,
        "category": category,
        "detail": detail
    }

def generate_excel_report(results, output_path="S1000D_QA_Report.xlsx", doc_no="PRD-IPS-2026-QA01", inspector="IPS 요소개발 신입"):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "QA 검수 보고서"
    
    # Border & Font definitions
    thin_border = Border(left=Side(style='thin'), right=Side(style='thin'), top=Side(style='thin'), bottom=Side(style='thin'))
    header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid") # Dark slate
    header_font = Font(name="맑은 고딕", size=10, bold=True, color="FFFFFF")
    label_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
    bold_font = Font(name="맑은 고딕", size=10, bold=True)
    regular_font = Font(name="맑은 고딕", size=10)
    title_font = Font(name="맑은 고딕", size=16, bold=True)
    
    # Title
    ws.merge_cells("A1:D1")
    ws["A1"] = "S1000D XML 품질 검수 결과 보고서"
    ws["A1"].font = title_font
    ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
    
    # Approval Header Block
    ws["A2"] = "문 서 번 호"
    ws["B2"] = doc_no
    ws["C2"] = "검  수  일  자"
    ws["D2"] = datetime.now().strftime("%Y-%m-%d")
    
    ws["A3"] = "검  수  자"
    ws["B3"] = inspector
    ws["C3"] = "승  인  자"
    ws["D3"] = "(인/서명)"
    
    for r in range(2, 4):
        for col in ["A", "B", "C", "D"]:
            cell = ws[f"{col}{r}"]
            cell.border = thin_border
            cell.alignment = Alignment(horizontal="center", vertical="center")
            if col in ["A", "C"]:
                cell.fill = label_fill
                cell.font = bold_font
            else:
                cell.font = regular_font
                
    # Summary Metrics Block
    total = len(results)
    pass_cnt = sum(1 for r in results if r["status"] == "PASS")
    fail_cnt = total - pass_cnt
    pass_rate = (pass_cnt / total * 100) if total > 0 else 0
    
    ws.merge_cells("A5:D5")
    summary_text = f"[검수 요약]  전체: {total}건  |  PASS: {pass_cnt}건  |  FAIL: {fail_cnt}건  |  통과율: {pass_rate:.1f}%"
    ws["A5"] = summary_text
    ws["A5"].font = bold_font
    ws["A5"].fill = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid")
    ws["A5"].alignment = Alignment(horizontal="left", vertical="center")
    ws["A5"].border = thin_border

    # Data Table Headers
    headers = ["파일명", "상태", "오류 카테고리", "상세 에러 내역"]
    for i, h in enumerate(headers, 1):
        cell = ws.cell(row=7, column=i)
        cell.value = h
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
        cell.border = thin_border
        
    # Table Rows
    pass_fill = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid") # Light green
    fail_fill = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid") # Light red
    
    for idx, item in enumerate(results, start=8):
        ws.cell(row=idx, column=1, value=item["filename"]).border = thin_border
        status_cell = ws.cell(row=idx, column=2, value=item["status"])
        status_cell.border = thin_border
        status_cell.alignment = Alignment(horizontal="center")
        status_cell.font = bold_font
        if item["status"] == "PASS":
            status_cell.fill = pass_fill
        else:
            status_cell.fill = fail_fill
            
        ws.cell(row=idx, column=3, value=item["category"]).border = thin_border
        ws.cell(row=idx, column=4, value=item["detail"]).border = thin_border

    # Column Widths
    ws.column_dimensions['A'].width = 30
    ws.column_dimensions['B'].width = 12
    ws.column_dimensions['C'].width = 25
    ws.column_dimensions['D'].width = 65

    wb.save(output_path)
    print(f"Report successfully exported to {output_path}")

if __name__ == "__main__":
    xml_files = glob.glob("*.xml")
    results = [validate_s1000d_xml(f, "s1000d_dummy.xsd") for f in xml_files]
    generate_excel_report(results)
`;

export const PYTHON_GENERATE_SAMPLES_SCRIPT = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate Sample S1000D Test Dataset for Hanwha Aerospace IPS Linter
(generate_samples.py - PRD-IPS-2026-001 FR-7)
"""

import os

def create_sample_files():
    # 1. s1000d_dummy.xsd
    xsd_content = """<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified">
  <xs:element name="dmodule">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="identAndStatusSection">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="dmAddress">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="dmIdent">
                      <xs:complexType>
                        <xs:sequence>
                          <xs:element name="dmCode">
                            <xs:complexType>
                              <xs:attribute name="modelIdentCode" type="xs:string" use="required"/>
                              <xs:attribute name="systemCode" type="xs:string" use="required"/>
                            </xs:complexType>
                          </xs:element>
                          <xs:element name="issueDate" minOccurs="0"/>
                        </xs:sequence>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="dmStatus">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="security">
                      <xs:complexType>
                        <xs:attribute name="securityClassification" type="xs:string" use="required"/>
                      </xs:complexType>
                    </xs:element>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
        <xs:element name="content"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>"""

    # 2. DMC-K9A1-12-001.xml (PASS)
    pass_xml = """<?xml version="1.0" encoding="UTF-8"?>
<dmodule>
  <identAndStatusSection>
    <dmAddress>
      <dmIdent>
        <dmCode modelIdentCode="K9A1" systemCode="12"/>
        <issueDate year="2026" month="07" day="24"/>
      </dmIdent>
    </dmAddress>
    <dmStatus>
      <security securityClassification="01"/>
    </dmStatus>
  </identAndStatusSection>
  <content/>
</dmodule>"""

    # 3. DMC-K9A1-12-002.xml (FAIL: DMC Mismatch)
    dmc_fail_xml = """<?xml version="1.0" encoding="UTF-8"?>
<dmodule>
  <identAndStatusSection>
    <dmAddress>
      <dmIdent>
        <dmCode modelIdentCode="K9A1" systemCode="15"/>
        <issueDate year="2026" month="07" day="24"/>
      </dmIdent>
    </dmAddress>
    <dmStatus>
      <security securityClassification="01"/>
    </dmStatus>
  </identAndStatusSection>
  <content/>
</dmodule>"""

    # 4. DMC-K9A1-12-003.xml (FAIL: XML Syntax Error)
    syntax_fail_xml = """<?xml version="1.0" encoding="UTF-8"?>
<dmodule>
  <identAndStatusSection>
    <dmAddress>
      <dmIdent>
        <issueDate year="2026" month="07" day="24"
      </dmIdent>
    </dmAddress>
  </identAndStatusSection>
</dmodule>"""

    files = {
        "s1000d_dummy.xsd": xsd_content,
        "DMC-K9A1-12-001.xml": pass_xml,
        "DMC-K9A1-12-002.xml": dmc_fail_xml,
        "DMC-K9A1-12-003.xml": syntax_fail_xml
    }

    for name, text in files.items():
        with open(name, "w", encoding="utf-8") as f:
            f.write(text.strip())
        print(f"Created sample file: {name}")

if __name__ == "__main__":
    create_sample_files()
`;
