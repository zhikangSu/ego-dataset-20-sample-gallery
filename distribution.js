(() => {
  "use strict";

  const CATALOG = window.EGO_GALLERY || [];
  const SCENES = window.EGO_SCENES || {};
  const COMPARISON = window.EGO_SCENE_COMPARISON || {};
  const LEVELS = {
    physical: {label: "物理地点", color: "var(--accent)", order: 0},
    semantic: {label: "语义场景", color: "var(--blue)", order: 1},
    activity: {label: "活动 / 任务", color: "var(--amber)", order: 2},
    interaction: {label: "交互目标", color: "var(--purple)", order: 3},
    composition: {label: "场景构成", color: "#78868d", order: 4},
    unavailable: {label: "不可量化", color: "var(--red)", order: 5}
  };
  const AVAILABILITY = {
    frequency: {label: "有频次", order: 3},
    taxonomy: {label: "只有类别", order: 2},
    scope: {label: "范围 / 总量", order: 1},
    none: {label: "不可得", order: 0}
  };
  const STATUS = {
    computed: "公开文件复算",
    reported: "官方汇总",
    taxonomy: "仅类别 / 范围",
    unavailable: "暂不可量化"
  };
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[char]);
  const arr = value => Array.isArray(value) ? value : [];
  const finite = value => value !== null && value !== "" && Number.isFinite(Number(value));
  const levelStyle = level => `--level-color:${LEVELS[level]?.color || "var(--accent)"}`;
  const availabilityPill = value => `<span class="pill ${esc(value)}">${esc(AVAILABILITY[value]?.label || value)}</span>`;
  const datasetLink = record => `<a href="index.html#dataset-${esc(record.slug)}" target="_blank" rel="noopener">${esc(record.name)}</a>`;

  function primaryChart(scene) {
    return arr(scene.charts)[0] || null;
  }

  function topFact(chart) {
    const items = arr(chart?.items).filter(item => finite(item.value));
    if (!items.length) return null;
    const top = items.reduce((best, item) => Number(item.value) > Number(best.value) ? item : best, items[0]);
    const total = finite(chart.total) && Number(chart.total) > 0 ? Number(chart.total) : null;
    return {
      label: top.label,
      value: Number(top.value),
      share: total ? Number(top.value) / total * 100 : null,
      total,
      unit: chart.unit || ""
    };
  }

  const RECORDS = CATALOG.map(dataset => {
    const scene = SCENES[dataset.slug] || {};
    const comparison = COMPARISON[dataset.slug] || {level: "unavailable", scene: "none", task: "none"};
    const chart = primaryChart(scene);
    const top = topFact(chart);
    return {
      ...dataset,
      sceneData: scene,
      comparison,
      chart,
      top,
      search: [
        dataset.name, dataset.slug, dataset.summary, scene.basis, scene.scope, scene.note,
        comparison.sceneNote, comparison.taskNote,
        ...arr(scene.taxonomy),
        ...arr(scene.charts).flatMap(item => [item.dimension, ...arr(item.items).map(row => row.label)])
      ].filter(Boolean).join(" ").toLowerCase()
    };
  });

  const state = {view: "matrix"};
  const elements = {
    q: document.getElementById("q"),
    level: document.getElementById("level"),
    evidence: document.getElementById("evidence"),
    sort: document.getElementById("sort"),
    quantified: document.getElementById("quantified"),
    result: document.getElementById("result"),
    stats: document.getElementById("stats"),
    coverage: document.getElementById("coverageGrid"),
    lanes: document.getElementById("levelLanes"),
    body: document.getElementById("compareBody"),
    grid: document.getElementById("smallGrid"),
    matrixView: document.getElementById("matrixView"),
    chartsView: document.getElementById("chartsView")
  };

  function filteredRecords() {
    const query = elements.q.value.trim().toLowerCase();
    const level = elements.level.value;
    const evidence = elements.evidence.value;
    const quantified = elements.quantified.checked;
    const records = RECORDS.filter(record => (
      (!query || record.search.includes(query)) &&
      (!level || record.comparison.level === level) &&
      (!evidence || record.sceneData.status === evidence) &&
      (!quantified || record.comparison.scene === "frequency" || record.comparison.task === "frequency")
    ));
    const sort = elements.sort.value;
    records.sort((a, b) => {
      if (sort === "level") return (LEVELS[a.comparison.level]?.order ?? 99) - (LEVELS[b.comparison.level]?.order ?? 99) || a.no - b.no;
      if (sort === "coverage") {
        const score = record => (AVAILABILITY[record.comparison.scene]?.order || 0) + (AVAILABILITY[record.comparison.task]?.order || 0);
        return score(b) - score(a) || a.no - b.no;
      }
      if (sort === "concentration") return (b.top?.share ?? -1) - (a.top?.share ?? -1) || a.no - b.no;
      return a.no - b.no;
    });
    return records;
  }

  function renderStats() {
    const evidence = RECORDS.reduce((memo, record) => {
      memo[record.sceneData.status] = (memo[record.sceneData.status] || 0) + 1;
      return memo;
    }, {});
    const physicalFrequency = RECORDS.filter(record => record.comparison.scene === "frequency").length;
    const taskFrequency = RECORDS.filter(record => record.comparison.task === "frequency").length;
    elements.stats.innerHTML = `
      <div class="stat"><b>${RECORDS.length}</b><span>重点 ego 数据集</span></div>
      <div class="stat"><b>${physicalFrequency}</b><span>物理场景有类别频次</span></div>
      <div class="stat"><b>${taskFrequency}</b><span>任务 / 活动 / 交互有频次</span></div>
      <div class="stat"><b>${evidence.computed || 0}</b><span>可从公开文件复算</span></div>
      <div class="stat"><b>${evidence.reported || 0}</b><span>官方给出精确汇总</span></div>
      <div class="stat"><b>${(evidence.taxonomy || 0) + (evidence.unavailable || 0)}</b><span>只有范围或暂不可量化</span></div>`;
  }

  function renderCoverage(records) {
    const sceneOrder = ["none", "scope", "taxonomy", "frequency"];
    const taskOrder = ["frequency", "taxonomy", "scope", "none"];
    let html = `<div class="axis-corner">任务 / 交互 ↓<br>物理场景 →</div>`;
    html += sceneOrder.map(value => `<div class="axis-col">${esc(AVAILABILITY[value].label)}</div>`).join("");
    taskOrder.forEach(task => {
      html += `<div class="axis-row">${esc(AVAILABILITY[task].label)}</div>`;
      sceneOrder.forEach(scene => {
        const cell = records.filter(record => record.comparison.scene === scene && record.comparison.task === task);
        html += `<div class="coverage-cell ${cell.length ? "" : "empty"}"><span class="cell-count">${cell.length ? `${cell.length} 项` : "—"}</span><div class="dataset-chips">${cell.map(record => `<a class="dataset-chip" style="${levelStyle(record.comparison.level)}" href="index.html#dataset-${esc(record.slug)}" target="_blank" rel="noopener" title="${esc(record.name)}">${esc(record.name)}</a>`).join("")}</div></div>`;
      });
    });
    elements.coverage.innerHTML = html;
  }

  function renderLanes(records) {
    elements.lanes.innerHTML = Object.entries(LEVELS).map(([key, meta]) => {
      const matches = records.filter(record => record.comparison.level === key);
      return `<section class="lane" style="${levelStyle(key)}"><h3>${esc(meta.label)}<span>${matches.length} 项</span></h3>${matches.length ? `<div class="dataset-chips">${matches.map(record => `<a class="dataset-chip" style="${levelStyle(key)}" href="index.html#dataset-${esc(record.slug)}" target="_blank" rel="noopener">${esc(record.name)}</a>`).join("")}</div>` : `<div class="lane-empty">当前筛选下没有数据集</div>`}</section>`;
    }).join("");
  }

  function topMarkup(record) {
    if (!record.chart || !record.top) return `<span class="pill none">无主图</span>`;
    const share = record.top.share;
    const value = Number.isInteger(record.top.value) ? record.top.value : record.top.value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return `<div class="top-cell"><b>${esc(record.top.label)}</b><small>${share !== null ? `${share.toFixed(1)}% · ` : ""}${esc(value)}${record.top.unit ? ` ${esc(record.top.unit)}` : ""}</small></div>`;
  }

  function gapMarkup(record) {
    const gaps = [];
    if (record.comparison.scene !== "frequency") gaps.push(`场景：${record.comparison.sceneNote}`);
    if (record.comparison.task !== "frequency") gaps.push(`任务：${record.comparison.taskNote}`);
    if (!gaps.length) gaps.push(record.sceneData.note || "两维均有可核验频次；仍需注意统计单位与覆盖范围。 ");
    return gaps.join(" ");
  }

  function renderTable(records) {
    elements.body.innerHTML = records.map(record => {
      const level = LEVELS[record.comparison.level] || LEVELS.unavailable;
      const sources = arr(record.sceneData.sources).slice(0, 2);
      return `<tr>
        <td class="dataset-cell"><a href="index.html#dataset-${esc(record.slug)}" target="_blank" rel="noopener">${String(record.no).padStart(2, "0")} · ${esc(record.name)}</a><small>${esc(record.slug)}</small></td>
        <td><span class="level-pill" style="${levelStyle(record.comparison.level)}">${esc(level.label)}</span></td>
        <td title="${esc(record.comparison.sceneNote)}">${availabilityPill(record.comparison.scene)}</td>
        <td title="${esc(record.comparison.taskNote)}">${availabilityPill(record.comparison.task)}</td>
        <td><span class="pill ${esc(record.sceneData.status || "unavailable")}">${esc(STATUS[record.sceneData.status] || "—")}</span></td>
        <td class="scope-cell"><b>${esc(record.sceneData.basis || "—")}</b><br>${esc(record.sceneData.scope || "—")}</td>
        <td>${topMarkup(record)}</td>
        <td class="gap-cell">${esc(gapMarkup(record))}</td>
        <td><div class="source-links">${sources.map(source => `<a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.label)} ↗</a>`).join("")}</div></td>
      </tr>`;
    }).join("") || `<tr><td colspan="9">当前筛选没有匹配项。</td></tr>`;
  }

  function valueLabel(item, unit) {
    if (item.display) return item.display;
    const number = Number(item.value);
    const shown = Number.isInteger(number) ? String(number) : number.toFixed(number < 10 ? 2 : 1).replace(/\.0$/, "");
    return `${shown}${unit ? ` ${unit}` : ""}`;
  }

  function chartMarkup(record) {
    const chart = record.chart;
    if (!chart) {
      const taxonomy = arr(record.sceneData.taxonomy).slice(0, 8);
      return `<div class="small-empty">${record.sceneData.status === "unavailable" ? "没有可量化的场景或任务分布。" : "只有类别 / 场景组成，没有逐类频数。"}</div>${taxonomy.length ? `<div class="small-taxonomy">${taxonomy.map(item => `<span>${esc(typeof item === "string" ? item : item.label)}</span>`).join("")}</div>` : ""}`;
    }
    const items = arr(chart.items).filter(item => finite(item.value)).sort((a, b) => Number(b.value) - Number(a.value));
    const shown = items.slice(0, 6);
    const maximum = Math.max(1, ...items.map(item => Number(item.value)));
    const total = finite(chart.total) && Number(chart.total) >= maximum ? Number(chart.total) : null;
    const denominator = total || maximum;
    let rows = shown.map(item => {
      const width = Math.max(1, Math.min(100, Number(item.value) / denominator * 100));
      return `<div class="bar-row" title="${esc(`${item.label}: ${valueLabel(item, chart.unit)}`)}"><span class="bar-name">${esc(item.label)}</span><span class="bar-track"><i style="width:${width.toFixed(2)}%"></i></span><span class="bar-value">${esc(valueLabel(item, chart.unit))}</span></div>`;
    }).join("");
    if (items.length > shown.length) {
      const restValue = total ? Math.max(0, total - shown.reduce((sum, item) => sum + Number(item.value), 0)) : null;
      const width = restValue !== null ? Math.max(1, Math.min(100, restValue / denominator * 100)) : 0;
      rows += `<div class="bar-row"><span class="bar-name">其余 ${items.length - shown.length} 类</span><span class="bar-track">${restValue !== null ? `<i style="width:${width.toFixed(2)}%"></i>` : ""}</span><span class="bar-value">${restValue !== null ? esc(valueLabel({value: restValue}, chart.unit)) : "见明细"}</span></div>`;
    }
    const scale = chart.scaleNote || (total ? `条长按总量 ${total} ${chart.unit || ""}` : "条长按本图最大类别归一化");
    return `<div class="chart-title"><b>${esc(chart.dimension)}</b><span>${esc(scale)}</span></div><div class="bars">${rows}</div>`;
  }

  function renderCards(records) {
    elements.grid.innerHTML = records.map(record => {
      const level = LEVELS[record.comparison.level] || LEVELS.unavailable;
      const taxonomyCount = arr(record.sceneData.taxonomy).length;
      const chartCount = arr(record.sceneData.charts).length;
      return `<article class="small-card" style="${levelStyle(record.comparison.level)}"><div class="small-head"><div class="small-title"><a href="index.html#dataset-${esc(record.slug)}" target="_blank" rel="noopener">${String(record.no).padStart(2, "0")} · ${esc(record.name)}</a><span>${esc(record.sceneData.basis || "—")} · ${esc(STATUS[record.sceneData.status] || "—")}</span></div><span class="level-pill" style="${levelStyle(record.comparison.level)}">${esc(level.label)}</span></div><div class="small-body">${chartMarkup(record)}<div class="small-foot"><span>${chartCount > 1 ? `主图 1 / ${chartCount}` : taxonomyCount ? `${taxonomyCount} 个公开类别` : "主分布"}</span><a href="index.html#dataset-${esc(record.slug)}" target="_blank" rel="noopener">样例与完整明细 ↗</a></div></div></article>`;
    }).join("") || `<div class="small-empty">当前筛选没有匹配项。</div>`;
  }

  function render() {
    const records = filteredRecords();
    renderCoverage(records);
    renderLanes(records);
    renderTable(records);
    renderCards(records);
    elements.result.textContent = `显示 ${records.length} / ${RECORDS.length}`;
  }

  function setView(view) {
    state.view = view;
    document.querySelectorAll(".view-tab").forEach(button => button.classList.toggle("active", button.dataset.view === view));
    elements.matrixView.classList.toggle("hidden", view !== "matrix");
    elements.chartsView.classList.toggle("hidden", view !== "charts");
  }

  [elements.q, elements.level, elements.evidence, elements.sort, elements.quantified].forEach(control => control.addEventListener("input", render));
  document.querySelectorAll(".view-tab").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
  renderStats();
  render();
  setView("matrix");
})();
