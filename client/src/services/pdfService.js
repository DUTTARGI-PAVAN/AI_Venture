import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function checkPageBreak(space = 20) {
  if (y + space > 280) {
    doc.addPage();
    y = 20;
  }
}

export function exportAnalyticsPDF(analytics,boardroom) {
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

  // ==========================
// BOARDROOM REPORT
// ==========================

if (boardroom) {

  // Create a new page
  doc.addPage();
  y = 20;

  doc.setFontSize(22);
  doc.text("AI Boardroom Report", 14, y);

  y += 15;

  // Final Decision
  doc.setFontSize(16);
  doc.text("Final Decision", 14, y);

  y += 8;

  doc.setFontSize(11);
  doc.text(String(boardroom.finalDecision), 18, y);

  y += 12;


  // Average Score
  doc.setFontSize(16);
  doc.text("Average Score", 14, y);

  y += 8;

  doc.setFontSize(11);
  doc.text(String(boardroom.averageScore), 18, y);

  y += 12;


  // Consensus Summary
  doc.setFontSize(16);
  doc.text("Consensus Summary", 14, y);

  y += 8;

  const consensusText = doc.splitTextToSize(
    boardroom.consensus,
    170
  );

  doc.setFontSize(11);
  doc.text(consensusText, 18, y);

  y += consensusText.length * 6 + 10;


  // Executive Analysis
  boardroom.agents.forEach((agent) => {

    doc.addPage();

    y = 20;

    doc.setFontSize(20);
    doc.text(`${agent.role} Analysis`, 14, y);

    y += 15;


    // Score
    doc.setFontSize(14);
    doc.text(`Score : ${agent.score}`, 14, y);

    y += 12;


    // Strengths
    doc.setFontSize(14);
    doc.text("Strengths", 14, y);

    y += 8;

    agent.strengths.forEach((item) => {
      doc.setFontSize(11);
      doc.text(`• ${item}`, 18, y);
      y += 7;
    });

    y += 5;


    // Concerns
    doc.setFontSize(14);
    doc.text("Concerns", 14, y);

    y += 8;

    agent.concerns.forEach((item) => {
      doc.setFontSize(11);
      doc.text(`• ${item}`, 18, y);
      y += 7;
    });

    y += 5;


    // Recommendations
    doc.setFontSize(14);
    doc.text("Recommendations", 14, y);

    y += 8;

    agent.recommendations.forEach((item) => {
      doc.setFontSize(11);
      doc.text(`• ${item}`, 18, y);
      y += 7;
    });

  });

}


// Save PDF
doc.save(
  `${analytics.project.title}-Report.pdf`
);
}