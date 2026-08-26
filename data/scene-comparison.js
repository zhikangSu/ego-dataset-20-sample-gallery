window.EGO_SCENE_COMPARISON = {
  "ropedia": {
    level: "unavailable", scene: "none", task: "none",
    sceneNote: "公开 sample 仅 1 条 episode，不能代表完整地点分布。",
    taskNote: "完整任务频次与 location 汇总需申请访问。"
  },
  "ha-ego-1k": {
    level: "semantic", scene: "scope", task: "frequency",
    sceneNote: "22 个 semantic groups 混合了工作地点与任务，不能拆成纯物理房间频次。",
    taskNote: "官方给出 22 组的 clip 数与录制小时。"
  },
  "ace-data-0": {
    level: "activity", scene: "scope", task: "frequency",
    sceneNote: "只公开 table-scale 与 room-scale 的采集范围。",
    taskNote: "官方图给出 3 个任务族的帧数与占比。"
  },
  "ego-exo4d": {
    level: "activity", scene: "scope", task: "frequency",
    sceneNote: "公开 123 sites / 13 cities 与各 domain 的 site 数，但没有物理地点类别频次。",
    taskNote: "8 个活动 domain 可按 takes 与 video-hours 比较。"
  },
  "adt": {
    level: "physical", scene: "frequency", task: "taxonomy",
    sceneNote: "原始发布可按 apartment / office 统计 200 条序列。",
    taskNote: "只公开 apartment 内活动范围，没有逐活动频数。"
  },
  "egohtr": {
    level: "physical", scene: "frequency", task: "taxonomy",
    sceneNote: "7 个 location 有逐地点时长与序列数。",
    taskNote: "公开 5 个 action codes，但没有逐动作频数。"
  },
  "ego-1k": {
    level: "physical", scene: "frequency", task: "none",
    sceneNote: "可从公开 Parquet 对 956 条 recording 的 layout 与 illuminance 复算。",
    taskNote: "当前公开 schema 没有可核验的全局任务频次。"
  },
  "ego-oscar": {
    level: "activity", scene: "none", task: "frequency",
    sceneNote: "没有独立、互斥的物理场景汇总。",
    taskNote: "官方由 action captions 近似聚合 7 个 activity families。"
  },
  "comind": {
    level: "interaction", scene: "none", task: "frequency",
    sceneNote: "公开 benchmark 标注没有物理地点类别频次。",
    taskNote: "可从公开 SCOIA 标注复算 verb 与 L3 object event 分布。"
  },
  "egobody": {
    level: "composition", scene: "taxonomy", task: "taxonomy",
    sceneNote: "公开 5 类交互环境与场景构成，但没有逐环境样本频数。",
    taskNote: "交互类型可枚举，缺少统一的逐任务频次表。"
  },
  "hoi4d": {
    level: "interaction", scene: "none", task: "frequency",
    sceneNote: "release path 没有可解释的物理 room / location 类别。",
    taskNote: "可按 released subset 的交互目标物体类别统计序列数；这是任务代理，不是动作语义频次。"
  },
  "show3d": {
    level: "interaction", scene: "none", task: "frequency",
    sceneNote: "scene_id 是记录标识，不是物理环境 taxonomy。",
    taskNote: "官方 Parquet 可复算 object alias 与 action string 的 scene 数。"
  },
  "assembly101": {
    level: "activity", scene: "scope", task: "frequency",
    sceneNote: "固定多视角 assembly setup，不构成跨环境场景分布。",
    taskNote: "官方给出 101 个 toy categories 的 recording 分布。"
  },
  "hd-epic": {
    level: "activity", scene: "taxonomy", task: "frequency",
    sceneNote: "41 个家庭厨房的 fixture 类型可比，但不是逐厨房样本频次。",
    taskNote: "公开 recipe annotations 可统计 recipe capture 分布。"
  },
  "intervla": {
    level: "composition", scene: "taxonomy", task: "taxonomy",
    sceneNote: "只发布场景组成与交互范围，没有类别频数。",
    taskNote: "有交互 / 任务范围，暂无全局逐类频次。"
  },
  "egodex": {
    level: "activity", scene: "scope", task: "frequency",
    sceneNote: "主要是 tabletop 采集范围，没有物理地点分布。",
    taskNote: "官方给出 10 类 tabletop task 的任务数。"
  },
  "open-aoe": {
    level: "semantic", scene: "frequency", task: "taxonomy",
    sceneNote: "100 小时 audit 给出 semantic scene label 的出现率。",
    taskNote: "atomic actions 可逐片段查看，但没有可核验的全局任务频次表。"
  },
  "humanego": {
    level: "activity", scene: "none", task: "frequency",
    sceneNote: "公开 schema 没有 location / room / environment 字段。",
    taskNote: "可从当前公开 task directories 复算 recording 数。"
  },
  "aea": {
    level: "physical", scene: "frequency", task: "taxonomy",
    sceneNote: "5 个匿名 indoor locations 有 recording 数与四舍五入时长。",
    taskNote: "activity scripts 可枚举，但没有逐帧或逐类时间频次。"
  },
  "egopat3d": {
    level: "physical", scene: "frequency", task: "scope",
    sceneNote: "15 个命名 household scenes 各 10 recordings，完全均衡。",
    taskNote: "公布每场景 action 总量，未公布 action-category frequency。"
  }
};
