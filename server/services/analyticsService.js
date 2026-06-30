const mongoose = require("mongoose");
const Analysis = require("../models/Analysis");
const Project = require("../models/Project");

function toObjectId(value) {
  return new mongoose.Types.ObjectId(value);
}

function scoreBucket(score) {
  if (score >= 80) return "80-100";
  if (score >= 60) return "60-79";
  if (score >= 40) return "40-59";
  if (score >= 20) return "20-39";
  return "0-19";
}

function readinessLabel(score) {
  if (score >= 80) return "Investor-ready";
  if (score >= 60) return "Promising";
  if (score >= 40) return "Needs validation";
  return "Early exploration";
}

function buildRecommendations({ totalProjects, projectsAnalyzed, averageScore, commonRisks, commonWeaknesses }) {
  const recommendations = [];

  if (totalProjects === 0) {
    recommendations.push("Create your first startup project before reviewing analytics.");
    return recommendations;
  }

  if (projectsAnalyzed < totalProjects) {
    recommendations.push("Validate every active project so portfolio analytics reflect the full pipeline.");
  }

  if (averageScore < 50 && projectsAnalyzed > 0) {
    recommendations.push("Prioritize sharper problem definition and customer validation before expanding MVP scope.");
  }

  if (averageScore >= 70) {
    recommendations.push("Move the strongest ideas into customer interviews, prototype tests, and pricing experiments.");
  }

  if (commonRisks.length > 0) {
    recommendations.push(`Create mitigation plans for repeated risk themes such as ${commonRisks[0].name.toLowerCase()}.`);
  }

  if (commonWeaknesses.length > 0) {
    recommendations.push(`Improve the most common weakness: ${commonWeaknesses[0].name.toLowerCase()}.`);
  }

  if (recommendations.length === 0) {
    recommendations.push("Generate more AI validations to unlock stronger portfolio recommendations.");
  }

  return recommendations;
}

function buildInsights({ industryScores, commonRisks, commonWeaknesses, averageScore, projectsAnalyzed }) {
  const strongestIndustry = industryScores[0];
  const weakestIndustry = [...industryScores].reverse()[0];
  const insights = [];

  if (strongestIndustry) {
    insights.push({
      title: "Strongest industry",
      value: strongestIndustry.name,
      detail: `Average AI score is ${Math.round(strongestIndustry.averageScore)} across ${strongestIndustry.count} analyzed project(s).`,
    });
  }

  if (weakestIndustry && weakestIndustry.name !== strongestIndustry?.name) {
    insights.push({
      title: "Weakest industry",
      value: weakestIndustry.name,
      detail: `Average AI score is ${Math.round(weakestIndustry.averageScore)} and may need deeper validation.`,
    });
  }

  if (commonRisks[0]) {
    insights.push({
      title: "Most common risk",
      value: commonRisks[0].name,
      detail: `Appears in ${commonRisks[0].count} AI validation report(s).`,
    });
  }

  if (commonWeaknesses[0]) {
    insights.push({
      title: "Most common weakness",
      value: commonWeaknesses[0].name,
      detail: `Appears in ${commonWeaknesses[0].count} AI validation report(s).`,
    });
  }

  if (projectsAnalyzed > 0) {
    insights.push({
      title: "Average readiness",
      value: readinessLabel(averageScore),
      detail: `Portfolio average score is ${Math.round(averageScore)} out of 100.`,
    });
  }

  return insights;
}

async function getLatestAnalyses(userId) {
  return Analysis.aggregate([
    {
      $match: {
        user: toObjectId(userId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: "$project",
        analysisId: { $first: "$_id" },
        aiScore: { $first: "$aiScore" },
        risks: { $first: "$risks" },
        weaknesses: { $first: "$weaknesses" },
        createdAt: { $first: "$createdAt" },
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "_id",
        foreignField: "_id",
        as: "project",
      },
    },
    {
      $unwind: "$project",
    },
    {
      $match: {
        "project.user": toObjectId(userId),
      },
    },
    {
      $project: {
        _id: "$analysisId",
        projectId: "$project._id",
        title: "$project.title",
        industry: {
          $cond: [{ $ne: ["$project.industry", ""] }, "$project.industry", "Unspecified"],
        },
        stage: "$project.stage",
        aiScore: 1,
        risks: 1,
        weaknesses: 1,
        createdAt: 1,
      },
    },
  ]);
}

async function getAnalytics(userId) {
  const [projects, latestAnalyses, scoreTrend] = await Promise.all([
    Project.find({ user: userId }).select("title industry stage createdAt").lean(),
    getLatestAnalyses(userId),
    Analysis.aggregate([
      {
        $match: {
          user: toObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          averageScore: { $avg: "$aiScore" },
          analyses: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          label: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          averageScore: { $round: ["$averageScore", 0] },
          analyses: 1,
        },
      },
      {
        $limit: 12,
      },
    ]),
  ]);

  const totalProjects = projects.length;
  const projectsAnalyzed = latestAnalyses.length;
  const activeProjects = projects.filter((project) => project.stage !== "Scale").length;
  const scores = latestAnalyses.map((analysis) => analysis.aiScore);
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
      : 0;

  const highestProject = latestAnalyses.reduce(
    (best, analysis) => (!best || analysis.aiScore > best.aiScore ? analysis : best),
    null
  );
  const lowestProject = latestAnalyses.reduce(
    (worst, analysis) => (!worst || analysis.aiScore < worst.aiScore ? analysis : worst),
    null
  );

  const projectsByStatus = Object.values(
    projects.reduce((acc, project) => {
      const name = project.stage || "Idea";
      acc[name] = acc[name] || { name, value: 0 };
      acc[name].value += 1;
      return acc;
    }, {})
  );

  const projectsByIndustry = Object.values(
    projects.reduce((acc, project) => {
      const name = project.industry || "Unspecified";
      acc[name] = acc[name] || { name, value: 0 };
      acc[name].value += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const scoreDistribution = ["0-19", "20-39", "40-59", "60-79", "80-100"].map((name) => ({
    name,
    value: latestAnalyses.filter((analysis) => scoreBucket(analysis.aiScore) === name).length,
  }));

  const industryScores = Object.values(
    latestAnalyses.reduce((acc, analysis) => {
      const name = analysis.industry || "Unspecified";
      acc[name] = acc[name] || { name, totalScore: 0, count: 0 };
      acc[name].totalScore += analysis.aiScore;
      acc[name].count += 1;
      acc[name].averageScore = acc[name].totalScore / acc[name].count;
      return acc;
    }, {})
  ).sort((a, b) => b.averageScore - a.averageScore);

  const commonRisks = Object.values(
    latestAnalyses
      .flatMap((analysis) => analysis.risks || [])
      .reduce((acc, risk) => {
        acc[risk] = acc[risk] || { name: risk, count: 0 };
        acc[risk].count += 1;
        return acc;
      }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const commonWeaknesses = Object.values(
    latestAnalyses
      .flatMap((analysis) => analysis.weaknesses || [])
      .reduce((acc, weakness) => {
        acc[weakness] = acc[weakness] || { name: weakness, count: 0 };
        acc[weakness].count += 1;
        return acc;
      }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentlyAnalyzed = [...latestAnalyses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const overview = {
    totalProjects,
    projectsAnalyzed,
    averageScore,
    highestScore: highestProject?.aiScore || 0,
    lowestScore: lowestProject?.aiScore || 0,
    activeProjects,
    analyzedPercentage:
      totalProjects > 0 ? Math.round((projectsAnalyzed / totalProjects) * 100) : 0,
  };

  return {
    overview,
    charts: {
      scoreDistribution,
      projectsByStatus,
      projectsByIndustry,
      scoreTrend,
    },
    highlights: {
      highestProject,
      lowestProject,
      recentlyAnalyzed,
    },
    insights: buildInsights({
      industryScores,
      commonRisks,
      commonWeaknesses,
      averageScore,
      projectsAnalyzed,
    }),
    recommendations: buildRecommendations({
      totalProjects,
      projectsAnalyzed,
      averageScore,
      commonRisks,
      commonWeaknesses,
    }),
  };
}

module.exports = {
  getAnalytics,
};
