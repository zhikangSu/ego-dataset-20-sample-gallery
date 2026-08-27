(() => {
  "use strict";

  const BASE_RELEASE = {
    "ropedia": "phased", "ha-ego-1k": "gated", "ace-data-0": "gated",
    "ego-exo4d": "gated", "adt": "gated", "egohtr": "pending",
    "ego-1k": "gated", "ego-oscar": "gated", "comind": "open",
    "egobody": "gated", "hoi4d": "gated", "show3d": "gated",
    "assembly101": "open", "hd-epic": "open", "intervla": "gated",
    "egodex": "open", "open-aoe": "phased", "humanego": "open",
    "aea": "open", "egopat3d": "open"
  };

  const samplePeers = (window.EGO_GALLERY || []).map(dataset => ({
    no: dataset.no,
    slug: dataset.slug,
    name: dataset.name,
    hasSample: true,
    tier: "sample-peer",
    origin: "independent",
    releaseStatus: BASE_RELEASE[dataset.slug] || "pending"
  }));

  const additions = [
    {no: 21, slug: "egolive", name: "EgoLive (JD.com)", year: 2026, hasSample: false, tier: "core-addition", origin: "independent", releaseStatus: "phased"},
    {no: 22, slug: "egoverse", name: "EgoVerse", year: 2026, hasSample: false, tier: "core-addition", origin: "consortium", releaseStatus: "open"},
    {no: 23, slug: "ego4d", name: "Ego4D", year: 2022, hasSample: false, tier: "core-addition", origin: "consortium", releaseStatus: "gated"},
    {no: 24, slug: "egocentric-10k", name: "Egocentric-10K", year: 2026, hasSample: false, tier: "core-addition", origin: "independent", releaseStatus: "open"},
    {no: 25, slug: "egosuite-open100k", name: "EgoSuite-Open100K", year: 2026, hasSample: false, tier: "core-addition", origin: "independent", releaseStatus: "phased"},
    {no: 26, slug: "nymeria", name: "Nymeria / NymeriaPlus", year: 2024, hasSample: false, tier: "core-addition", origin: "independent", releaseStatus: "gated"},
    {no: 27, slug: "epic-kitchens-100", name: "EPIC-KITCHENS-100", year: 2021, hasSample: false, tier: "core-addition", origin: "independent", releaseStatus: "open"},
    {no: 28, slug: "holoassist", name: "HoloAssist", year: 2023, hasSample: false, tier: "core-addition", origin: "independent", releaseStatus: "open"},
    {no: 29, slug: "egolife", name: "EgoLife", year: 2025, hasSample: false, tier: "core-addition", origin: "independent", releaseStatus: "open"},
    {no: 30, slug: "hot3d", name: "HOT3D", year: 2024, hasSample: false, tier: "core-addition", origin: "independent", releaseStatus: "open"},
    {no: 31, slug: "saber", name: "SABER", year: 2026, hasSample: false, tier: "specialized", origin: "independent", releaseStatus: "phased"},
    {no: 32, slug: "egoexolearn", name: "EgoExoLearn", year: 2024, hasSample: false, tier: "specialized", origin: "independent", releaseStatus: "open"},
    {no: 33, slug: "egobrain", name: "EgoBrain", year: 2026, hasSample: false, tier: "specialized", origin: "independent", releaseStatus: "open"},
    {no: 34, slug: "egomagic", name: "EgoMAGIC", year: 2026, hasSample: false, tier: "specialized", origin: "independent", releaseStatus: "open"},
    {no: 35, slug: "meccano", name: "MECCANO", year: 2020, hasSample: false, tier: "specialized", origin: "independent", releaseStatus: "gated"},
    {no: 36, slug: "ego-extra", name: "Ego-EXTRA", year: 2026, hasSample: false, tier: "specialized", origin: "independent", releaseStatus: "open"},
    {no: 37, slug: "charades-ego", name: "Charades-Ego", year: 2018, hasSample: false, tier: "specialized", origin: "independent", releaseStatus: "open"},
    {no: 38, slug: "egocom", name: "EgoCom", year: 2020, hasSample: false, tier: "specialized", origin: "independent", releaseStatus: "open"},
    {no: 39, slug: "mobileego-anywhere", name: "MobileEgo Anywhere", year: 2026, hasSample: false, tier: "specialized", origin: "independent", releaseStatus: "pending"}
  ];

  window.EGO_SCENE_DATASETS = [...samplePeers, ...additions];

  window.EGO_RELEASE_STATUS = {
    open: {label: "公开可下载", short: "可下载"},
    gated: {label: "申请或接受条款后开放", short: "申请开放"},
    phased: {label: "分批开放或仅公开子集", short: "分批 / 子集"},
    pending: {label: "论文声称开放，但完整入口仍需核验", short: "入口待核验"}
  };

  window.EGO_SCENE_BOUNDARIES = [
    {
      label: "衍生数据，不重复计为独立采集",
      items: ["EgoVid-5M · 基于 Ego4D 等视频的切分/文本化", "OpenEgo · 多数据集统一格式与处理工具"]
    },
    {
      label: "超大规模声明，等待可枚举 manifest",
      items: ["EgoScale", "SEA", "MOVAS-Ego"]
    },
    {
      label: "近期项目，继续跟踪开放完整性",
      items: ["PRISM · DreamVu 零售多视角数据", "EgoLive 平台版 2,000 h 与论文版 1,680 h 的对应关系"]
    }
  ];
})();
