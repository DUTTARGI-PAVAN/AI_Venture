import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportAnalyticsPDF(analytics) {
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(22);
  doc.text("AI Venture Report", 14, y);

  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(100);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    y
  );

  y += 12;

  // Project Information
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("Project Information", 14, y);

  y += 8;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    head: [["Field", "Value"]],
    body: [
      ["Title", analytics.project.title],
      ["Industry", analytics.project.industry],
      ["Stage", analytics.project.stage],
      ["Description", analytics.project.description],
    ],
  });

  y = doc.lastAutoTable.finalY + 12;

  // Scores
  doc.setFontSize(16);
  doc.text("Scores", 14, y);

  y += 8;

  autoTable(doc, {
    startY: y,
    theme: "striped",
    head: [["Metric", "Value"]],
    body: [
      ["AI Score", analytics.aiScore],
      ["Boardroom Score", analytics.boardroomScore],
      ["Final Decision", analytics.finalDecision],
    ],
  });

  y = doc.lastAutoTable.finalY + 12;

  // Executive Scores
  doc.setFontSize(16);
  doc.text("Executive Scores", 14, y);

  y += 8;

  autoTable(doc, {
    startY: y,
    head: [["Executive", "Score"]],
    body: analytics.executiveScores.map((e) => [
      e.role,
      e.score,
    ]),
  });

  y = doc.lastAutoTable.finalY + 12;

  function addSection(title, items) {
    doc.setFontSize(16);
    doc.text(title, 14, y);

    y += 8;

    items.forEach((item) => {
      doc.setFontSize(11);
      doc.text(`• ${item}`, 18, y);
      y += 7;
    });

    y += 5;
  }

  addSection("Strengths", analytics.strengths);

  addSection("Weaknesses", analytics.weaknesses);

  addSection("Risks", analytics.risks);

  doc.setFontSize(16);
  doc.text("Revenue Model", 14, y);

  y += 8;

  doc.setFontSize(11);
  doc.text(
    analytics.revenueModel,
    18,
    y,
    { maxWidth: 170 }
  );

  y += 25;

  doc.setFontSize(16);
  doc.text("Suggested MVP", 14, y);

  y += 8;

  doc.setFontSize(11);
  doc.text(
    analytics.suggestedMvp,
    18,
    y,
    { maxWidth: 170 }
  );

  doc.save(
    `${analytics.project.title}-Report.pdf`
  );
}