import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const COLORS = {
  purpleDeep: [61, 26, 110],   // --purple-deep
  purpleMid: [91, 33, 182],    // --purple-mid
  purpleLight: [124, 58, 237], // --purple-light
  lavender: [167, 139, 250],   // --lavender
  lavenderBg: [237, 233, 254], // --lavender-bg
  teal: [45, 212, 191],        // --teal
  tealDark: [13, 148, 136],    // --teal-dark
  text: [26, 13, 46],          // --text
  text2: [75, 59, 107],        // --text2
  muted: [139, 123, 176],      // --muted
  border: [232, 224, 255],     // --border
  white: [255, 255, 255],
};

function formatRating(value) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return `${Number(value).toFixed(1)} / 5`;
}

function drawSectionHeader(doc, text, x, y) {
  doc.setFillColor(...COLORS.teal);
  doc.rect(x, y - 4, 3, 5, "F");
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...COLORS.purpleDeep);
  doc.text(text, x + 6, y);
  doc.setFont(undefined, "normal");
}

function drawHeaderBand(doc, { conferenceName, activeRange }) {
  const pageWidth = doc.internal.pageSize.getWidth();


  doc.setFillColor(...COLORS.purpleDeep);
  doc.rect(0, 0, pageWidth, 30, "F");


  doc.setFillColor(...COLORS.teal);
  doc.rect(0, 30, pageWidth, 1.5, "F");


  doc.setFontSize(9);
  doc.setTextColor(...COLORS.lavender);
  doc.setFont(undefined, "bold");
  doc.text("GSR · PMO DASHBOARD", 14, 10);


  doc.setFontSize(18);
  doc.setTextColor(...COLORS.white);
  doc.setFont(undefined, "bold");
  doc.text(conferenceName || "Analytics Report", 14, 21);
  doc.setFont(undefined, "normal");


  doc.setFontSize(9);
  doc.setTextColor(...COLORS.lavender);
  doc.text(`Range: ${activeRange}`, pageWidth - 14, 10, { align: "right" });
  doc.setTextColor(...COLORS.white);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    pageWidth - 14,
    16,
    { align: "right" }
  );

  return 40;
}

function drawFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text("GSR Conference Admin Dashboard", 14, pageHeight - 8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 8, {
      align: "right",
    });
  }
}

const tableTheme = {
  theme: "grid",
  styles: {
    fontSize: 9,
    textColor: COLORS.text,
    lineColor: COLORS.border,
    lineWidth: 0.2,
  },
  headStyles: {
    fillColor: COLORS.purpleLight,
    textColor: COLORS.white,
    fontStyle: "bold",
  },
  alternateRowStyles: {
    fillColor: COLORS.lavenderBg,
  },
};

export function generateAnalyticsPDF({
  conferenceName,
  activeRange,
  kpis,
  registrationData,
  sessionFeedback,
  conferenceFeedback,
  conferenceNameById,
}) {
  const doc = new jsPDF();
  let y = drawHeaderBand(doc, { conferenceName, activeRange });

  const checkPageBreak = (neededSpace = 40) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + neededSpace > pageHeight - 15) {
      doc.addPage();
      y = 20;
    }
  };


  drawSectionHeader(doc, "Performance KPIs", 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: kpis.map((kpi) => [kpi.label, kpi.value]),
    ...tableTheme,
  });
  y = doc.lastAutoTable.finalY + 12;


  if (registrationData.length > 0) {
    checkPageBreak();
    drawSectionHeader(doc, "Registration Volume", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Time", "Registrations"]],
      body: registrationData.map((r) => [r.time, r.value]),
      ...tableTheme,
    });
    y = doc.lastAutoTable.finalY + 12;
  }


  if (sessionFeedback.length > 0) {
    checkPageBreak();
    drawSectionHeader(doc, "Session Feedback", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Session", "Speaker", "Efficiency", "Overall", "Comments"]],
      body: sessionFeedback.map((f) => [
        f.session_id,
        formatRating(f.speaker_communication_rating),
        formatRating(f.session_efficiency_rating),
        formatRating(f.overall_rating),
        f.additional_comments || "—",
      ]),
      columnStyles: { 4: { cellWidth: 55 } },
      ...tableTheme,
    });
    y = doc.lastAutoTable.finalY + 12;
  }


  if (conferenceFeedback.length > 0) {
    checkPageBreak();
    drawSectionHeader(doc, "Conference Feedback", 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [["Conference", "Rating", "Feedback Count", "Comments"]],
      body: conferenceFeedback.map((f) => [
        conferenceNameById[f.conference_id] || f.conference_id,
        formatRating(f.avg_overall_rating),
        f.feedback_count,
        f.additional_comments || "—",
      ]),
      columnStyles: { 3: { cellWidth: 55 } },
      ...tableTheme,
    });
  }

  drawFooter(doc);
  return doc;
}