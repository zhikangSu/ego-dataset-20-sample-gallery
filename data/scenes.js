window.EGO_SCENES = {
  "ropedia": {
    status: "unavailable",
    availability: "none",
    basis: "完整集地点 / 语义场景",
    scope: "完整 Xperience-10M 需申请访问；公开 sample 只有 1 条 episode，不能代表 10,000 h 完整集。",
    facts: [
      {label: "官方规模", value: "10M interactions"},
      {label: "视频时长", value: "10,000 h"},
      {label: "公开 sample", value: "1 episode"}
    ],
    note: "官方没有公开可枚举的 location 或 semantic-scene 汇总表。本页不从单条样例视频主观猜测场景类型或比例。",
    sources: [
      {label: "官方完整集数据卡", url: "https://huggingface.co/datasets/ropedia-ai/xperience-10m"},
      {label: "官方 sample", url: "https://huggingface.co/datasets/ropedia-ai/xperience-10m-sample"}
    ]
  },

  "ha-ego-1k": {
    status: "reported",
    availability: "proxy",
    basis: "22 个官方 semantic groups → 统一场景族",
    scope: "官方发布表覆盖 484 clips；本页按表内 23.91 h 映射为 7 个场景族，并保留全部 22 个原始组。",
    denominator: {value: 23.91, unit: "h", label: "官方分组表内录制时长"},
    normalized: [
      {category: "service", value: 6.95, label: "商业 / 服务"},
      {category: "bath-laundry", value: 5.85, label: "卫浴 / 洗衣"},
      {category: "industrial", value: 5.75, label: "工厂 / 仓库 / 工地"},
      {category: "home", value: 2.00, label: "住宅综合"},
      {category: "workshop", value: 1.96, label: "维修 / 工坊"},
      {category: "kitchen", value: 0.79, label: "厨房"},
      {category: "office", value: 0.61, label: "办公 / 学习"}
    ],
    charts: [{
      dimension: "完整 22 组官方分布",
      unit: "h",
      total: 23.91,
      scaleNote: "时长按官方表；括号为 clips",
      items: [
        {label: "Laundry · ironing", value: 2.78, display: "2.78 h · 11 clips", mapping: "bath-laundry"},
        {label: "Hair salon", value: 2.36, display: "2.36 h · 13 clips", mapping: "service"},
        {label: "Home cleaning", value: 2.00, display: "2.00 h · 30 clips", mapping: "home"},
        {label: "Nail salon", value: 1.97, display: "1.97 h · 21 clips", mapping: "service"},
        {label: "Warehouse packing", value: 1.85, display: "1.85 h · 32 clips", mapping: "industrial"},
        {label: "Car workshop", value: 1.66, display: "1.66 h · 48 clips", mapping: "workshop"},
        {label: "Shoe washing", value: 1.44, display: "1.44 h · 30 clips", mapping: "service"},
        {label: "Construction · tile/panel/tool", value: 1.32, display: "1.32 h · 39 clips", mapping: "industrial"},
        {label: "Laundry · sorting/folding", value: 1.02, display: "1.02 h · 30 clips", mapping: "bath-laundry"},
        {label: "Bottle factory", value: 0.98, display: "0.98 h · 36 clips", mapping: "industrial"},
        {label: "Bar / restaurant", value: 0.90, display: "0.90 h · 20 clips", mapping: "service"},
        {label: "Laundry · handwashing", value: 0.85, display: "0.85 h · 29 clips", mapping: "bath-laundry"},
        {label: "Kitchen · cooking/dishes", value: 0.79, display: "0.79 h · 6 clips", mapping: "kitchen"},
        {label: "Factory · misc", value: 0.63, display: "0.63 h · 22 clips", mapping: "industrial"},
        {label: "Office · electronics repair", value: 0.61, display: "0.61 h · 16 clips", mapping: "office"},
        {label: "Construction · misc", value: 0.55, display: "0.55 h · 22 clips", mapping: "industrial"},
        {label: "Bathroom cleaning", value: 0.45, display: "0.45 h · 12 clips", mapping: "bath-laundry"},
        {label: "Laundry · machines", value: 0.42, display: "0.42 h · 20 clips", mapping: "bath-laundry"},
        {label: "Construction · plastering", value: 0.42, display: "0.42 h · 15 clips", mapping: "industrial"},
        {label: "Laundry · other", value: 0.33, display: "0.33 h · 11 clips", mapping: "bath-laundry"},
        {label: "Appliance repair", value: 0.30, display: "0.30 h · 8 clips", mapping: "workshop"},
        {label: "Nursery / plants", value: 0.28, display: "0.28 h · 13 clips", mapping: "service"}
      ]
    }],
    facts: [
      {label: "官方总量", value: "484 clips"},
      {label: "原始分组", value: "22 groups"},
      {label: "表内时长合计", value: "23.91 h"}
    ],
    note: "这些标签混合了地点和任务，所以统一场景族属于可复核的代理映射，而不是官方物理房间 GT。官方页总时长写 23.93 h，逐行四舍五入后为 23.91 h；比例使用后者。",
    sources: [{label: "官方数据卡与分布表", url: "https://huggingface.co/datasets/humanarchive/HA-Ego-1K"}]
  },

  "ace-data-0": {
    status: "taxonomy",
    availability: "presence",
    basis: "官方物理采集尺度",
    scope: "确认包含 table-scale 桌面区与 room-scale 公寓，但官方没有公开两类各自的 episode、frame 或小时比例。",
    normalized: [
      {category: "tabletop", present: true, label: "桌面 / 操作台"},
      {category: "home", present: true, label: "住宅 / 房间级"}
    ],
    taxonomyLabel: "已确认的场景范围",
    taxonomy: ["table-scale area · ≈30 m²", "room-scale apartment · ≈200 m²"],
    facts: [
      {label: "任务类别", value: "200+"},
      {label: "episodes", value: "75K+"},
      {label: "视频帧", value: "≈17M"}
    ],
    note: "原页面的 3 个任务族占比已移除，因为 Chain of HOI、Atomic HOI 与 Human–scene interaction 不是物理场景类别。",
    sources: [
      {label: "官方项目页", url: "https://ace-data-engine.github.io/ACE-Data-0/"},
      {label: "官方论文", url: "https://arxiv.org/abs/2607.28625"}
    ]
  },

  "ego-exo4d": {
    status: "taxonomy",
    availability: "presence",
    basis: "活动 domain 对应的采集场所范围",
    scope: "V2 覆盖 123 sites、13 cities；官方按活动 domain 给出 takes / video-hours，却没有互斥的物理场景类别频次。",
    normalized: [
      {category: "kitchen", present: true, label: "厨房"},
      {category: "workshop", present: true, label: "维修 / 工坊"},
      {category: "sports", present: true, label: "运动 / 健身"},
      {category: "service", present: true, label: "健康 / 表演空间"}
    ],
    taxonomyLabel: "活动相关场所（不是场景比例）",
    taxonomy: [
      "Rock climbing · 2 sites", "Basketball · 5 sites", "Dance · 7 sites", "Cooking · 60 sites",
      "Health · 24 sites", "Bike repair · 8 sites", "Soccer · 14 sites", "Music · 8 sites"
    ],
    facts: [
      {label: "V2 sites", value: "123"},
      {label: "城市", value: "13"},
      {label: "ego 小时", value: "221.26 h"},
      {label: "takes", value: "5,035"}
    ],
    note: "各 domain 的 sites 可能重叠，逐行相加为 128 而不是 123；因此不能把 site 数转成场景百分比，也不能把 cooking / basketball 等任务域冒充场景 GT。",
    sources: [
      {label: "官方 V2 数据页", url: "https://ego-exo4d-data.org/"},
      {label: "官方文档", url: "https://docs.ego-exo4d-data.org/"}
    ]
  },

  "adt": {
    status: "reported",
    availability: "frequency",
    basis: "原始发布的物理场景类型",
    scope: "原始 ADT 论文的 200 条序列：apartment 150、office 50。",
    denominator: {value: 200, unit: "sequences", label: "原始发布序列"},
    normalized: [
      {category: "home", value: 150, label: "Apartment"},
      {category: "office", value: 50, label: "Office"}
    ],
    charts: [{
      dimension: "完整 scene split",
      unit: "sequences",
      total: 200,
      items: [
        {label: "Apartment", value: 150, display: "150 · 75%", mapping: "home"},
        {label: "Office", value: 50, display: "50 · 25%", mapping: "office"}
      ]
    }],
    facts: [
      {label: "场景类型", value: "2"},
      {label: "原始发布", value: "200 sequences"}
    ],
    note: "当前官方文档还出现扩展版数字；为避免混用 release，本页固定采用原始论文的 150 + 50 = 200 口径。",
    sources: [
      {label: "原始论文", url: "https://arxiv.org/abs/2306.06362"},
      {label: "当前官方文档", url: "https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_digital_twin_dataset"}
    ]
  },

  "egohtr": {
    status: "reported",
    availability: "frequency",
    basis: "7 个官方命名 location 的录制时长",
    scope: "55 条序列、81.98 min；统一场景族按 location 类型合并，原始地点完整保留。",
    denominator: {value: 81.98, unit: "min", label: "实际录制时长"},
    normalized: [
      {category: "lab", value: 44.79, label: "Lab Hall"},
      {category: "industrial", value: 23.01, label: "Debris Field"},
      {category: "sports", value: 13.47, label: "Gym Hall"},
      {category: "office", value: 0.71, label: "Office"}
    ],
    charts: [{
      dimension: "完整 7-location 时长分布",
      unit: "min",
      total: 81.98,
      items: [
        {label: "X3 · Lab Hall", value: 23.29, display: "23.29 min · 9 seq", mapping: "lab"},
        {label: "B1 · Debris Field", value: 23.01, display: "23.01 min · 20 seq", mapping: "industrial"},
        {label: "X2 · Lab Hall", value: 19.00, display: "19.00 min · 6 seq", mapping: "lab"},
        {label: "G1 · Gym Hall", value: 10.24, display: "10.24 min · 8 seq", mapping: "sports"},
        {label: "G2 · Gym Hall", value: 3.23, display: "3.23 min · 4 seq", mapping: "sports"},
        {label: "X1 · Lab Hall", value: 2.50, display: "2.50 min · 6 seq", mapping: "lab"},
        {label: "L1 · Office", value: 0.71, display: "0.71 min · 2 seq", mapping: "office"}
      ]
    }],
    facts: [
      {label: "总序列", value: "55"},
      {label: "总时长", value: "81.98 min"},
      {label: "命名地点", value: "7"}
    ],
    note: "这是官方逐 location 汇总；dataset / code 仍标为分阶段发布，因此属于官方报告值，不是下载后独立复算。",
    sources: [{label: "官方项目页", url: "https://egohtr.github.io/"}]
  },

  "ego-1k": {
    status: "computed",
    availability: "frequency",
    basis: "公开 Parquet 的 source 与 layout 标签",
    scope: "从 490,966 行公开元数据去重得到 956 条 scene_id recording；主分布采用 lab / apartment / unspecified，另列完整 layout 标签。",
    denominator: {value: 956, unit: "recordings", label: "去重 scene_id recordings"},
    normalized: [
      {category: "lab", value: 513, label: "OVD_M1 lab"},
      {category: "home", value: 414, label: "OVD_M2 apartment"},
      {category: "other", value: 29, label: "DD4 unspecified"}
    ],
    charts: [{
      dimension: "完整 layout-tag 分布",
      unit: "recordings",
      total: 956,
      items: [
        {label: "sofa_coffee", value: 325},
        {label: "office_desk", value: 212},
        {label: "dining_table", value: 200},
        {label: "countertop", value: 100},
        {label: "airplane_cabin", value: 18},
        {label: "chair_desk_openoffice", value: 18},
        {label: "counter_windows", value: 18},
        {label: "sofa_open_door", value: 18},
        {label: "sofa_wall", value: 9},
        {label: "backyard_balcony", value: 5},
        {label: "chair_desk_wall", value: 3},
        {label: "no layout tag", value: 30}
      ]
    }],
    facts: [
      {label: "OVD_M1 lab", value: "513 recordings"},
      {label: "OVD_M2 apartment", value: "414 recordings"},
      {label: "DD4 unspecified", value: "29 recordings"},
      {label: "layout labels", value: "12（含 no tag）"}
    ],
    note: "主热力图使用互斥 source 环境，不把可重叠的 wall/window、mirror、paintings 等辅助标签重复计数。",
    sources: [
      {label: "官方数据集", url: "https://huggingface.co/datasets/facebook/ego-1k"},
      {label: "官方论文", url: "https://arxiv.org/abs/2603.13741"}
    ]
  },

  "ego-oscar": {
    status: "unavailable",
    availability: "none",
    basis: "物理 environment taxonomy",
    scope: "官方说明采自印度 100+ environments，但没有发布互斥地点类别、每类 session 或小时汇总。",
    facts: [
      {label: "环境数量", value: "100+"},
      {label: "wearer-camera 时长", value: "≈550 h"},
      {label: "双目 sessions", value: "1,462"}
    ],
    note: "原页面按 action captions 聚合的 cooking、laundry、cleaning 等是活动分布，不是场景分布，已从本模块移除。",
    sources: [
      {label: "官方项目说明", url: "https://www.fpvlabs.ai/essays/ego-oscar"},
      {label: "官方数据卡", url: "https://huggingface.co/datasets/fpvlabs/stereo-550"}
    ]
  },

  "comind": {
    status: "reported",
    availability: "frequency",
    basis: "官方采集范围：55 个真实厨房",
    scope: "全部 80 条协作 cooking recordings 来自厨房；可确定厨房占 100%，但公开 JSON 不能把每条 recording 稳定映射回 55 个 kitchen_id。",
    denominator: {value: 80, unit: "recordings", label: "协作 recordings"},
    normalized: [{category: "kitchen", value: 80, label: "Kitchen"}],
    charts: [{
      dimension: "语义场景构成",
      unit: "recordings",
      total: 80,
      items: [{label: "Kitchen", value: 80, display: "80 recordings · 100%", mapping: "kitchen"}]
    }],
    facts: [
      {label: "物理厨房", value: "55"},
      {label: "recordings", value: "80"},
      {label: "不重复协作时长", value: "40 h 43 min"}
    ],
    note: "100% 表示语义场景都是厨房，不表示 55 个厨房的数据量均衡；逐厨房比例仍不可得。",
    sources: [{label: "官方项目页", url: "https://comind.ethz.ch/"}]
  },

  "egobody": {
    status: "taxonomy",
    availability: "presence",
    basis: "15 个匿名 indoor 3D scenes",
    scope: "官方公开 125 sequences、15 indoor scenes，但无需签约即可访问的资料没有语义场景名或逐 scene 序列数。",
    normalized: [{category: "other", present: true, label: "匿名 indoor scenes"}],
    taxonomyLabel: "已知场景范围",
    taxonomy: ["15 indoor 3D scenes · scene_name 需数据包", "复杂室内双人交互环境"],
    facts: [
      {label: "indoor scenes", value: "15"},
      {label: "sequences", value: "125"},
      {label: "subjects", value: "36"},
      {label: "ego frames", value: "199,111"}
    ],
    note: "公开 README 只描述 scene_name schema；逐 scene 分布需要受许可约束的数据文件。本页不把 Cooperation、Conflict 等社交互动类型当成场景。",
    sources: [
      {label: "官方项目页", url: "https://sanweiliti.github.io/egobody/egobody.html"},
      {label: "官方 README / schema", url: "https://github.com/sanweiliti/EgoBody"}
    ]
  },

  "hoi4d": {
    status: "taxonomy",
    availability: "presence",
    basis: "匿名 room / layout 标识",
    scope: "完整集 4,000 sequences、610 rooms；公开 release paths 中 room 与 layout 只有匿名 ID，没有 kitchen / bedroom / office 语义映射。",
    normalized: [{category: "other", present: true, label: "匿名 indoor rooms"}],
    taxonomyLabel: "可确认的场景范围",
    taxonomy: ["610 anonymous rooms", "room-layout pairs · 匿名编号"],
    facts: [
      {label: "完整集", value: "4,000 sequences"},
      {label: "rooms", value: "610"},
      {label: "公开 released paths", value: "2,971"},
      {label: "公开 room IDs", value: "282"}
    ],
    note: "ToyCar、Knife、Kettle 等是交互物体，不是场景类别，已从场景分布图中移除。",
    sources: [
      {label: "官方项目页", url: "https://hoi4d.github.io/"},
      {label: "官方 release paths", url: "https://raw.githubusercontent.com/leolyliu/HOI4D-Instructions/main/release.txt"}
    ]
  },

  "show3d": {
    status: "taxonomy",
    availability: "presence",
    basis: "官方 indoor / outdoor location 范围",
    scope: "官方说明覆盖 30+ 真实 indoor 与 outdoor locations；公开 Parquet 没有 location_id 或 indoor/outdoor 字段，无法计算比例。",
    normalized: [
      {category: "outdoor", present: true, label: "Outdoor"},
      {category: "other", present: true, label: "Unspecified indoor"}
    ],
    taxonomyLabel: "已确认的场景范围",
    taxonomy: ["30+ real indoor and outdoor locations"],
    facts: [
      {label: "locations", value: "30+"},
      {label: "scenes / recordings", value: "2,137"},
      {label: "公开行复算时长", value: "19.80 h"}
    ],
    note: "object alias 与 action string 不再作为场景代理。没有 location 字段时，只报告 indoor / outdoor 的存在性，不伪造比例。",
    sources: [
      {label: "官方数据卡", url: "https://huggingface.co/datasets/facebook/show3d-dataset"},
      {label: "官方项目页", url: "https://show3d-dataset.github.io/"}
    ]
  },

  "assembly101": {
    status: "reported",
    availability: "frequency",
    basis: "单一受控 assembly workbench",
    scope: "完整数据均在同一类固定多视角桌面装配环境采集；语义场景可记为桌面 / 操作台 100%。",
    denominator: {value: 167, unit: "h", label: "ego video"},
    normalized: [{category: "tabletop", value: 167, label: "Controlled assembly workbench"}],
    charts: [{
      dimension: "语义场景构成",
      unit: "%",
      total: 100,
      items: [{label: "Controlled assembly workbench", value: 100, display: "100% · single capture setup", mapping: "tabletop"}]
    }],
    facts: [
      {label: "ego video", value: "167 h"},
      {label: "capture setup", value: "1 controlled rig"},
      {label: "procedures", value: "362"}
    ],
    note: "原页面的玩具 vehicle categories 是任务对象，不是场景，已移除。100% 只表示场景大类单一，不代表物体、步骤或装配难度单一。",
    sources: [{label: "官方项目页", url: "https://assembly-101.github.io/"}]
  },

  "hd-epic": {
    status: "reported",
    availability: "frequency",
    basis: "真实家庭厨房",
    scope: "全部 41.3 h 视频来自 9 个 home kitchens；可确定厨房占 100%，但公开 annotations 不能复算每个厨房的精确小时。",
    denominator: {value: 41.3, unit: "h", label: "视频时长"},
    normalized: [{category: "kitchen", value: 41.3, label: "Home kitchen"}],
    charts: [{
      dimension: "语义场景构成",
      unit: "%",
      total: 100,
      items: [{label: "Home kitchen", value: 100, display: "100% · 9 kitchens", mapping: "kitchen"}]
    }],
    facts: [
      {label: "home kitchens", value: "9"},
      {label: "video", value: "41.3 h · 156 files"},
      {label: "平均 labeled fixtures", value: "44.9 / kitchen"}
    ],
    note: "recipe 和 fixture 分布属于任务与场景构成，不再替代物理场景分布。100% kitchen 不表示 9 个厨房的数据量均衡。",
    sources: [
      {label: "官方项目页", url: "https://hd-epic.github.io/site/"},
      {label: "官方 annotations", url: "https://github.com/hd-epic/hd-epic-annotations"}
    ]
  },

  "intervla": {
    status: "reported",
    availability: "frequency",
    basis: "单一可重构 MoCap capture space",
    scope: "全部 3.9K sequences 在同一 8.5 × 5.4 m 动捕场地内，通过家具与物体重排形成 100 个 scripts / setups。",
    denominator: {value: 11.4, unit: "h", label: "官方总时长"},
    normalized: [{category: "lab", value: 11.4, label: "MoCap capture space"}],
    charts: [{
      dimension: "物理场景构成",
      unit: "%",
      total: 100,
      items: [{label: "MoCap capture space", value: 100, display: "100% · 1 physical space", mapping: "lab"}]
    }],
    facts: [
      {label: "physical space", value: "8.5 × 5.4 m"},
      {label: "scripts / setups", value: "100"},
      {label: "sequences", value: "3.9K"},
      {label: "官方时长", value: "11.4 h"}
    ],
    note: "100 个 scripts 是同一场地内的布局与交互脚本，不是 100 个独立房间；因此场景大类只有实验室 / 动捕棚。",
    sources: [
      {label: "官方项目页", url: "https://liangxuy.github.io/InterVLA/"},
      {label: "官方论文", url: "https://arxiv.org/html/2508.04681"}
    ]
  },

  "egodex": {
    status: "reported",
    availability: "frequency",
    basis: "官方范围：active tabletop manipulation",
    scope: "官方 README 明确说明 829 h 数据 entirely consists of active tabletop manipulation；未提供更细的房间 / location 字段。",
    denominator: {value: 829, unit: "h", label: "视频时长"},
    normalized: [{category: "tabletop", value: 829, label: "Active tabletop manipulation"}],
    charts: [{
      dimension: "语义场景构成",
      unit: "%",
      total: 100,
      items: [{label: "Active tabletop manipulation", value: 100, display: "100% · 829 h", mapping: "tabletop"}]
    }],
    facts: [
      {label: "总时长", value: "829 h"},
      {label: "episodes", value: "338K"},
      {label: "tasks", value: "194"}
    ],
    note: "Reversible、reset-free、reset 是任务机制，不是场景类别，已从场景图移除。当前只能比较到 tabletop 这一层。",
    sources: [
      {label: "官方仓库 / README", url: "https://github.com/apple/ml-egodex"},
      {label: "官方论文", url: "https://arxiv.org/html/2505.11709"}
    ]
  },

  "open-aoe": {
    status: "reported",
    availability: "proxy",
    basis: "官方随机 100 h audit 的 semantic-scene prevalence",
    scope: "论文只公布四个主类；Other 25.0% 是用 100% 减去四项公布值所得，不能再拆分。",
    denominator: {value: 100, unit: "%", label: "100 h audit prevalence"},
    normalized: [
      {category: "other", value: 25.0, label: "Other combined"},
      {category: "kitchen", value: 24.8, label: "Kitchens"},
      {category: "tabletop", value: 23.3, label: "Tabletop / indoor"},
      {category: "office", value: 17.8, label: "Offices / desks"},
      {category: "bedroom", value: 9.1, label: "Bedrooms"}
    ],
    charts: [{
      dimension: "完整已公开 audit 分布",
      unit: "%",
      total: 100,
      items: [
        {label: "Other combined", value: 25.0, display: "25.0% · 差额合并", mapping: "other"},
        {label: "Kitchens", value: 24.8, display: "24.8%", mapping: "kitchen"},
        {label: "Tabletop / indoor", value: 23.3, display: "23.3%", mapping: "tabletop"},
        {label: "Offices / desks", value: 17.8, display: "17.8%", mapping: "office"},
        {label: "Bedrooms", value: 9.1, display: "9.1%", mapping: "bedroom"}
      ]
    }],
    facts: [
      {label: "audit 子集", value: "100 h"},
      {label: "audit scene labels", value: "135"},
      {label: "当前 HF 已上传", value: "≈694 h（2026-08-12）"}
    ],
    note: "这是 audit prevalence，不是完整 2,000 h 目标集的精确视频时长比例。Other 内含 living room、workshop、bathroom、outdoor、laundry、retail/service，但官方未给子类比例。",
    sources: [
      {label: "官方论文", url: "https://arxiv.org/html/2607.14183"},
      {label: "官方数据卡", url: "https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h"}
    ]
  },

  "humanego": {
    status: "unavailable",
    availability: "none",
    basis: "公开 task directories 中的 location / room 字段",
    scope: "当前公开版本包含 Serve Bread 与 Water Flowers 各 61 条 recording，但 schema 没有 location、room 或 environment 字段。",
    facts: [
      {label: "公开 recordings", value: "122"},
      {label: "公开任务", value: "2"},
      {label: "标称 clip 长度", value: "≈30 s"}
    ],
    note: "任务名称可能暗示厨房或花园，但不能据此确认实际采集地点，更不能计算场景比例；因此本页标记为不可得。",
    sources: [
      {label: "官方数据卡", url: "https://huggingface.co/datasets/Leo-TX/HumanEgo"},
      {label: "官方仓库", url: "https://github.com/TX-Leo/HumanEgo"}
    ]
  },

  "aea": {
    status: "reported",
    availability: "frequency",
    basis: "5 个匿名 indoor locations",
    scope: "官方逐 location 公布 recording 数与四舍五入时长；比例按 143 recordings 计算，但地点没有 kitchen / bedroom 等语义名称。",
    denominator: {value: 143, unit: "recordings", label: "官方 recordings"},
    normalized: [{category: "other", value: 143, label: "Anonymous indoor locations"}],
    charts: [{
      dimension: "完整 5-location 分布",
      unit: "recordings",
      total: 143,
      items: [
        {label: "Location 2", value: 43, display: "43 · 2.3 h", mapping: "other"},
        {label: "Location 3", value: 38, display: "38 · 1.7 h", mapping: "other"},
        {label: "Location 1", value: 29, display: "29 · 1.6 h", mapping: "other"},
        {label: "Location 4", value: 19, display: "19 · 0.6 h", mapping: "other"},
        {label: "Location 5", value: 14, display: "14 · 1.1 h", mapping: "other"}
      ]
    }],
    facts: [
      {label: "recordings", value: "143"},
      {label: "indoor locations", value: "5"},
      {label: "two-user simultaneous", value: "53 recordings"},
      {label: "逐 location 合计", value: "≈7.3 h"}
    ],
    note: "热力图只能标为“其他 / 匿名”；卡片仍完整显示 Location 1–5 的比例。activity scripts 不属于场景分布，已移除。",
    sources: [
      {label: "官方 location 表", url: "https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_everyday_activities_dataset/aea_activities"},
      {label: "官方概览", url: "https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_everyday_activities_dataset"}
    ]
  },

  "egopat3d": {
    status: "computed",
    availability: "frequency",
    basis: "15 个官方命名 household interaction stations",
    scope: "公开目录每个 scene 各 10 recordings；主图保留 15 个原始名称，统一场景族按名称中明确的功能空间映射。",
    denominator: {value: 150, unit: "recordings", label: "公开 recordings"},
    normalized: [
      {category: "kitchen", value: 60, label: "Kitchen stations"},
      {category: "other", value: 40, label: "Other household stations"},
      {category: "bath-laundry", value: 20, label: "Bathroom stations"},
      {category: "bedroom", value: 10, label: "Nightstand"},
      {category: "office", value: 10, label: "Desk"},
      {category: "tabletop", value: 10, label: "Wooden table"}
    ],
    charts: [{
      dimension: "完整 15-scene 分布",
      unit: "recordings",
      total: 150,
      scaleNote: "每项 10 recordings · 6.67%",
      items: [
        {label: "bathroomCabinet", value: 10, display: "10 · 6.67%", mapping: "bath-laundry"},
        {label: "bathroomCounter", value: 10, display: "10 · 6.67%", mapping: "bath-laundry"},
        {label: "bin", value: 10, display: "10 · 6.67%", mapping: "other"},
        {label: "desk", value: 10, display: "10 · 6.67%", mapping: "office"},
        {label: "drawer", value: 10, display: "10 · 6.67%", mapping: "other"},
        {label: "kitchenCounter", value: 10, display: "10 · 6.67%", mapping: "kitchen"},
        {label: "kitchenCupboard", value: 10, display: "10 · 6.67%", mapping: "kitchen"},
        {label: "kitchenSink", value: 10, display: "10 · 6.67%", mapping: "kitchen"},
        {label: "microwave", value: 10, display: "10 · 6.67%", mapping: "kitchen"},
        {label: "nightstand", value: 10, display: "10 · 6.67%", mapping: "bedroom"},
        {label: "pantryshelf", value: 10, display: "10 · 6.67%", mapping: "kitchen"},
        {label: "smallbins", value: 10, display: "10 · 6.67%", mapping: "other"},
        {label: "stovetop", value: 10, display: "10 · 6.67%", mapping: "kitchen"},
        {label: "windowsillAC", value: 10, display: "10 · 6.67%", mapping: "other"},
        {label: "woodenTable", value: 10, display: "10 · 6.67%", mapping: "tabletop"}
      ]
    }],
    facts: [
      {label: "scenes / stations", value: "15"},
      {label: "recordings", value: "150"},
      {label: "hand-object actions", value: "15,000"},
      {label: "总视频", value: "≈600 min"}
    ],
    note: "官方 scene 名更接近交互站位而非完整房间。bin、drawer、smallbins、windowsillAC 无法可靠映射到房间，统一归为“其他 / 匿名”；不根据常识强行指定。",
    sources: [
      {label: "官方仓库与 scene index", url: "https://github.com/ai4ce/EgoPAT3D"},
      {label: "官方项目页", url: "https://ai4ce.github.io/EgoPAT3D/"}
    ]
  }
};
