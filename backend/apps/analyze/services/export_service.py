"""Export service for generating PDF and PNG files from analysis outputs."""

from __future__ import annotations

import io

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def _stringify(value) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return ", ".join(str(item) for item in value)
    return str(value)


def _normalize_rows(rows: list[list[str]], col_count: int) -> list[list[str]]:
    if rows:
        return rows
    return [["No data", *([""] * (col_count - 1))]]


def _build_table_pdf(
    title: str,
    headers: list[str],
    rows: list[list[str]],
    header_color: str,
    row_color: str,
    grid_color: str,
    col_widths_cm: list[float],
) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "export_title",
        parent=styles["Heading1"],
        textColor=colors.HexColor(header_color),
        fontSize=16,
        leading=20,
    )

    table_data = [headers] + _normalize_rows(rows, len(headers))
    table = Table(
        table_data,
        colWidths=[width * cm for width in col_widths_cm],
        repeatRows=1,
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(header_color)),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor(row_color), colors.white]),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor(grid_color)),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )

    story = [Paragraph(title, title_style), Spacer(1, 0.4 * cm), table]
    doc.build(story)
    return buffer.getvalue()


def _wrap_text(text: str, max_width: int, draw: ImageDraw.ImageDraw, font: ImageFont.ImageFont) -> list[str]:
    text = text.strip()
    if not text:
        return [""]

    words = text.split()
    lines: list[str] = []
    current = words[0]

    for word in words[1:]:
        candidate = f"{current} {word}"
        width = int(draw.textlength(candidate, font=font))
        if width <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def _draw_table_png(
    title: str,
    headers: list[str],
    rows: list[list[str]],
    header_color: str,
    alt_row_color: str,
    line_color: str,
) -> bytes:
    width = 1400
    margin = 30
    title_gap = 30
    inner_pad = 8
    header_height = 36

    image = Image.new("RGB", (width, 100), "white")
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()

    column_count = len(headers)
    table_width = width - 2 * margin
    col_width = table_width // column_count
    col_widths = [col_width] * column_count
    col_widths[-1] = table_width - sum(col_widths[:-1])

    safe_rows = _normalize_rows(rows, column_count)
    wrapped_rows: list[list[list[str]]] = []
    row_heights: list[int] = []

    for row in safe_rows:
        wrapped_cells: list[list[str]] = []
        line_counts: list[int] = []
        for idx, cell in enumerate(row):
            lines = _wrap_text(_stringify(cell), col_widths[idx] - (2 * inner_pad), draw, font)
            wrapped_cells.append(lines)
            line_counts.append(len(lines))
        wrapped_rows.append(wrapped_cells)
        row_heights.append(max(24, max(line_counts) * 14 + (2 * inner_pad)))

    total_height = margin + 24 + title_gap + header_height + sum(row_heights) + margin
    image = Image.new("RGB", (width, total_height), "white")
    draw = ImageDraw.Draw(image)

    draw.text((margin, margin), title, fill="#111827", font=font)

    y = margin + 24 + title_gap
    draw.rectangle([(margin, y), (margin + table_width, y + header_height)], fill=header_color, outline=line_color)

    x = margin
    for idx, header in enumerate(headers):
        draw.text((x + inner_pad, y + 10), header, fill="white", font=font)
        x += col_widths[idx]
        draw.line([(x, y), (x, total_height - margin)], fill=line_color, width=1)

    draw.line([(margin, y + header_height), (margin + table_width, y + header_height)], fill=line_color, width=1)

    current_y = y + header_height
    for row_idx, wrapped_cells in enumerate(wrapped_rows):
        row_height = row_heights[row_idx]
        row_bg = alt_row_color if row_idx % 2 == 0 else "white"
        draw.rectangle(
            [(margin, current_y), (margin + table_width, current_y + row_height)],
            fill=row_bg,
            outline=line_color,
        )

        current_x = margin
        for col_idx, lines in enumerate(wrapped_cells):
            text_y = current_y + inner_pad
            for line in lines:
                draw.text((current_x + inner_pad, text_y), line, fill="#111827", font=font)
                text_y += 14
            current_x += col_widths[col_idx]

        current_y += row_height
        draw.line([(margin, current_y), (margin + table_width, current_y)], fill=line_color, width=1)

    out = io.BytesIO()
    image.save(out, format="PNG")
    return out.getvalue()


def _wbs_rows(data: dict) -> list[list[str]]:
    rows: list[list[str]] = []
    for phase in data.get("phases", []):
        phase_id = _stringify(phase.get("phase_id", ""))
        phase_name = _stringify(phase.get("phase_name", ""))
        phase_text = f"{phase_id} {phase_name}".strip()
        for task in phase.get("tasks", []):
            rows.append(
                [
                    phase_text,
                    _stringify(task.get("task_id", "")),
                    _stringify(task.get("task_name", "")),
                    _stringify(task.get("role", "")),
                    _stringify(task.get("effort_days", "")),
                ]
            )
    return rows


def _gantt_rows(data: dict) -> list[list[str]]:
    rows: list[list[str]] = []
    for task in data.get("tasks", []):
        rows.append(
            [
                _stringify(task.get("id", "")),
                _stringify(task.get("name", "")),
                _stringify(task.get("role", "")),
                _stringify(task.get("start_day", "")),
                _stringify(task.get("duration_days", "")),
                _stringify(task.get("dependencies", [])),
            ]
        )
    return rows


def _risk_rows(data: dict) -> list[list[str]]:
    rows: list[list[str]] = []
    for risk in data.get("risks", []):
        rows.append(
            [
                _stringify(risk.get("risk_id", "")),
                _stringify(risk.get("title", "")),
                _stringify(risk.get("category", "")),
                _stringify(risk.get("probability", "")),
                _stringify(risk.get("impact", "")),
                _stringify(risk.get("mitigation", "")),
            ]
        )
    return rows


def build_wbs_pdf(data: dict) -> bytes:
    title = f"WBS - {_stringify(data.get('project_title', 'Project'))}"
    headers = ["Phase", "Task ID", "Task", "Role", "Effort (days)"]
    return _build_table_pdf(
        title=title,
        headers=headers,
        rows=_wbs_rows(data),
        header_color="#0f766e",
        row_color="#ecfeff",
        grid_color="#99f6e4",
        col_widths_cm=[3.5, 2.0, 7.0, 3.0, 2.5],
    )


def build_gantt_pdf(data: dict) -> bytes:
    duration = _stringify(data.get("total_duration_days", ""))
    title = f"Gantt - {_stringify(data.get('project_title', 'Project'))} ({duration} days)"
    headers = ["ID", "Task", "Role", "Start", "Duration", "Dependencies"]
    return _build_table_pdf(
        title=title,
        headers=headers,
        rows=_gantt_rows(data),
        header_color="#4338ca",
        row_color="#eef2ff",
        grid_color="#c7d2fe",
        col_widths_cm=[1.2, 7.0, 3.2, 2.0, 2.0, 2.6],
    )


def build_risk_pdf(data: dict) -> bytes:
    title = f"Risk Log - {_stringify(data.get('project_title', 'Project'))}"
    headers = ["#", "Title", "Category", "Probability", "Impact", "Mitigation"]
    return _build_table_pdf(
        title=title,
        headers=headers,
        rows=_risk_rows(data),
        header_color="#b91c1c",
        row_color="#fef2f2",
        grid_color="#fecaca",
        col_widths_cm=[1.0, 4.5, 2.5, 2.5, 2.0, 5.5],
    )


def build_wbs_png(data: dict) -> bytes:
    title = f"WBS - {_stringify(data.get('project_title', 'Project'))}"
    headers = ["Phase", "Task ID", "Task", "Role", "Effort (days)"]
    return _draw_table_png(
        title=title,
        headers=headers,
        rows=_wbs_rows(data),
        header_color="#0f766e",
        alt_row_color="#ecfeff",
        line_color="#99f6e4",
    )


def build_gantt_png(data: dict) -> bytes:
    title = f"Gantt - {_stringify(data.get('project_title', 'Project'))}"
    headers = ["ID", "Task", "Role", "Start", "Duration", "Dependencies"]
    return _draw_table_png(
        title=title,
        headers=headers,
        rows=_gantt_rows(data),
        header_color="#4338ca",
        alt_row_color="#eef2ff",
        line_color="#c7d2fe",
    )


def build_risk_png(data: dict) -> bytes:
    title = f"Risk Log - {_stringify(data.get('project_title', 'Project'))}"
    headers = ["#", "Title", "Category", "Probability", "Impact", "Mitigation"]
    return _draw_table_png(
        title=title,
        headers=headers,
        rows=_risk_rows(data),
        header_color="#b91c1c",
        alt_row_color="#fef2f2",
        line_color="#fecaca",
    )
