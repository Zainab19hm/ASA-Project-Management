# backend/apps/analyze/services/export_service.py
"""
Export Service — generates PDF documents from structured project data.
Used by the /export/pdf endpoint.
"""
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER


def build_wbs_pdf(data: dict) -> bytes:
    """Generate a PDF for WBS data and return raw bytes."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("title", parent=styles["Heading1"],
                                 textColor=colors.HexColor("#0891b2"), fontSize=18)
    heading_style = ParagraphStyle("heading", parent=styles["Heading2"],
                                   textColor=colors.HexColor("#1e293b"), fontSize=13)
    body_style = ParagraphStyle("body", parent=styles["Normal"],
                                fontSize=10, leading=14)

    story = []
    story.append(Paragraph(data.get("project_title", "Project WBS"), title_style))
    story.append(Spacer(1, 0.4*cm))

    for phase in data.get("phases", []):
        story.append(Paragraph(f"Phase {phase['phase_id']}: {phase['phase_name']}", heading_style))
        story.append(Spacer(1, 0.2*cm))

        table_data = [["Task ID", "Task Name", "Role", "Effort (Days)"]]
        for task in phase.get("tasks", []):
            table_data.append([
                task.get("task_id", ""),
                task.get("task_name", ""),
                task.get("role", ""),
                str(task.get("effort_days", "")),
            ])

        t = Table(table_data, colWidths=[2*cm, 7*cm, 5*cm, 3*cm])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0891b2")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f8fafc"), colors.white]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(t)
        story.append(Spacer(1, 0.5*cm))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()


def build_risk_pdf(data: dict) -> bytes:
    """Generate a PDF for Risk Log data and return raw bytes."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("title", parent=styles["Heading1"],
                                 textColor=colors.HexColor("#f43f5e"), fontSize=18)

    story = []
    story.append(Paragraph(f"Risk Log — {data.get('project_title', '')}", title_style))
    story.append(Spacer(1, 0.4*cm))

    table_data = [["#", "Title", "Category", "Probability", "Impact", "Mitigation"]]
    for risk in data.get("risks", []):
        table_data.append([
            str(risk.get("risk_id", "")),
            risk.get("title", ""),
            risk.get("category", ""),
            risk.get("probability", ""),
            risk.get("impact", ""),
            risk.get("mitigation", ""),
        ])

    t = Table(table_data, colWidths=[1*cm, 4*cm, 3*cm, 2.5*cm, 2.5*cm, 4*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f43f5e")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#fff1f2"), colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#fecdd3")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("WORDWRAP", (0, 0), (-1, -1), True),
    ]))
    story.append(t)

    doc.build(story)
    buffer.seek(0)
    return buffer.read()


def build_gantt_pdf(data: dict) -> bytes:
    """Generate a PDF for Gantt data and return raw bytes."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("title", parent=styles["Heading1"],
                                 textColor=colors.HexColor("#7c3aed"), fontSize=18)

    story = []
    story.append(Paragraph(
        f"Gantt Schedule — {data.get('project_title', '')} "
        f"({data.get('total_duration_days', '')} days)",
        title_style
    ))
    story.append(Spacer(1, 0.4*cm))

    table_data = [["ID", "Task Name", "Role", "Start Day", "Duration", "Dependencies"]]
    for task in data.get("tasks", []):
        deps = ", ".join(str(d) for d in task.get("dependencies", [])) or "—"
        table_data.append([
            str(task.get("id", "")),
            task.get("name", ""),
            task.get("role", ""),
            str(task.get("start_day", "")),
            str(task.get("duration_days", "")),
            deps,
        ])

    t = Table(table_data, colWidths=[1*cm, 5*cm, 4*cm, 2.5*cm, 2.5*cm, 2*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#7c3aed")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#f5f3ff"), colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#ddd6fe")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)

    doc.build(story)
    buffer.seek(0)
    return buffer.read()