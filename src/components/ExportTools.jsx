import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaFilePdf,
  FaFileCsv,
  FaFileCode,
} from "react-icons/fa6";

export default function ExportTools({
  title = "Report",
  data = [],
}) {
  const exportJSON = () => {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${title}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((key) => row[key]).join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${title}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 14, 18);

    if (data.length) {
      const headers = Object.keys(data[0]);
      const rows = data.map((item) =>
        headers.map((key) => item[key])
      );

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 28,
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [34, 211, 238],
          textColor: 15,
        },
      });
    }

    doc.save(`${title}.pdf`);
  };

  return (
    <div className="mb-5 flex flex-wrap gap-3">
      <button
        onClick={exportPDF}
        className="flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-105"
      >
        <FaFilePdf />
        PDF
      </button>

      <button
        onClick={exportCSV}
        className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-105"
      >
        <FaFileCsv />
        CSV
      </button>

      <button
        onClick={exportJSON}
        className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:scale-105"
      >
        <FaFileCode />
        JSON
      </button>
    </div>
  );
}