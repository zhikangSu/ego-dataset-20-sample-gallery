(() => {
  "use strict";

  const CATALOG = window.EGO_SCENE_DATASETS || window.EGO_GALLERY || [];
  const SCENES = window.EGO_SCENES || {};
  const TAXONOMY = window.EGO_SCENE_TAXONOMY || [];
  const METHODS = window.EGO_SCENE_METHOD || {};
  const RELEASE = window.EGO_RELEASE_STATUS || {};
  const BOUNDARIES = window.EGO_SCENE_BOUNDARIES || [];
  const TAXONOMY_BY_ID = Object.fromEntries(TAXONOMY.map(item => [item.id, item]));
  const METHOD_ORDER = {frequency: 0, proxy: 1, presence: 2, none: 3};
  const RELEASE_ORDER = {open: 0, gated: 1, phased: 2, pending: 3};
  const STATUS_LABELS = {
    computed: "公开文件复算",
    reported: "官方资料汇总",
    taxonomy: "仅场景清单",
    unavailable: "公开信息不足"
  };

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[char]);
  const arr = value => Array.isArray(value) ? value : [];
  const finite = value => value !== null && value !== "" && Number.isFinite(Number(value));
  const fmt = (value, digits = 1) => Number(value).toLocaleString("zh-CN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0
  });
  const safeHref = value => /^https:\/\//.test(String(value || "")) ? String(value) : "#";

  function normalizedRows(scene) {
    const denominator = Number(scene.denominator?.value);
    return arr(scene.normalized).map(item => {
      const hasValue = finite(item.value) && Number.isFinite(denominator) && denominator > 0;
      return {
        ...item,
        share: hasValue ? Number(item.value) / denominator * 100 : null,
        taxonomy: TAXONOMY_BY_ID[item.category] || {label: item.label || item.category, short: item.category, color: "#9aa4a9"}
      };
    });
  }

  const RECORDS = CATALOG.map(dataset => {
    const scene = SCENES[dataset.slug] || {availability: "none", status: "unavailable"};
    const normalized = normalizedRows(scene);
    const numeric = normalized.filter(item => item.share !== null);
    return {
      ...dataset,
      scene,
      normalized,
      topShare: numeric.length ? Math.max(...numeric.map(item => item.share)) : null,
      diversity: normalized.length,
      search: [
        dataset.name, dataset.slug, dataset.year, dataset.tier, RELEASE[dataset.releaseStatus]?.label, scene.basis, scene.scope, scene.note,
        ...normalized.flatMap(item => [item.label, item.taxonomy.label]),
        ...arr(scene.taxonomy),
        ...arr(scene.charts).flatMap(chart => [chart.dimension, ...arr(chart.items).map(item => item.label)]),
        ...arr(scene.facts).flatMap(item => [item.label, item.value])
      ].filter(Boolean).join(" ").toLowerCase()
    };
  });

  const elements = {
    q: document.getElementById("q"),
    category: document.getElementById("category"),
    availability: document.getElementById("availability"),
    release: document.getElementById("release"),
    sort: document.getElementById("sort"),
    quantified: document.getElementById("quantified"),
    result: document.getElementById("result"),
    stats: document.getElementById("stats"),
    heatmap: document.getElementById("heatmapGrid"),
    cards: document.getElementById("cardsGrid"),
    legend: document.getElementById("sceneLegend"),
    boundaries: document.getElementById("boundaryList")
  };

  function methodBadge(scene) {
    const key = scene.availability || "none";
    return `<span class="method-badge ${esc(key)}">${esc(METHODS[key]?.short || key)}</span>`;
  }

  function releaseBadge(record) {
    const key = record.releaseStatus || "pending";
    return `<span class="release-badge ${esc(key)}" title="${esc(RELEASE[key]?.label || key)}">${esc(RELEASE[key]?.short || key)}</span>`;
  }

  function filteredRecords() {
    const query = elements.q.value.trim().toLowerCase();
    const category = elements.category.value;
    const availability = elements.availability.value;
    const release = elements.release.value;
    const quantified = elements.quantified.checked;
    const records = RECORDS.filter(record => (
      (!query || record.search.includes(query)) &&
      (!category || record.normalized.some(item => item.category === category)) &&
      (!availability || record.scene.availability === availability) &&
      (!release || record.releaseStatus === release) &&
      (!quantified || ["frequency", "proxy"].includes(record.scene.availability))
    ));
    const sort = elements.sort.value;
    records.sort((a, b) => {
      if (sort === "availability") {
        return (METHOD_ORDER[a.scene.availability] ?? 9) - (METHOD_ORDER[b.scene.availability] ?? 9) || a.no - b.no;
      }
      if (sort === "release") return (RELEASE_ORDER[a.releaseStatus] ?? 9) - (RELEASE_ORDER[b.releaseStatus] ?? 9) || a.no - b.no;
      if (sort === "diversity") return b.diversity - a.diversity || a.no - b.no;
      if (sort === "balanced") return (a.topShare ?? 101) - (b.topShare ?? 101) || a.no - b.no;
      return a.no - b.no;
    });
    return records;
  }

  function renderLegend() {
    elements.legend.innerHTML = Object.entries(METHODS).map(([key, item]) => (
      `<span class="legend-item"><i class="legend-swatch ${esc(key)}"></i><b>${esc(item.short)}</b><small>${esc(item.description)}</small></span>`
    )).join("");
  }

  function renderStats() {
    const counts = RECORDS.reduce((memo, record) => {
      const key = record.scene.availability || "none";
      memo[key] = (memo[key] || 0) + 1;
      return memo;
    }, {});
    const additions = RECORDS.filter(record => record.tier !== "sample-peer").length;
    elements.stats.innerHTML = `
      <div class="stat"><b>${RECORDS.length}</b><span>独立采集 / 重要 Ego 数据集</span></div>
      <div class="stat"><b>${counts.frequency || 0}</b><span>场景比例可直接量化</span></div>
      <div class="stat"><b>${counts.proxy || 0}</b><span>官方 audit / 映射代理比例</span></div>
      <div class="stat"><b>${counts.presence || 0}</b><span>只有场景清单</span></div>
      <div class="stat"><b>${counts.none || 0}</b><span>公开场景信息不足</span></div>
      <div class="stat"><b>+${additions}</b><span>本轮补充的大型 / 专项数据集</span></div>`;
  }

  function heatmapCell(record, category) {
    const row = record.normalized.find(item => item.category === category.id);
    if (!row) return `<span class="heat-cell empty" aria-label="${esc(category.label)}：未报告">—</span>`;
    if (row.share !== null) {
      const mix = Math.max(18, Math.min(88, 18 + row.share * 0.7));
      const label = `${category.label}：${fmt(row.share, row.share < 10 ? 1 : 0)}%`;
      return `<span class="heat-cell numeric" style="--cell-color:${esc(category.color)};--cell-mix:${mix.toFixed(1)}%" title="${esc(label)}" aria-label="${esc(label)}">${fmt(row.share, row.share < 10 ? 1 : 0)}%</span>`;
    }
    return `<span class="heat-cell present" style="--cell-color:${esc(category.color)}" title="${esc(`${category.label}：已确认包含，比例未公开`)}" aria-label="${esc(`${category.label}：已确认包含，比例未公开`)}">●</span>`;
  }

  function renderHeatmap(records) {
    const selectedCategory = elements.category.value;
    const columns = selectedCategory ? TAXONOMY.filter(item => item.id === selectedCategory) : TAXONOMY;
    let html = `<div class="heat-corner">数据集</div>${columns.map(item => `<div class="heat-head" title="${esc(item.label)}"><i style="background:${esc(item.color)}"></i>${esc(item.short)}</div>`).join("")}`;
    records.forEach(record => {
      html += `<a class="heat-dataset" href="#scene-${esc(record.slug)}"><b>${String(record.no).padStart(2, "0")} · ${esc(record.name)}</b>${methodBadge(record.scene)}</a>`;
      html += columns.map(category => heatmapCell(record, category)).join("");
    });
    elements.heatmap.style.setProperty("--scene-columns", String(columns.length));
    elements.heatmap.innerHTML = html || `<div class="empty-state">当前筛选没有匹配项。</div>`;
  }

  function stackedStrip(record) {
    const rows = record.normalized.filter(item => item.share !== null && item.share > 0);
    if (!rows.length) return "";
    return `<div class="stack-wrap"><div class="stack" aria-label="统一场景类别占比">${rows.map(item => (
      `<span style="width:${Math.max(0.5, item.share).toFixed(3)}%;background:${esc(item.taxonomy.color)}" title="${esc(`${item.taxonomy.label}: ${fmt(item.share, 1)}%`)}"></span>`
    )).join("")}</div><div class="stack-legend">${rows.map(item => (
      `<span><i style="background:${esc(item.taxonomy.color)}"></i><b>${esc(item.taxonomy.label)}</b> ${fmt(item.share, 1)}%</span>`
    )).join("")}</div></div>`;
  }

  function presenceStrip(record) {
    const rows = record.normalized.filter(item => item.share === null);
    if (!rows.length) return "";
    return `<div class="presence-list">${rows.map(item => (
      `<span style="--scene-color:${esc(item.taxonomy.color)}"><i></i>${esc(item.taxonomy.label)}<small>比例未公开</small></span>`
    )).join("")}</div>`;
  }

  function rawValue(item, chart) {
    if (item.display) return item.display;
    const value = Number(item.value);
    const total = finite(chart.total) && Number(chart.total) > 0 ? Number(chart.total) : null;
    const share = total ? value / total * 100 : null;
    const unit = chart.unit ? ` ${chart.unit}` : "";
    return `${fmt(value, value < 10 ? 2 : 1)}${unit}${share !== null ? ` · ${fmt(share, 1)}%` : ""}`;
  }

  function rawChart(scene) {
    const chart = arr(scene.charts)[0];
    if (!chart || !arr(chart.items).length) return "";
    const values = chart.items.map(item => Number(item.value));
    const maximum = Math.max(1, ...values);
    const total = finite(chart.total) && Number(chart.total) >= maximum ? Number(chart.total) : null;
    const denominator = total || maximum;
    const rows = chart.items.map(item => {
      const category = TAXONOMY_BY_ID[item.mapping];
      const color = category?.color || "#7c8a91";
      const width = Math.max(1, Math.min(100, Number(item.value) / denominator * 100));
      return `<div class="raw-row"><span class="raw-name" title="${esc(item.label)}">${esc(item.label)}</span><span class="raw-track"><i style="width:${width.toFixed(2)}%;background:${esc(color)}"></i></span><span class="raw-value">${esc(rawValue(item, chart))}</span></div>`;
    }).join("");
    const opened = chart.items.length <= 8 ? " open" : "";
    return `<details class="raw-details"${opened}><summary><span>完整原始场景清单</span><b>${chart.items.length} 类 · ${esc(chart.dimension)}</b></summary><div class="raw-note">${esc(chart.scaleNote || (total ? `条长按总量 ${fmt(total, 2)} ${chart.unit || ""}` : "条长按本图最大值"))}</div><div class="raw-bars">${rows}</div></details>`;
  }

  function taxonomyMarkup(scene) {
    const items = arr(scene.taxonomy);
    if (!items.length) return "";
    return `<div class="taxonomy-block"><b>${esc(scene.taxonomyLabel || "完整已知场景清单")}</b><div>${items.map(item => `<span>${esc(typeof item === "string" ? item : item.label)}</span>`).join("")}</div></div>`;
  }

  function factsMarkup(scene) {
    const facts = arr(scene.facts).filter(item => item?.label && item?.value !== undefined);
    if (!facts.length) return "";
    return `<div class="facts">${facts.map(item => `<span><b>${esc(item.value)}</b><small>${esc(item.label)}</small></span>`).join("")}</div>`;
  }

  function sourcesMarkup(scene) {
    return `<div class="sources">${arr(scene.sources).map((source, index) => (
      `<a href="${esc(safeHref(source.url))}" target="_blank" rel="noopener">${esc(source.label || `来源 ${index + 1}`)} ↗</a>`
    )).join("")}</div>`;
  }

  function distributionMarkup(record) {
    const hasNumeric = record.normalized.some(item => item.share !== null);
    const hasPresence = record.normalized.some(item => item.share === null);
    if (!hasNumeric && !hasPresence) {
      return `<div class="no-distribution"><b>无法计算场景分布</b><span>公开材料没有可核验的场景 taxonomy 或比例；这里不会用任务、动作或物体类别代替。</span></div>`;
    }
    return `${hasNumeric ? `<div class="subhead"><b>统一场景类别分布</b><span>仅在本数据集内部归一化</span></div>${stackedStrip(record)}` : ""}${hasPresence ? `<div class="subhead"><b>已确认包含的统一场景类别</b><span>存在 ≠ 占比</span></div>${presenceStrip(record)}` : ""}`;
  }

  function renderCards(records) {
    elements.cards.innerHTML = records.map(record => {
      const scene = record.scene;
      return `<article class="scene-card" id="scene-${esc(record.slug)}">
        <div class="card-head"><div><span class="card-index">${String(record.no).padStart(2, "0")}</span><h3>${esc(record.name)}</h3><small>${record.year ? `${esc(record.year)} · ` : ""}${esc(STATUS_LABELS[scene.status] || scene.status || "—")}${record.tier === "core-addition" ? " · 必补大型集" : record.tier === "specialized" ? " · 重要专项集" : " · 20 项样例 peer"}</small></div><div class="card-badges">${releaseBadge(record)}${methodBadge(scene)}</div></div>
        <div class="card-body">
          <p class="scope"><b>${esc(scene.basis || "统计口径")}</b>${esc(scene.scope || "—")}</p>
          ${distributionMarkup(record)}
          ${rawChart(scene)}
          ${taxonomyMarkup(scene)}
          ${factsMarkup(scene)}
          ${scene.note ? `<p class="caveat">${esc(scene.note)}</p>` : ""}
          <div class="card-foot">${sourcesMarkup(scene)}${record.hasSample ? `<a class="sample-link" href="index.html#dataset-${esc(record.slug)}" target="_blank" rel="noopener">查看样例与标注 ↗</a>` : `<span class="no-sample">本轮仅补场景调研，尚未加入媒体样例</span>`}</div>
        </div>
      </article>`;
    }).join("") || `<div class="empty-state">当前筛选没有匹配项。</div>`;
  }

  function renderBoundaries() {
    if (!elements.boundaries) return;
    elements.boundaries.innerHTML = BOUNDARIES.map(group => (
      `<div class="boundary-card"><b>${esc(group.label)}</b><ul>${arr(group.items).map(item => `<li>${esc(item)}</li>`).join("")}</ul></div>`
    )).join("");
  }

  function render() {
    const records = filteredRecords();
    renderHeatmap(records);
    renderCards(records);
    elements.result.textContent = `显示 ${records.length} / ${RECORDS.length}`;
  }

  TAXONOMY.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label;
    elements.category.appendChild(option);
  });
  [elements.q, elements.category, elements.availability, elements.release, elements.sort, elements.quantified].forEach(control => control.addEventListener("input", render));
  renderLegend();
  renderStats();
  renderBoundaries();
  render();
})();
