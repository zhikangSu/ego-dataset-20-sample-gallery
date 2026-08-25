(() => {
  "use strict";

  const D = window.EGO_GALLERY || [];
  const cards = document.getElementById("cards");
  const IS_PAGES = /\.github\.io$/i.test(location.hostname);
  const JSON_CACHE = new Map();
  const BUFFER_CACHE = new Map();
  const TEXT_CACHE = new Map();
  const HAND_EDGES = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20]
  ];
  const labels = {
    raw: "原始媒体/帧",
    viz: "真实数据可视化",
    frames: "官方实拍帧",
    locked: "访问受限"
  };
  const access = {
    bundled: "仓库内置",
    fetch: "官方直连 / 可本地下载",
    "external-only": "官方查看",
    "noncommercial-download": "官方直连 / 非商业下载"
  };

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[char]);
  const finite = value => value !== null && value !== "" && Number.isFinite(Number(value));
  const fmt = (value, digits = 3) => finite(value) ? Number(value).toFixed(digits) : "—";
  const vec = (value, digits = 3) => Array.isArray(value)
    ? `[${value.map(item => fmt(item, digits)).join(", ")}]`
    : "—";
  const arr = value => Array.isArray(value) ? value : [];
  const unique = value => [...new Set(arr(value).filter(Boolean))];
  const nearest = (items, time, key = "time") => {
    if (!items?.length) return null;
    let best = items[0];
    let delta = Math.abs(Number(best[key]) - time);
    for (let i = 1; i < items.length; i += 1) {
      const candidate = Math.abs(Number(items[i][key]) - time);
      if (candidate < delta) {
        best = items[i];
        delta = candidate;
      }
    }
    return best;
  };
  const active = (items, time, start = "start", end = "end") => arr(items).filter(item => (
    Number(item[start]) <= time && time < Number(item[end])
  ));
  const panelFor = viewer => viewer.closest(".card")?.querySelector(".sync-panel");
  const sourceTime = (video, media, kind) => {
    if (!video) return Number(media.sourceStart || 0);
    return Number(video.currentTime || 0) + (kind === "local" ? Number(media.sourceStart || 0) : 0);
  };
  const clipTime = (video, media, kind) => Math.max(0, sourceTime(video, media, kind) - Number(media.sourceStart || 0));

  function candidates(input) {
    return (Array.isArray(input) ? input : [input]).flat().filter(Boolean);
  }

  async function fetchJSON(input) {
    let lastError;
    for (const url of candidates(input)) {
      try {
        if (!JSON_CACHE.has(url)) {
          JSON_CACHE.set(url, fetch(url).then(response => {
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response.json();
          }).catch(error => {
            JSON_CACHE.delete(url);
            throw error;
          }));
        }
        return await JSON_CACHE.get(url);
      } catch (error) {
        lastError = new Error(`${url}: ${error.message}`);
      }
    }
    throw lastError || new Error("没有可读取的 JSON 地址");
  }

  async function fetchBuffer(input) {
    let lastError;
    for (const url of candidates(input)) {
      try {
        if (!BUFFER_CACHE.has(url)) {
          BUFFER_CACHE.set(url, fetch(url).then(response => {
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response.arrayBuffer();
          }).catch(error => {
            BUFFER_CACHE.delete(url);
            throw error;
          }));
        }
        return await BUFFER_CACHE.get(url);
      } catch (error) {
        lastError = new Error(`${url}: ${error.message}`);
      }
    }
    throw lastError || new Error("没有可读取的二进制地址");
  }

  async function fetchText(input) {
    let lastError;
    for (const url of candidates(input)) {
      try {
        if (!TEXT_CACHE.has(url)) {
          TEXT_CACHE.set(url, fetch(url).then(response => {
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response.text();
          }).catch(error => {
            TEXT_CACHE.delete(url);
            throw error;
          }));
        }
        return await TEXT_CACHE.get(url);
      } catch (error) {
        lastError = new Error(`${url}: ${error.message}`);
      }
    }
    throw lastError || new Error("没有可读取的文本地址");
  }

  function stats() {
    const counts = D.reduce((memo, item) => {
      memo[item.evidence] = (memo[item.evidence] || 0) + 1;
      return memo;
    }, {});
    const ready = D.filter(item => item.evidence !== "locked" && (item.media || []).some(media => (
      media.remote || String(media.local || "").startsWith("assets/datasets/")
    ))).length;
    document.getElementById("stats").innerHTML = `
      <div class="stat"><b>${D.length}</b><span>数据集观察窗</span></div>
      <div class="stat"><b>${ready}</b><span>配置了网页预览</span></div>
      <div class="stat"><b>${counts.raw || 0}</b><span>原始媒体 / 精确原始帧</span></div>
      <div class="stat"><b>${counts.viz || 0}</b><span>真实记录派生可视化</span></div>
      <div class="stat"><b>${counts.locked || 0}</b><span>访问受限</span></div>`;
  }

  function syncHead(title, badge, badgeClass, current = "") {
    return `<div class="sync-head"><div class="sync-title">${esc(title)} <span class="sync-badge ${esc(badgeClass || "")}">${esc(badge)}</span></div><span class="sync-current">${esc(current)}</span></div>`;
  }

  function kv(label, value, wide = false) {
    return `<div class="sync-kv ${wide ? "sync-wide" : ""}"><b>${esc(label)}</b><span>${value}</span></div>`;
  }

  function chips(values) {
    return `<div class="sync-chips">${unique(values).map(value => `<span>${esc(value)}</span>`).join("")}</div>`;
  }

  function timeline(items, time, start, end, classes = () => "", windowStart = null, windowEnd = null) {
    const list = arr(items);
    const low = windowStart ?? Math.min(...list.map(item => Number(item[start])).filter(Number.isFinite), time);
    const high = windowEnd ?? Math.max(...list.map(item => Number(item[end])).filter(Number.isFinite), time + 1);
    const span = Math.max(0.001, high - low);
    const bars = list.map(item => {
      const left = Math.max(0, Math.min(100, (Number(item[start]) - low) / span * 100));
      const right = Math.max(0, Math.min(100, (Number(item[end]) - low) / span * 100));
      const isActive = Number(item[start]) <= time && time < Number(item[end]);
      return `<i class="${esc(classes(item))} ${isActive ? "active" : ""}" title="${esc(item.label || item.name || item.action || item.id || "segment")}" style="left:${left}%;width:${Math.max(.3, right - left)}%"></i>`;
    }).join("");
    const cursor = Math.max(0, Math.min(100, (time - low) / span * 100));
    return `<div class="sync-track">${bars}<em style="left:${cursor}%"></em></div>`;
  }

  function drawPose(canvas, groups) {
    if (!canvas) return;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(220, canvas.clientWidth || 400);
    const height = Math.max(100, canvas.clientHeight || 112);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext("2d");
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, width, height);
    const all = groups.flatMap(group => arr(group.points)).filter(point => Array.isArray(point) && finite(point[0]) && finite(point[1]));
    if (!all.length) {
      ctx.fillStyle = "#9eb0b8";
      ctx.font = "11px sans-serif";
      ctx.fillText("此帧没有有效姿态点", 12, 24);
      return;
    }
    const xs = all.map(point => Number(point[0]));
    const ys = all.map(point => Number(point[1]));
    let minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const padX = Math.max(.02, (maxX - minX) * .08);
    const padY = Math.max(.02, (maxY - minY) * .08);
    minX -= padX; maxX += padX; minY -= padY; maxY += padY;
    const project = point => [
      8 + (Number(point[0]) - minX) / Math.max(.001, maxX - minX) * (width - 16),
      height - 8 - (Number(point[1]) - minY) / Math.max(.001, maxY - minY) * (height - 16)
    ];
    for (const group of groups) {
      const points = arr(group.points);
      ctx.strokeStyle = group.color;
      ctx.fillStyle = group.color;
      ctx.lineWidth = 1.4;
      if (group.hand && points.length >= 21) {
        for (const [a, b] of HAND_EDGES) {
          if (!points[a] || !points[b]) continue;
          const p = project(points[a]), q = project(points[b]);
          ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
        }
      }
      for (const point of points) {
        if (!Array.isArray(point) || !finite(point[0]) || !finite(point[1])) continue;
        const p = project(point);
        ctx.beginPath(); ctx.arc(p[0], p[1], group.hand ? 1.8 : 1.4, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  function watch(video, update) {
    if (!video) {
      update();
      return () => {};
    }
    const events = ["timeupdate", "seeking", "seeked", "play", "pause", "loadeddata"];
    events.forEach(name => video.addEventListener(name, update));
    update();
    return () => events.forEach(name => video.removeEventListener(name, update));
  }

  function genericAnnotation(viewer, dataset, media, video, kind) {
    const panel = panelFor(viewer);
    if (!panel) return () => {};
    const baked = arr(media.bakedAnnotations);
    if (baked.length) {
      const update = () => {
        const time = sourceTime(video, media, kind);
        const frame = finite(media.fps) ? Math.round(time * Number(media.fps)) + Number(media.recordFrameOffset || 0) : null;
        const mapping = dataset.slug === "humanego" && media.recordFrameOffset
          ? `该视图从 recording frame ${media.recordFrameOffset} 开始；不是与 Aria 视图逐帧同号。`
          : dataset.slug === "humanego"
            ? "官方 row-aligned MPS overlay；存在约 2 帧 timestamp QC 偏差。"
            : String(media.annotationBinding || dataset.annotationBinding).includes("unmapped")
              ? "当前 tab 是官方标注示意/teaser；标注可见，但官网未披露它与卡片标题 sample 的 record 映射，不能加载结构化 streams。"
            : "这些标注已由官方烧录在当前画面中，没有另贴一份可能错位的数据。";
        panel.innerHTML = `${syncHead("当前画面的标注", "官方烧录", "baked", video ? `源 ${fmt(time, 2)} s${frame === null ? "" : ` · record frame ${frame}`}` : "静态视图")}
          <div class="sync-grid">${kv("画面中可见", chips(baked), true)}${kv("对齐说明", esc(mapping), true)}</div>`;
      };
      return watch(video, update);
    }
    const binding = media.annotationBinding || dataset.annotationBinding;
    if (["unmapped", "baked-unmapped"].includes(binding)) {
      panel.innerHTML = `${syncHead("当前媒体的标注", "不可绑定", "unmapped")}
        <div class="sync-warning">数据集本身有标注，但官网没有公开当前媒体对应的 record / take ID；因此这里不把别的记录的姿态或动作标签贴到这段视频上。</div>`;
      return () => {};
    }
    if (["gated", "exact-no-media"].includes(binding) || dataset.evidence === "locked") {
      panel.innerHTML = `${syncHead("当前媒体的标注", "访问受限", "unmapped")}
        <div class="sync-warning">原始媒体或逐帧标注需要接受官方条款后下载；本页没有绕过 gate。</div>`;
      return () => {};
    }
    panel.innerHTML = `${syncHead("当前媒体的标注", "未公开逐帧文件", "unmapped")}
      <div class="sync-note">页面只显示能核验到当前样例的内容；数据集级 schema 请看下方“标注文件与 overlay”。</div>`;
    return () => {};
  }

  async function ropediaAnnotation(viewer, dataset, media, video, kind, mountId) {
    const panel = panelFor(viewer);
    panel.innerHTML = `<div class="sync-loading">正在读取同一 HDF5 的 20–32 s 姿态、动作、SLAM、IMU 与深度摘要…</div>`;
    const data = await fetchJSON(media.annotation.path);
    if (viewer._mountId !== mountId) return () => {};
    const start = Number(data.time_window_seconds?.[0] ?? media.sourceStart ?? 20);
    const end = Number(data.time_window_seconds?.[1] ?? (start + media.clipDuration));
    const tracks = [
      ...arr(data.semantic?.segments).map(item => ({...item, label: item.subtask})),
      ...arr(data.semantic?.actions).map(item => ({...item, label: item.label}))
    ];
    const update = () => {
      const time = sourceTime(video, media, kind);
      const frame = nearest(data.frames, time);
      if (!frame) return;
      const currentSegments = active(data.semantic?.segments, time);
      const currentActions = active(data.semantic?.actions, time);
      const objectEvent = arr(data.semantic?.events).filter(item => item.type === "objects" && Number(item.time) <= time).at(-1);
      const depth = nearest(data.depth_summary_1hz, time);
      const contacts = arr(frame.body?.contacts).filter(value => Number(value) > .5).length;
      panel.innerHTML = `${syncHead("随视频同步的 record-level 标注", "精确对齐", "", `源 ${fmt(time, 3)} s · frame ${frame.frame_index}`)}
        <div class="sync-grid">
          ${kv("动作语义", esc(currentActions.map(item => item.label).join("；") || currentSegments.map(item => item.subtask).join("；") || "空档"), true)}
          ${kv("主任务 / 子任务", `${esc(data.semantic?.main_task || "—")} / ${esc(currentSegments.map(item => item.subtask).join("；") || "—")}`)}
          ${kv("场景物体", chips(objectEvent?.value || []))}
          ${kv("身体与接触", `52 个 3D keypoints · ${contacts}/21 contact 概率 > 0.5`)}
          ${kv("双手 3D", `左 ${arr(frame.hands?.left_joints_xyz).length} 点 · 右 ${arr(frame.hands?.right_joints_xyz).length} 点`)}
          ${kv("SLAM t_xyz", esc(vec(frame.slam?.translation_xyz)))}
          ${kv("IMU", `acc ${esc(vec(frame.imu?.accel_xyz))}<br>gyro ${esc(vec(frame.imu?.gyro_xyz))}`)}
          ${kv("深度（1 Hz 摘要）", depth ? `median ${fmt(depth.median)} m · valid ${(Number(depth.valid_ratio) * 100).toFixed(1)}%` : "—")}
          ${kv("固定相机标定", `cam0 K ${esc(vec(data.calibration?.cam0?.K, 2))}<br>stereo baseline ${fmt(data.calibration?.cam01?.baseline, 4)} m · ${esc(data.calibration?.cam0?.camera_model || "—")} / ${esc(data.calibration?.cam0?.distortion_model || "—")}`)}
          ${kv("人体标定", `body height ${fmt(data.body_height_m, 3)} m · root/CPF 均为 7D pose`)}
          ${kv("3D 点俯视投影（仅结构，不叠加 RGB）", `<canvas class="pose-mini" data-pose></canvas><span class="sync-note">灰=身体散点，蓝=左手，红=右手；未验证 body joint order，因此不连身体骨架。</span>`, true)}
          ${kv("20–32 s 语义时间轴", timeline(tracks, time, "start", "end", () => "", start, end), true)}
        </div>`;
      drawPose(panel.querySelector("[data-pose]"), [
        {points: frame.body?.keypoints_xyz, color: "#b9c6cc"},
        {points: frame.hands?.left_joints_xyz, color: "#49a7ff", hand: true},
        {points: frame.hands?.right_joints_xyz, color: "#ff625f", hand: true}
      ]);
    };
    return watch(video, update);
  }

  async function comindAnnotation(viewer, dataset, media, video, kind, mountId) {
    const panel = panelFor(viewer);
    panel.innerHTML = `<div class="sync-loading">正在读取同一 UUID / wearer 的 MPS hand、gaze、SLAM 与 transcript…</div>`;
    const data = await fetchJSON(media.annotation.path);
    if (viewer._mountId !== mountId) return () => {};
    const roleName = media.wearer || "leader";
    const role = data.roles?.[roleName];
    if (!role) throw new Error(`标注里没有 wearer=${roleName}`);
    const update = () => {
      const time = clipTime(video, media, kind);
      const source = time + Number(media.sourceStart || 0);
      const hand = nearest(role.hand_tracking, time, "clip_time_sec");
      const gaze = nearest(role.eye_gaze, time, "clip_time_sec");
      const slam = nearest(role.slam_10hz, time, "clip_time_sec");
      const word = arr(role.transcript_words).find(item => Number(item.clip_start_sec) <= time && time < Number(item.clip_end_sec));
      const segment = arr(role.transcript_segments).find(item => Number(item.clip_start_sec) <= time && time < Number(item.clip_end_sec));
      panel.innerHTML = `${syncHead("随视频同步的官方 MPS / transcript", "精确 wearer", "", `${esc(roleName)} · clip ${fmt(time, 3)} s · source ${fmt(source, 3)} s`)}
        <div class="sync-grid">
          ${kv("当前逐词 transcript", word ? `<b>${esc(word.word)}</b> · ${esc(word.speaker || "")}` : "此刻没有 word token")}
          ${kv("当前语句", esc(segment?.text || "—"))}
          ${kv("双手 tracking", hand ? `L ${(Number(hand.left_tracking_confidence) * 100).toFixed(1)}% · R ${(Number(hand.right_tracking_confidence) * 100).toFixed(1)}%` : "—")}
          ${kv("wrist SE(3) (device)", hand ? `L ${esc(vec(Object.values(hand.left_wrist_device_pose || {})))}<br>R ${esc(vec(Object.values(hand.right_wrist_device_pose || {})))}` : "—")}
          ${kv("palm / wrist normals", hand ? `L palm ${esc(vec(hand.left_palm_normal_device))} · wrist ${esc(vec(hand.left_wrist_normal_device))}<br>R palm ${esc(vec(hand.right_palm_normal_device))} · wrist ${esc(vec(hand.right_wrist_normal_device))}` : "—")}
          ${kv("eye gaze (CPF)", gaze ? `yaw L/R ${fmt(gaze.left_yaw_rads_cpf)} / ${fmt(gaze.right_yaw_rads_cpf)} rad · pitch ${fmt(gaze.pitch_rads_cpf)}<br>depth ${fmt(gaze.depth_m)} m · low/high pitch ${fmt(gaze.pitch_low_rads_cpf)} / ${fmt(gaze.pitch_high_rads_cpf)}` : "—")}
          ${kv("SLAM world pose / motion", slam ? `t [${fmt(slam.tx_world_device)}, ${fmt(slam.ty_world_device)}, ${fmt(slam.tz_world_device)}] m · quality ${fmt(slam.quality_score, 2)}<br>v [${fmt(slam.device_linear_velocity_x_device)}, ${fmt(slam.device_linear_velocity_y_device)}, ${fmt(slam.device_linear_velocity_z_device)}] · ω [${fmt(slam.angular_velocity_x_device)}, ${fmt(slam.angular_velocity_y_device)}, ${fmt(slam.angular_velocity_z_device)}]` : "—")}
          ${kv("双手 3D（device x/y 投影）", `<canvas class="pose-mini" data-pose></canvas>`, true)}
          ${kv("Benchmark GT 状态", `<span class="sync-warning">该 UUID 属 test split；action / object / social consolidated GT 为 null / withheld，因此不显示伪造的动作与社交标签。</span>`, true)}
        </div>`;
      drawPose(panel.querySelector("[data-pose]"), [
        {points: hand?.left_landmarks_device_m, color: "#49a7ff", hand: true},
        {points: hand?.right_landmarks_device_m, color: "#ff625f", hand: true}
      ]);
    };
    return watch(video, update);
  }

  function showHandRecord(data, frame, camera) {
    if (Array.isArray(data?.frames)) {
      const record = data.frames[Math.max(0, Math.min(data.frames.length - 1, frame))] || {};
      return {
        frame,
        left: {points: record.left?.[camera], confidence: record.left?.confidence},
        right: {points: record.right?.[camera], confidence: record.right?.confidence}
      };
    }
    const record = data?.[String(frame)] || data?.[frame] || {};
    const pick = id => {
      const hand = record.hand_poses?.[String(id)] || {};
      return {
        points: hand.landmarks_2d?.[camera],
        points3d: hand.landmarks_3d_mm,
        confidence: hand.confidence,
        wristTranslation: hand.wrist_translation,
        wristRotation: hand.wrist_rotation,
        jointAngles: hand.joint_angles
      };
    };
    return {frame, record, left: pick(0), right: pick(1)};
  }

  function drawHandOverlay(ctx, points, color) {
    if (!Array.isArray(points)) return;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    for (const [a, b] of HAND_EDGES) {
      const p = points[a], q = points[b];
      if (!p || !q) continue;
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
    }
    for (const point of points) {
      if (!point) continue;
      ctx.beginPath(); ctx.arc(point[0], point[1], 5, 0, Math.PI * 2); ctx.fill();
    }
  }

  async function attachShow3dOverlay(stack, video, media, kind, mountId, viewer) {
    const state = stack.querySelector(".overlay-state");
    const canvas = document.createElement("canvas");
    canvas.width = media.overlay.width;
    canvas.height = media.overlay.height;
    stack.append(canvas);
    const ctx = canvas.getContext("2d");
    try {
      const data = await fetchJSON(media.overlay.paths || media.overlay.path);
      if (viewer._mountId !== mountId) return () => {};
      state.textContent = "hand-pose v2 · 蓝左/红右";
      const draw = () => {
        const frame = Math.max(0, Math.round(sourceTime(video, media, kind) * Number(media.fps || 60)));
        const record = showHandRecord(data, frame, media.overlay.camera);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (Number(record.left.confidence ?? 1) > .5) drawHandOverlay(ctx, record.left.points, "#49a7ff");
        if (Number(record.right.confidence ?? 1) > .5) drawHandOverlay(ctx, record.right.points, "#ff625f");
      };
      return watch(video, draw);
    } catch (error) {
      state.textContent = "hand-pose v2 无法读取";
      return () => {};
    }
  }

  function annotationUrls(dataset, contains) {
    const item = arr(dataset.annotations).find(annotation => String(annotation.label).toLowerCase().includes(contains));
    return item ? [item.path, item.source] : [];
  }

  function shallowRecord(value) {
    if (!value || typeof value !== "object") return "—";
    return Object.entries(value).slice(0, 5).map(([key, item]) => `${key}: ${Array.isArray(item) ? vec(item, 2) : String(item)}`).join(" · ");
  }

  function deepFind(value, wanted, depth = 0) {
    if (!value || typeof value !== "object" || depth > 5) return undefined;
    if (Object.prototype.hasOwnProperty.call(value, wanted)) return value[wanted];
    for (const child of Object.values(value)) {
      const found = deepFind(child, wanted, depth + 1);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  async function show3dAnnotation(viewer, dataset, media, video, kind, mountId) {
    const panel = panelFor(viewer);
    panel.innerHTML = `<div class="sync-loading">正在读取 SHOW3D hand-pose v2、object R/t 与 recording caption（约 29 MB，首次稍候）…</div>`;
    const handPromise = fetchJSON(annotationUrls(dataset, "hand_pose_v2").length ? annotationUrls(dataset, "hand_pose_v2") : (media.overlay?.paths || []));
    const objectPromise = fetchJSON(annotationUrls(dataset, "object_pose")).catch(() => null);
    const captionPromise = fetchJSON(annotationUrls(dataset, "caption")).catch(() => null);
    const [hands, objects, caption] = await Promise.all([handPromise, objectPromise, captionPromise]);
    if (viewer._mountId !== mountId) return () => {};
    const update = () => {
      const time = sourceTime(video, media, kind);
      const frameIndex = Math.max(0, Math.round(time * Number(media.fps || 60)));
      const hand = showHandRecord(hands, frameIndex, media.overlay?.camera || "headset0");
      const object = objects?.[String(frameIndex)] || objects?.[frameIndex] || objects?.frames?.[frameIndex] || null;
      const objectTranslation = object?.t?.flat?.() || object?.translation || object?.position;
      const objectRotation = object?.R?.flat?.() || object?.rotation;
      const captionAction = caption?.action_hint || caption?.interaction_description || caption?.overall_caption || shallowRecord(caption);
      const angleRms = values => arr(values).length ? Math.sqrt(arr(values).reduce((sum, value) => sum + Number(value) ** 2, 0) / arr(values).length) : NaN;
      panel.innerHTML = `${syncHead("随视频同步的 SHOW3D 标注", "精确 scene / frame", "", `源 ${fmt(time, 3)} s · frame ${frameIndex} @ ${media.fps || 60} Hz`)}
        <div class="sync-grid">
          ${kv("动作 / caption", `${esc(captionAction || "—")}<br><span class="sync-note">recording-level Qwen3-VL 自动描述，不是逐帧人工动作 GT。</span>`, true)}
          ${kv("recording 语义", chips([caption?.object_alias, caption?.action_hint, caption?.hand, caption?.intent]))}
          ${kv("手部 confidence", `L ${fmt(hand.left.confidence, 3)} · R ${fmt(hand.right.confidence, 3)} · threshold 0.5`)}
          ${kv("左手 3D pose", `21×3 ${arr(hand.left.points3d).length ? "available" : "—"} · joint-angle RMS ${fmt(angleRms(hand.left.jointAngles), 4)}<br>wrist t ${esc(vec(hand.left.wristTranslation))} mm · R ${esc(vec(hand.left.wristRotation?.[0]))}`)}
          ${kv("右手 3D pose", `21×3 ${arr(hand.right.points3d).length ? "available" : "—"} · joint-angle RMS ${fmt(angleRms(hand.right.jointAngles), 4)}<br>wrist t ${esc(vec(hand.right.wristTranslation))} mm · R ${esc(vec(hand.right.wristRotation?.[0]))}`)}
          ${kv("物体 SE(3)", object ? `confidence ${fmt(object.confidence, 3)} · t ${esc(vec(objectTranslation))} mm<br>R ${esc(vec(objectRotation, 3))}` : "该帧没有 object pose")}
          ${kv("相机可用性", hand.record?.missing_cameras?.length ? chips(hand.record.missing_cameras) : "当前帧两路相机均未标为 missing")}
          ${kv("可视化边界", "视频上只画官方 2D hand landmarks。此样本 object 标注没有 vertices_world_space，因此不伪造 mesh / contour。", true)}
        </div>`;
    };
    return watch(video, update);
  }

  async function segmentAnnotation(viewer, dataset, media, video, kind, mountId) {
    const panel = panelFor(viewer);
    panel.innerHTML = `<div class="sync-loading">正在读取当前 exact sequence 的动作区间…</div>`;
    const data = await fetchJSON(media.annotation.path);
    if (viewer._mountId !== mountId) return () => {};
    const segments = arr(data.segments);
    const start = Number(data.source_window_seconds?.[0] ?? media.sourceStart);
    const end = Number(data.source_window_seconds?.[1] ?? (start + media.clipDuration));
    const update = () => {
      const time = sourceTime(video, media, kind);
      const current = segments.find(item => Number(item.display_start) <= time && time < Number(item.display_end));
      panel.innerHTML = `${syncHead("随视频同步的 fine action", "精确 e1", "", `源 ${fmt(time, 3)} s · frame ${Math.round(time * Number(data.fps || 30))}`)}
        <div class="sync-grid">
          ${kv("当前动作语义", current ? `<b>${esc(current.label)}</b>` : "动作区间之间的空档", true)}
          ${kv("官方原始帧区间", current ? esc(current.id) : "—")}
          ${kv("显示区间", current ? `${fmt(current.display_start)}–${fmt(current.display_end)} s` : "—")}
          ${kv("175–185 s fine-action 时间轴", timeline(segments, time, "display_start", "display_end", () => "", start, end), true)}
          ${kv("未随仓库分发", "3D hands 位于约 72 GB 的 AssemblyPoses release；当前 12-view montage 也不是此记录。", true)}
        </div>`;
    };
    return watch(video, update);
  }

  function actionLabel(item) {
    const pairs = arr(item.main_actions).length ? item.main_actions : item.pairs;
    if (arr(pairs).length) return pairs.map(pair => arr(pair).join(" ")).join("；");
    return [...arr(item.verbs), ...arr(item.nouns)].join(" / ") || item.label || item.name || "—";
  }

  async function hdEpicAnnotation(viewer, dataset, media, video, kind, mountId) {
    const panel = panelFor(viewer);
    panel.innerHTML = `<div class="sync-loading">正在读取 HD-EPIC 同一记录 134–153 s 的动作、活动、声音、物体与 gaze…</div>`;
    const data = await fetchJSON(media.annotation.path);
    if (viewer._mountId !== mountId) return () => {};
    const start = Number(data.time_window_seconds?.[0] ?? media.sourceStart);
    const end = Number(data.time_window_seconds?.[1] ?? (start + media.clipDuration));
    const tracks = [
      ...arr(data.actions).map(item => ({...item, start: item.start_timestamp, end: item.end_timestamp, label: actionLabel(item), cls: ""})),
      ...arr(data.high_level_activities).map(item => ({...item, label: item.label, cls: "high"})),
      ...arr(data.sounds).map(item => ({...item, label: item.label, cls: "sound"})),
      ...arr(data.object_movements).map(item => ({...item, label: item.name, cls: "object"})),
      ...arr(data.gaze_priming).map(item => ({...item, start: item.prime?.time, end: Number(item.prime?.time) + .12, label: `gaze→object ${item.object_id}`, cls: "gaze"}))
    ].filter(item => finite(item.start) && finite(item.end));
    const update = () => {
      const time = sourceTime(video, media, kind);
      const actions = active(data.actions, time, "start_timestamp", "end_timestamp");
      const high = active(data.high_level_activities, time);
      const sounds = active(data.sounds, time);
      const objects = active(data.object_movements, time);
      const gaze = arr(data.gaze_priming).filter(item => Math.abs(Number(item.prime?.time) - time) < .55);
      const objectDetails = objects.map(item => {
        const endpoint = nearest(item.keyframes, time);
        return `${esc(item.name)} · ${fmt(item.start, 2)}–${fmt(item.end, 2)} s<br><span class="sync-note">最近的官方 endpoint @ ${fmt(endpoint?.time, 2)} s：bbox ${esc(vec(endpoint?.bbox, 1))} · 3D ${esc(vec(endpoint?.["3d_location"]))}</span>`;
      }).join("<br>");
      panel.innerHTML = `${syncHead("随视频同步的 HD-EPIC 多轨标注", "精确 recording", "", `源 ${fmt(time, 3)} s · frame ${Math.round(time * Number(data.video_fps || 30))}`)}
        <div class="sync-grid">
          ${kv("当前 action / narration", actions.length ? actions.map(item => `<b>${esc(actionLabel(item))}</b> (${fmt(item.start_timestamp, 2)}–${fmt(item.end_timestamp, 2)} s)`).join("<br>") : "当前没有 action 区间", true)}
          ${kv("verb / noun / hand", actions.length ? `${chips(actions.flatMap(item => item.verbs))}${chips(actions.flatMap(item => item.nouns))}${chips(actions.flatMap(item => item.hands))}` : "—")}
          ${kv("高层活动", esc(high.map(item => item.label).join("；") || "—"))}
          ${kv("声音", chips(sounds.map(item => item.label)))}
          ${kv("物体移动", objectDetails || "—")}
          ${kv("gaze priming（±0.55 s）", gaze.length ? gaze.map(item => `object ${esc(item.object_id)} · gap ${fmt(item.prime?.gap_seconds, 2)} s · point ${esc(vec(item.prime?.gaze_point))}`).join("<br>") : "—")}
          ${kv("134–153 s 多轨时间轴", `${timeline(tracks, time, "start", "end", item => item.cls, start, end)}<div class="sync-legend"><span>action</span><span class="high">high-level</span><span class="sound">sound</span><span class="object">object</span><span class="gaze">gaze</span></div>`, true)}
          ${kv("标注边界", "物体 bbox / 3D 位置只有轨迹端点，不做伪逐帧插值；gaze prime.frame=-2 是官方排除值，不解释成“没有注视”。HD-EPIC 没有人体姿态 GT。", true)}
        </div>`;
    };
    return watch(video, update);
  }

  function parseNpy(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (view.getUint8(0) !== 0x93 || String.fromCharCode(...bytes.slice(1, 6)) !== "NUMPY") throw new Error("NPY magic 不匹配");
    const major = view.getUint8(6);
    const headerLength = major === 1 ? view.getUint16(8, true) : view.getUint32(8, true);
    const headerStart = major === 1 ? 10 : 12;
    const header = new TextDecoder("latin1").decode(bytes.slice(headerStart, headerStart + headerLength));
    const descr = header.match(/['\"]descr['\"]\s*:\s*['\"]([^'\"]+)/)?.[1];
    const shapeText = header.match(/['\"]shape['\"]\s*:\s*\(([^)]*)\)/)?.[1] || "";
    const shape = shapeText.split(",").map(part => Number(part.trim())).filter(Number.isFinite);
    const payload = bytes.slice(headerStart + headerLength).buffer;
    let data;
    if (descr?.endsWith("f4")) data = new Float32Array(payload);
    else if (descr?.endsWith("f8")) data = new Float64Array(payload);
    else if (descr?.endsWith("i8")) data = new BigInt64Array(payload);
    else if (descr?.endsWith("i4")) data = new Int32Array(payload);
    else if (descr?.endsWith("u1") || descr === "|b1") data = new Uint8Array(payload);
    else throw new Error(`暂不支持 NPY dtype ${descr}`);
    return {descr, shape, data};
  }

  function parseNpz(buffer) {
    const view = new DataView(buffer);
    let eocd = -1;
    for (let offset = buffer.byteLength - 22; offset >= Math.max(0, buffer.byteLength - 65558); offset -= 1) {
      if (view.getUint32(offset, true) === 0x06054b50) { eocd = offset; break; }
    }
    if (eocd < 0) throw new Error("NPZ central directory 不存在");
    const entries = view.getUint16(eocd + 10, true);
    let cursor = view.getUint32(eocd + 16, true);
    const result = {};
    const decoder = new TextDecoder();
    for (let i = 0; i < entries; i += 1) {
      if (view.getUint32(cursor, true) !== 0x02014b50) throw new Error("NPZ central entry 损坏");
      const method = view.getUint16(cursor + 10, true);
      const size = view.getUint32(cursor + 20, true);
      const nameLength = view.getUint16(cursor + 28, true);
      const extraLength = view.getUint16(cursor + 30, true);
      const commentLength = view.getUint16(cursor + 32, true);
      const localOffset = view.getUint32(cursor + 42, true);
      const name = decoder.decode(new Uint8Array(buffer, cursor + 46, nameLength));
      if (method !== 0) throw new Error(`NPZ entry ${name} 使用压缩 method ${method}`);
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const bytes = new Uint8Array(buffer, dataStart, size);
      result[name.replace(/\.npy$/, "")] = parseNpy(bytes);
      cursor += 46 + nameLength + extraLength + commentLength;
    }
    return result;
  }

  function npzVector(array, indexes, length) {
    if (!array?.data) return [];
    const offset = indexes.reduce((memo, index, axis) => {
      const stride = array.shape.slice(axis + 1).reduce((a, b) => a * b, 1);
      return memo + index * stride;
    }, 0);
    return Array.from(array.data.slice(offset, offset + length), value => Number(value));
  }

  async function openAoeAnnotation(viewer, dataset, media, video, kind, mountId) {
    const panel = panelFor(viewer);
    panel.innerHTML = `<div class="sync-loading">正在从 pinned revision 读取 action JSON、hands.npz 与 camera_traj.npz（约 4.2 MB）…</div>`;
    const base = "https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h/resolve/c363c7866816505c697b9a7ab76341eb2773716b/aoe_20260214_233341_p000";
    const actionUrl = annotationUrls(dataset, "ego_action");
    const [segments, handBuffer, cameraBuffer] = await Promise.all([
      fetchJSON(actionUrl),
      fetchBuffer(`${base}/ego_process/ego_hands_reconstruction/hands.npz`),
      fetchBuffer(`${base}/ego_process/ego_hands_reconstruction/camera_traj.npz`)
    ]);
    if (viewer._mountId !== mountId) return () => {};
    const hands = parseNpz(handBuffer);
    const camera = parseNpz(cameraBuffer);
    const frameCount = hands.pred_valid?.shape?.[1] || hands.pred_trans?.shape?.[1] || 5430;
    const start = Number(media.sourceStart || 3), end = start + Number(media.clipDuration || 12);
    const normalized = arr(segments).map(item => ({
      ...item,
      start: Number(item.start_ts),
      end: Number(item.end_ts),
      label: arr(item.atomic_action).map(action => action.description || `${action.verb} ${action.object}`).join("；")
    }));
    const update = () => {
      const time = sourceTime(video, media, kind);
      const frame = Math.max(0, Math.min(frameCount - 1, Math.round(time * Number(media.fps || 30))));
      const current = normalized.find(item => item.start <= time && time < item.end);
      const atoms = arr(current?.atomic_action);
      const leftValid = Number(npzVector(hands.pred_valid, [0, frame], 1)[0] || 0);
      const rightValid = Number(npzVector(hands.pred_valid, [1, frame], 1)[0] || 0);
      const leftT = npzVector(hands.pred_trans, [0, frame], 3);
      const rightT = npzVector(hands.pred_trans, [1, frame], 3);
      const leftR = npzVector(hands.pred_rot, [0, frame], 3);
      const rightR = npzVector(hands.pred_rot, [1, frame], 3);
      const leftPose = npzVector(hands.pred_hand_pose, [0, frame], 45);
      const rightPose = npzVector(hands.pred_hand_pose, [1, frame], 45);
      const c2w = npzVector(camera.cam_c2w, [frame], 16);
      const poseRms = values => values.length ? Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / values.length) : NaN;
      panel.innerHTML = `${syncHead("随视频同步的 Open-AoE 自动标注", "精确 sample / frame", "", `源 ${fmt(time, 3)} s · frame ${frame}/${frameCount - 1}`)}
        <div class="sync-warning"><b>官方 action JSON QC anomaly：</b>当前 3–15 s 全部落在异常延长的 segment #25（2.5666–180.997 s）。下面忠实展示原文件，不把它当作干净 GT。</div>
        <div class="sync-grid" style="margin-top:7px">
          ${kv("当前 atomic action", atoms.length ? atoms.map(action => `<b>${esc(action.verb)} ${esc(action.object)}</b> · ${esc(action.hand)} · conf ${fmt(action.confidence, 2)}<br>${esc(action.description)}<br>bbox ${esc(vec(action.bbox, 0))} (raw 1920×1080)`).join("<br>") : "—", true)}
          ${kv("MANO validity / wrist t", `L ${leftValid ? "valid" : "invalid"} ${esc(vec(leftT))}<br>R ${rightValid ? "valid" : "invalid"} ${esc(vec(rightT))}`)}
          ${kv("MANO wrist rotation", `L ${esc(vec(leftR))}<br>R ${esc(vec(rightR))}`)}
          ${kv("45D hand-pose RMS", `L ${fmt(poseRms(leftPose), 4)} · R ${fmt(poseRms(rightPose), 4)}`)}
          ${kv("camera c2w translation", c2w.length === 16 ? esc(vec([c2w[3], c2w[7], c2w[11]])) : "—")}
          ${media.bakedAnnotations?.length ? kv("当前视频已烧录", chips(media.bakedAnnotations)) : ""}
          ${kv("可用 / 不可用字段", "有：MANO rotation/translation/45D pose、betas、valid、camera SE(3)、K。无：depth、body pose、独立 object track。", true)}
          ${kv("3–15 s action 时间轴", timeline(normalized, time, "start", "end", () => "", start, end), true)}
        </div>`;
    };
    return watch(video, update);
  }

  function parseCsvTable(text) {
    const lines = text.replace(/\r/g, "").trim().split("\n");
    const headers = (lines.shift() || "").split(",");
    const index = Object.fromEntries(headers.map((header, position) => [header, position]));
    return {index, rows: lines.map(line => line.split(","))};
  }

  function csvNumber(table, row, key) {
    const position = table.index[key];
    return position === undefined ? NaN : Number(row?.[position]);
  }

  function humanHand(table, frame) {
    const row = table.rows[Math.max(0, Math.min(table.rows.length - 1, frame))];
    const landmarks = side => Array.from({length: 21}, (_, joint) => [
      csvNumber(table, row, `tx_${side}_landmark_${joint}_device`),
      csvNumber(table, row, `ty_${side}_landmark_${joint}_device`),
      csvNumber(table, row, `tz_${side}_landmark_${joint}_device`)
    ]);
    const wrist = side => ["tx", "ty", "tz", "qx", "qy", "qz", "qw"].map(axis => csvNumber(table, row, `${axis}_${side}_device_wrist`));
    return {
      timestamp: csvNumber(table, row, "tracking_timestamp_us"),
      leftConfidence: csvNumber(table, row, "left_tracking_confidence"),
      rightConfidence: csvNumber(table, row, "right_tracking_confidence"),
      left: landmarks("left"), right: landmarks("right"),
      leftWrist: wrist("left"), rightWrist: wrist("right")
    };
  }

  function phaseSeries(value) {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];
    for (const key of ["phases", "phase", "labels", "predictions", "results", "frame_phases", "phase_results"]) {
      if (Array.isArray(value[key])) return value[key];
    }
    const numeric = Object.keys(value).filter(key => /^\d+$/.test(key));
    if (numeric.length) return numeric.sort((a, b) => Number(a) - Number(b)).map(key => value[key]);
    for (const child of Object.values(value)) {
      const result = phaseSeries(child);
      if (result.length) return result;
    }
    return [];
  }

  function phaseCode(value) {
    if (value && typeof value === "object") value = value.phase ?? value.phase_id ?? value.label ?? value.prediction ?? value.value;
    return Number(value);
  }

  function phaseAt(data, frame) {
    const windows = data?.stage_window_check?.windows;
    if (windows && typeof windows === "object") {
      for (const [code, intervals] of Object.entries(windows)) {
        if (arr(intervals).some(interval => Number(interval?.[0]) <= frame && frame <= Number(interval?.[1]))) return Number(code);
      }
    }
    const series = phaseSeries(data);
    return phaseCode(series[frame]);
  }

  function trackerObject(data, name) {
    return data?.[name] || data?.objects?.[name] || data?.results?.[name] || data?.tracks?.[name] || null;
  }

  function trackerFrame(data, name, frame) {
    const object = trackerObject(data, name);
    const points = object?.tracks?.[frame] || object?.track?.[frame] || [];
    const visibility = object?.visibility?.[frame] || object?.visible?.[frame] || [];
    return {
      points,
      visiblePoints: arr(points).filter((_, index) => Number(visibility?.[index]) > .5),
      visibility,
      visible: arr(visibility).filter(value => Number(value) > .5).length
    };
  }

  async function humanEgoAnnotation(viewer, dataset, media, video, kind, mountId) {
    const panel = panelFor(viewer);
    const keypointMode = media.annotation.mode === "keypoints";
    panel.innerHTML = `<div class="sync-loading">正在读取同一 HumanEgo recording 的 hand tracking、phase${keypointMode ? " 与 object CoTracker" : ""}…</div>`;
    const handUrl = annotationUrls(dataset, "hand_tracking");
    const phaseUrl = annotationUrls(dataset, "aria_phases");
    const trackerUrl = annotationUrls(dataset, "cotracker");
    const [handText, phaseData, trackerData, calibration, selector, triangulation] = await Promise.all([
      fetchText(handUrl),
      fetchJSON(phaseUrl),
      keypointMode ? fetchJSON(trackerUrl) : Promise.resolve(null),
      fetchJSON(annotationUrls(dataset, "aria_cam")).catch(() => null),
      fetchJSON(annotationUrls(dataset, "kptsselector")).catch(() => null),
      fetchJSON(annotationUrls(dataset, "camtriangulator")).catch(() => null)
    ]);
    if (viewer._mountId !== mountId) return () => {};
    const hands = parseCsvTable(handText);
    const phaseLabels = {
      0: "STOP / MANIPULATION",
      1: "FORWARD / NAVIGATION",
      2: "ROTATE / NAVIGATION",
      3: "TRANSITION",
      4: "FINISHED"
    };
    const update = () => {
      const time = sourceTime(video, media, kind);
      const viewFrame = Math.max(0, Math.round(time * Number(media.fps || 30)));
      const recordFrame = Math.max(0, Math.min(hands.rows.length - 1, viewFrame + Number(media.recordFrameOffset || 0)));
      const hand = humanHand(hands, recordFrame);
      const phase = phaseAt(phaseData, recordFrame);
      const bread = keypointMode ? trackerFrame(trackerData, "obj1", viewFrame) : null;
      const plate = keypointMode ? trackerFrame(trackerData, "obj2", viewFrame) : null;
      const validity = value => Number(value) < 0 ? "invalid" : `${(Number(value) * 100).toFixed(1)}%`;
      const trackSummary = keypointMode
        ? `bread ${bread.visible}/20 visible · plate ${plate.visible}/20 visible`
        : "当前 Aria 视图不读取 object track；请切换 Keypoints。";
      panel.innerHTML = `${syncHead("HumanEgo 官方处理标注", "同一 recording", "", `${keypointMode ? "kp" : "aria"} frame ${viewFrame} · record frame ${recordFrame} · ${fmt(time, 3)} s`)}
        <div class="sync-grid">
          ${kv("任务 / 动作阶段", `<b>serve_bread</b> · ${esc(phaseLabels[phase] || `unknown phase ${phase}`)}`, true)}
          ${kv("双手 tracking confidence", `L ${validity(hand.leftConfidence)} · R ${validity(hand.rightConfidence)}`)}
          ${kv("wrist SE(3) (device)", `L ${esc(vec(hand.leftWrist))}<br>R ${esc(vec(hand.rightWrist))}`)}
          ${kv("object 2D tracks", trackSummary)}
          ${kv("官方烧录画面", chips(media.bakedAnnotations))}
          ${kv(keypointMode ? "手部 + object tracks 投影" : "双手 3D device x/y 投影", `<canvas class="pose-mini" data-pose></canvas>`, true)}
          ${kv("帧映射 / QC", keypointMode
            ? "kp/cotracker frame = round(video seconds × 30)；record/hand/phase frame = kp frame + 58。"
            : "aria/hand/phase frame = round(video seconds × 30)。官方 MPS 是 row-aligned 派生 overlay；首 RGB 与 MPS timestamp 约有 2 帧偏差。", true)}
          ${kv("RGB camera config", esc(shallowRecord(calibration)))}
          ${kv("reference 2D points", `${esc(Object.keys(selector || {}).join(", ") || "—")} · bread / plate 各 20 点`)}
          ${kv("静态 triangulation", `cam0_c2w ${esc(vec(deepFind(triangulation, "cam0_c2w")?.flat?.(), 3))}<br>${esc(Object.keys(triangulation || {}).join(", ") || "—")} · 每物体 20×3 world/cam0 points + object_to_cam0_matrix；不是逐帧 object pose。`, true)}
        </div>`;
      drawPose(panel.querySelector("[data-pose]"), keypointMode ? [
        {points: bread.visiblePoints, color: "#f0a548"},
        {points: plate.visiblePoints, color: "#61d3b7"}
      ] : [
        {points: hand.left, color: "#49a7ff", hand: true},
        {points: hand.right, color: "#ff625f", hand: true}
      ]);
    };
    return watch(video, update);
  }

  async function mountAnnotation(viewer, dataset, media, video, kind, mountId) {
    if (viewer._annotationCleanup) viewer._annotationCleanup();
    viewer._annotationCleanup = () => {};
    try {
      let cleanup;
      switch (media.annotation?.kind) {
        case "ropedia": cleanup = await ropediaAnnotation(viewer, dataset, media, video, kind, mountId); break;
        case "comind": cleanup = await comindAnnotation(viewer, dataset, media, video, kind, mountId); break;
        case "show3d": cleanup = await show3dAnnotation(viewer, dataset, media, video, kind, mountId); break;
        case "segments": cleanup = await segmentAnnotation(viewer, dataset, media, video, kind, mountId); break;
        case "hd-epic": cleanup = await hdEpicAnnotation(viewer, dataset, media, video, kind, mountId); break;
        case "open-aoe": cleanup = await openAoeAnnotation(viewer, dataset, media, video, kind, mountId); break;
        case "humanego": cleanup = await humanEgoAnnotation(viewer, dataset, media, video, kind, mountId); break;
        default: cleanup = genericAnnotation(viewer, dataset, media, video, kind);
      }
      if (viewer._mountId === mountId) viewer._annotationCleanup = cleanup || (() => {});
      else cleanup?.();
    } catch (error) {
      const panel = panelFor(viewer);
      if (viewer._mountId === mountId && panel) {
        panel.innerHTML = `${syncHead("当前媒体的标注", "读取失败", "unmapped")}
          <div class="sync-warning">标注源暂时无法读取：${esc(error.message)}。视频仍可播放；下方保留原始来源链接。</div>
          ${media.bakedAnnotations?.length ? `<div style="margin-top:7px">${kv("画面中仍可直接看到", chips(media.bakedAnnotations), true)}</div>` : ""}`;
      }
    }
  }

  function missing(stage, dataset, media, remoteFailed = false) {
    stage.innerHTML = "";
    const locked = dataset.evidence === "locked" || (!media.local && !media.remote);
    const title = locked ? "此项不提供公开可嵌媒体" : remoteFailed ? "官方媒体无法在此页内嵌" : "本地素材尚未准备";
    const detail = locked ? "受许可或开放状态限制，请回到官方页面查看。" : remoteFailed
      ? "源站可能限制跨站播放；可单独打开官方媒体，或下载到本地缓存。"
      : "运行许可感知的下载脚本后，页面会自动改用本地文件。";
    const box = document.createElement("div");
    box.className = "empty";
    box.innerHTML = `<div style="font-size:27px">${locked ? "🔒" : "↓"}</div><b>${title}</b><span>${detail}</span><div class="empty-actions"></div>`;
    const actions = box.querySelector(".empty-actions");
    if (media.remote) {
      const link = document.createElement("a");
      link.className = "btn"; link.href = media.remote; link.target = "_blank"; link.rel = "noopener"; link.textContent = "单独打开媒体 ↗";
      actions.append(link);
    }
    if (media.local) {
      const command = document.createElement("code");
      command.textContent = `python3 scripts/bootstrap_assets.py --dataset ${dataset.slug} --accept-source-terms`;
      actions.append(command);
    }
    const manifest = document.createElement("a");
    manifest.className = "btn"; manifest.href = `data/manifests/${dataset.slug}.json`; manifest.target = "_blank"; manifest.textContent = "样例 manifest";
    actions.append(manifest);
    const source = document.createElement("a");
    source.className = "btn"; source.href = dataset.source; source.target = "_blank"; source.rel = "noopener"; source.textContent = "官方来源 ↗";
    actions.append(source);
    stage.append(box);
  }

  function mediaCandidates(media) {
    const local = media.local && {src: media.local, kind: "local"};
    const remote = media.remote && {src: media.remote, kind: "remote"};
    const bundled = String(media.local || "").startsWith("assets/datasets/");
    const ordered = IS_PAGES && !bundled
      ? [remote, local && String(media.local).startsWith("assets/local/") ? null : local]
      : [local, remote];
    return ordered.filter(Boolean).filter((item, index, list) => list.findIndex(other => other.src === item.src) === index);
  }

  function remoteLabel(media) {
    return /^本地(?:\s|$)/.test(media.label || "") ? "官方原片" : media.label;
  }

  function mount(viewer, dataset, media) {
    const stage = viewer.querySelector(".stage");
    const previous = stage.querySelector("video");
    const mountId = (viewer._mountId || 0) + 1;
    viewer._mountId = mountId;
    if (previous) {
      viewer._time = Math.max(0, Number(previous.currentTime || 0) - Number(viewer._sourceBase || 0));
      viewer._playing = !previous.paused && !previous.ended;
    }
    viewer._annotationCleanup?.();
    viewer._overlayCleanup?.();
    viewer._annotationCleanup = () => {};
    viewer._overlayCleanup = () => {};
    stage.innerHTML = `<div class="loading">正在加载可公开媒体…</div>`;
    const list = mediaCandidates(media);
    const caption = viewer.querySelector(".caption");
    const tab = viewer.querySelector(".tab.active");
    if (!list.length) {
      missing(stage, dataset, media);
      genericAnnotation(viewer, dataset, media, null, "none");
      return;
    }
    const attempt = index => {
      if (viewer._mountId !== mountId) return;
      if (index >= list.length) {
        missing(stage, dataset, media, Boolean(media.remote));
        genericAnnotation(viewer, dataset, media, null, "none");
        return;
      }
      const {src, kind} = list[index];
      const isImage = media.type === "image" || /\.(?:gif|png|jpe?g|webp)(?:[?#]|$)/i.test(src);
      const sourceBase = kind === "remote" ? Number(media.sourceStart || 0) : 0;
      const markReady = () => {
        caption.textContent = `${kind === "remote" ? "官方源直连" : "仓库 / 本地"} · ${media.provenance || ""}`;
        if (tab) {
          tab.textContent = kind === "remote" ? remoteLabel(media) : media.label;
          tab.title = kind === "remote" ? "当前直接读取官方媒体" : "当前读取仓库或本地媒体";
        }
      };
      if (isImage) {
        const image = new Image();
        image.alt = `${dataset.name} ${media.label}`;
        image.referrerPolicy = "no-referrer";
        image.src = src;
        image.onload = () => {
          if (viewer._mountId !== mountId) return;
          stage.innerHTML = "";
          stage.append(image);
          markReady();
          mountAnnotation(viewer, dataset, media, null, kind, mountId);
        };
        image.onerror = () => { if (viewer._mountId === mountId) attempt(index + 1); };
        return;
      }
      const video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.referrerPolicy = "no-referrer";
      video.src = src;
      video.onloadedmetadata = () => {
        if (viewer._mountId !== mountId) return;
        stage.innerHTML = "";
        viewer._sourceBase = sourceBase;
        viewer._sourceKind = kind;
        let holder = video;
        if (media.overlay) {
          const stack = document.createElement("div");
          stack.className = "video-stack";
          stack.style.setProperty("--video-aspect", `${media.overlay.width}/${media.overlay.height}`);
          const state = document.createElement("span");
          state.className = "overlay-state";
          state.textContent = "正在读取手部标注…";
          stack.append(video, state);
          holder = stack;
        }
        stage.append(holder);
        const logicalTime = finite(viewer._time) ? Number(viewer._time) : 0;
        const clipStart = sourceBase;
        const clipEnd = sourceBase + Number(media.clipDuration || video.duration || 0);
        const target = clipStart + logicalTime;
        if (finite(video.duration)) video.currentTime = Math.min(Math.max(clipStart, target), Math.max(clipStart, Math.min(clipEnd, video.duration - .05)));
        let clamping = false;
        const clamp = () => {
          if (clamping || !finite(video.duration)) return;
          if (video.currentTime < clipStart - .05) {
            clamping = true; video.currentTime = clipStart; clamping = false;
          } else if (finite(media.clipDuration) && video.currentTime > clipEnd + .05) {
            clamping = true; video.pause(); video.currentTime = Math.min(clipEnd, video.duration - .05); clamping = false;
          }
        };
        video.addEventListener("seeking", clamp);
        video.addEventListener("timeupdate", clamp);
        markReady();
        if (media.overlay) {
          attachShow3dOverlay(holder, video, media, kind, mountId, viewer).then(cleanup => {
            if (viewer._mountId === mountId) viewer._overlayCleanup = cleanup;
            else cleanup?.();
          });
        }
        mountAnnotation(viewer, dataset, media, video, kind, mountId);
        if (viewer._playing) video.play().catch(() => {});
      };
      video.onerror = () => { if (viewer._mountId === mountId) attempt(index + 1); };
      video.load();
    };
    attempt(0);
  }

  function annotationMarkup(dataset) {
    if (!dataset.annotations?.length) return `<div class="ann"><p>没有可核验的 record-level 标注文件。</p></div>`;
    return dataset.annotations.map(annotation => {
      const links = [];
      if (annotation.path) links.push(`<a href="${esc(annotation.path)}" target="_blank">打开本地</a>`);
      if ((annotation.path || annotation.source) && /\.json(?:$|[?#])/i.test(annotation.path || annotation.source)) {
        links.push(`<button type="button" data-json="${esc(annotation.path || "")}" data-source="${esc(annotation.source || "")}" data-viewer="${esc(annotation.viewer || "json")}">${annotation.viewer === "open-aoe-timeline" ? "查看时间轴" : "预览 JSON"}</button>`);
      }
      if (annotation.source) links.push(`<a href="${esc(annotation.source)}" target="_blank" rel="noopener">来源 ↗</a>`);
      return `<div class="ann"><div><b>${esc(annotation.label)}</b> <span class="status">${esc(annotation.status)}</span><div style="font-size:9px;color:var(--muted)">${esc(annotation.format || "")}</div></div><div class="ann-actions">${links.join("")}</div><p>${esc(annotation.note || "")}</p><div class="json-preview hidden"></div></div>`;
    }).join("");
  }

  function card(dataset) {
    const media = dataset.media || [];
    return `<article class="card" data-name="${esc(dataset.name.toLowerCase())}" data-evidence="${esc(dataset.evidence)}" data-availability="${esc(dataset.redistribution)}">
      <div class="card-head"><div class="titleline"><span class="num">${String(dataset.no).padStart(2, "0")}</span><div><h2>${esc(dataset.name)}</h2><div class="sample-id">${esc(dataset.sampleId)}</div></div></div><span class="badge ${esc(dataset.evidence)}">${esc(labels[dataset.evidence])}</span></div>
      <div class="viewer" data-slug="${esc(dataset.slug)}"><div class="stage"></div><div class="tabs">${media.map((item, index) => `<button class="tab ${index === 0 ? "active" : ""}" data-i="${index}" data-label="${esc(item.label)}">${esc(item.label)}</button>`).join("")}</div><div class="caption">${media.length ? esc(media[0].provenance) : "没有公开可嵌媒体"}</div></div>
      <div class="sync-panel"><div class="sync-loading">进入可视区域后读取对应标注…</div></div>
      <div class="body"><p class="summary">${esc(dataset.summary)}</p><div class="meta"><span class="chip">${esc(access[dataset.redistribution] || dataset.redistribution)}</span><span class="chip">${esc(dataset.license)}</span></div><div class="annotations"><h3>标注文件与 overlay</h3>${annotationMarkup(dataset)}</div><div class="card-foot"><a href="data/manifests/${esc(dataset.slug)}.json" target="_blank">样例 manifest</a><a href="${esc(dataset.source)}" target="_blank" rel="noopener">官方来源 ↗</a></div></div>
    </article>`;
  }

  function filter() {
    const query = document.getElementById("q").value.trim().toLowerCase();
    const evidence = document.getElementById("evidence").value;
    const availability = document.getElementById("availability").value;
    let count = 0;
    [...cards.children].forEach((element, index) => {
      const dataset = D[index];
      const haystack = JSON.stringify(dataset).toLowerCase();
      const visible = (!query || haystack.includes(query)) && (!evidence || dataset.evidence === evidence) && (!availability || dataset.redistribution === availability);
      element.classList.toggle("hidden", !visible);
      if (visible) count += 1;
    });
    document.getElementById("result").textContent = `显示 ${count} / ${D.length}`;
  }

  function render() {
    cards.innerHTML = D.map(card).join("");
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      entry.target._activate?.();
    }), {rootMargin: "650px 0px"}) : null;
    [...cards.querySelectorAll(".card")].forEach((element, index) => {
      const dataset = D[index];
      const viewer = element.querySelector(".viewer");
      const stage = viewer.querySelector(".stage");
      const caption = viewer.querySelector(".caption");
      const media = dataset.media || [];
      const activate = () => {
        if (viewer.dataset.mounted) return;
        viewer.dataset.mounted = "1";
        if (media.length) mount(viewer, dataset, media[0]);
        else {
          missing(stage, dataset, {local: "", remote: ""});
          genericAnnotation(viewer, dataset, {}, null, "none");
        }
      };
      viewer._activate = activate;
      stage.innerHTML = media.length ? `<div class="loading">进入可视区域后加载媒体…</div>` : "";
      viewer.querySelectorAll(".tab").forEach(button => {
        button.onclick = () => {
          if (observer) observer.unobserve(viewer);
          viewer.dataset.mounted = "1";
          viewer.querySelectorAll(".tab").forEach(tab => {
            tab.classList.toggle("active", tab === button);
            tab.textContent = tab.dataset.label || tab.textContent;
          });
          const item = media[Number(button.dataset.i)];
          caption.textContent = item.provenance || "";
          mount(viewer, dataset, item);
        };
      });
      if (observer) observer.observe(viewer); else activate();
    });
    filter();
  }

  function openAoeTimeline(object) {
    if (!Array.isArray(object)) return `<div class="qc-warning">文件结构不是预期的 segment 数组，请查看原始 JSON。</div>`;
    const segments = object.map(item => ({
      id: Number(item.id), start: Number(item.start_ts), end: Number(item.end_ts),
      action: arr(item.atomic_action).map(action => action.description || `${action.verb || ""} ${action.object || ""}`.trim()).join("；")
    })).filter(item => finite(item.start) && finite(item.end));
    const max = Math.max(1, ...segments.map(item => item.end));
    const rows = segments.map(item => `<div class="timeline-row"><b>#${item.id}</b><span>${item.start.toFixed(3)}–${item.end.toFixed(3)} s</span><span>${esc(item.action)}</span></div>`).join("");
    return `<div class="qc-warning"><b>官方标注 QC anomaly</b><br>前 24 段集中在 0–2.57 s，最后一段延伸到 ${max.toFixed(3)} s。以下按原文件展示，不把它当作干净 GT。</div>${rows}`;
  }

  cards.addEventListener("click", async event => {
    const button = event.target.closest("[data-json]");
    if (!button) return;
    const output = button.closest(".ann").querySelector(".json-preview");
    const closed = output.classList.contains("hidden");
    if (!closed) {
      output.classList.add("hidden");
      button.textContent = button.dataset.viewer === "open-aoe-timeline" ? "查看时间轴" : "预览 JSON";
      return;
    }
    output.classList.remove("hidden");
    output.textContent = "正在读取标注…";
    try {
      const object = await fetchJSON([button.dataset.json, button.dataset.source]);
      if (button.dataset.viewer === "open-aoe-timeline") {
        output.innerHTML = openAoeTimeline(object);
        button.textContent = "收起时间轴";
      } else {
        const text = JSON.stringify(object, null, 2);
        output.textContent = text.length > 6000 ? `${text.slice(0, 6000)}\n…（仅显示前 6000 字符；可打开原文件查看完整内容）` : text;
        button.textContent = "收起 JSON";
      }
    } catch (error) {
      output.textContent = `本地与官方标注源均无法读取。\n${error.message}`;
    }
  });

  ["q", "evidence", "availability"].forEach(id => document.getElementById(id).addEventListener("input", filter));
  document.getElementById("copy").onclick = async () => {
    const text = document.getElementById("cmd").textContent;
    try {
      await navigator.clipboard.writeText(text);
      document.getElementById("copy").textContent = "已复制";
    } catch (_) {
      document.getElementById("copy").textContent = "请手动复制";
    }
  };
  stats();
  render();
})();
