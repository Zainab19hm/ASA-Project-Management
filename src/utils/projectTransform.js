function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toSafeString(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function normalizeWBS(wbsRaw) {
  const phases = Array.isArray(wbsRaw) ? wbsRaw : Array.isArray(wbsRaw?.phases) ? wbsRaw.phases : [];

  return phases.map((phase, phaseIndex) => {
    const tasks = Array.isArray(phase?.tasks) ? phase.tasks : [];
    const totalEffort = tasks.reduce((sum, task) => sum + Math.max(0, toNumber(task?.effort_days, 0)), 0);

    const roles = [...new Set(tasks.map((task) => toSafeString(task?.role).trim()).filter(Boolean))];
    const phaseOwner = roles.length ? roles.join(", ") : "Team";

    return {
      id: toSafeString(phase?.phase_id, phaseIndex + 1),
      title: toSafeString(phase?.phase_name, `Phase ${phaseIndex + 1}`),
      owner: phaseOwner,
      effort: `${Math.max(totalEffort, tasks.length || 1)} days`,
      children: tasks.map((task, taskIndex) => ({
        id: toSafeString(task?.task_id, `${phaseIndex + 1}.${taskIndex + 1}`),
        title: toSafeString(task?.task_name, `Task ${taskIndex + 1}`),
        owner: toSafeString(task?.role, "Team"),
        effort: `${Math.max(1, toNumber(task?.effort_days, 1))} days`,
        description: toSafeString(task?.description, ""),
      })),
    };
  });
}

function normalizeGantt(ganttRaw) {
  const tasks = Array.isArray(ganttRaw?.tasks) ? ganttRaw.tasks : [];
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  const ganttTasks = tasks.map((task, index) => {
    const startDay = Math.max(1, toNumber(task?.start_day, index + 1));
    const durationDays = Math.max(1, toNumber(task?.duration_days, 1));
    const start = addDays(baseDate, startDay - 1);
    const end = addDays(start, durationDays);
    const dependencies = Array.isArray(task?.dependencies)
      ? task.dependencies.map((dep) => toSafeString(dep)).filter(Boolean)
      : [];

    return {
      id: toSafeString(task?.id, index + 1),
      name: toSafeString(task?.name, `Task ${index + 1}`),
      start,
      end,
      type: task?.is_milestone ? "milestone" : "task",
      progress: task?.is_milestone ? 100 : 0,
      dependencies: dependencies.join(","),
      hideChildren: false,
      displayOrder: index + 1,
      meta: {
        role: toSafeString(task?.role, "Team"),
        startDay,
        durationDays,
        dependencyList: dependencies,
        description: toSafeString(task?.description, ""),
      },
    };
  });

  const derivedDuration =
    ganttTasks.length > 0
      ? Math.max(...ganttTasks.map((task) => task.meta.startDay + task.meta.durationDays - 1))
      : 0;

  return {
    tasks: ganttTasks,
    totalDurationDays: Math.max(toNumber(ganttRaw?.total_duration_days, 0), derivedDuration),
  };
}

function riskSeverity(probability, impact) {
  const scoreMap = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  const p = scoreMap[toSafeString(probability).toLowerCase()] || 1;
  const i = scoreMap[toSafeString(impact).toLowerCase()] || 1;
  const score = p + i;

  if (score >= 6) return "High";
  if (score >= 4) return "Medium";
  return "Low";
}

function normalizeRisks(riskRaw) {
  const risks = Array.isArray(riskRaw) ? riskRaw : Array.isArray(riskRaw?.risks) ? riskRaw.risks : [];

  return risks.map((risk, index) => ({
    id: toSafeString(risk?.risk_id, index + 1),
    title: toSafeString(risk?.title, `Risk ${index + 1}`),
    category: toSafeString(risk?.category, "General"),
    probability: toSafeString(risk?.probability, "Medium"),
    impact: toSafeString(risk?.impact, "Medium"),
    severity: riskSeverity(risk?.probability, risk?.impact),
    mitigation: toSafeString(risk?.mitigation, "No mitigation provided."),
  }));
}

export function buildProjectFromAnalysis(scopeText, analysis) {
  const wbsRaw = analysis?.wbs ?? [];
  const ganttRaw = analysis?.gantt ?? {};
  const risksRaw = analysis?.risks ?? [];

  const wbsEnvelope = Array.isArray(wbsRaw) ? { phases: wbsRaw } : wbsRaw;
  const riskEnvelope = Array.isArray(risksRaw) ? { risks: risksRaw } : risksRaw;

  const wbs = normalizeWBS(wbsEnvelope);
  const gantt = normalizeGantt(ganttRaw);
  const risks = normalizeRisks(risksRaw);

  const tasksCountFromWbs = wbs.reduce((sum, phase) => sum + phase.children.length, 0);
  const tasksCount = Math.max(tasksCountFromWbs, gantt.tasks.length);
  const risksCount = risks.length;
  const durationDays = gantt.totalDurationDays;

  let confidence = 70;
  if (wbs.length) confidence += 10;
  if (gantt.tasks.length) confidence += 10;
  if (risks.length) confidence += 10;
  confidence = Math.min(98, confidence);

  const title =
    toSafeString(ganttRaw?.project_title) ||
    toSafeString(wbsEnvelope?.project_title) ||
    toSafeString(riskEnvelope?.project_title) ||
    "AI Scope Analysis";

  return {
    title,
    subtitle: "Dynamic AI generated plan",
    scope: scopeText,
    progress: 100,
    tasksCount,
    risksCount,
    duration: `${durationDays || 0} days`,
    confidence,
    wbs,
    ganttTasks: gantt.tasks,
    ganttRawTasks: gantt.tasks,
    risks,
    raw: {
      wbs: wbsEnvelope,
      gantt: ganttRaw,
      risk: riskEnvelope,
    },
  };
}
