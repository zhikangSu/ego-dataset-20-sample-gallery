window.EGO_SCENES = {
  "ropedia": {
    status: "unavailable",
    basis: "物理地点 / 任务频次",
    scope: "公开 sample 只有 1 条 episode；完整 10M interactions 数据需申请访问。",
    facts: [
      {label: "官方规模", value: "10M interactions"},
      {label: "视频时长", value: "10,000 h"},
      {label: "物体规模", value: "350K objects"},
      {label: "公开 sample", value: "1 episode"}
    ],
    note: "官方没有公开可枚举的 location / task 汇总表；单条 sample 不能代表完整集分布，因此不从演示视频主观推断场景比例。",
    sources: [
      {label: "官方完整集卡片", url: "https://huggingface.co/datasets/ropedia-ai/xperience-10m"},
      {label: "官方 sample", url: "https://huggingface.co/datasets/ropedia-ai/xperience-10m-sample"}
    ]
  },

  "ha-ego-1k": {
    status: "reported",
    basis: "官方 semantic group",
    scope: "完整发布表的 22 个任务 / 工作场景组；按录制小时数排序。",
    charts: [{
      dimension: "22 个 semantic groups",
      unit: "h",
      total: 23.93,
      scaleNote: "条长按官方总时长 23.93 h；表内小时因四舍五入合计 23.91 h",
      items: [
        {label: "Laundry · ironing", value: 2.78, display: "2.78 h · 11 clips"},
        {label: "Hair salon", value: 2.36, display: "2.36 h · 13 clips"},
        {label: "Home cleaning", value: 2.00, display: "2.00 h · 30 clips"},
        {label: "Nail salon", value: 1.97, display: "1.97 h · 21 clips"},
        {label: "Warehouse packing", value: 1.85, display: "1.85 h · 32 clips"},
        {label: "Car workshop", value: 1.66, display: "1.66 h · 48 clips"},
        {label: "Shoe washing", value: 1.44, display: "1.44 h · 30 clips"},
        {label: "Construction · tile/panel/tool", value: 1.32, display: "1.32 h · 39 clips"},
        {label: "Laundry · sorting/folding", value: 1.02, display: "1.02 h · 30 clips"},
        {label: "Bottle factory", value: 0.98, display: "0.98 h · 36 clips"},
        {label: "Bar / restaurant", value: 0.90, display: "0.90 h · 20 clips"},
        {label: "Laundry · handwashing", value: 0.85, display: "0.85 h · 29 clips"},
        {label: "Kitchen · cooking/dishes", value: 0.79, display: "0.79 h · 6 clips"},
        {label: "Factory · misc", value: 0.63, display: "0.63 h · 22 clips"},
        {label: "Office · electronics repair", value: 0.61, display: "0.61 h · 16 clips"},
        {label: "Construction · misc", value: 0.55, display: "0.55 h · 22 clips"},
        {label: "Bathroom cleaning", value: 0.45, display: "0.45 h · 12 clips"},
        {label: "Laundry · machines", value: 0.42, display: "0.42 h · 20 clips"},
        {label: "Construction · plastering", value: 0.42, display: "0.42 h · 15 clips"},
        {label: "Laundry · other", value: 0.33, display: "0.33 h · 11 clips"},
        {label: "Appliance repair", value: 0.30, display: "0.30 h · 8 clips"},
        {label: "Nursery / plants", value: 0.28, display: "0.28 h · 13 clips"}
      ]
    }],
    facts: [
      {label: "官方总量", value: "484 clips"},
      {label: "分组数量", value: "22 groups"}
    ],
    note: "这是数据卡公布的任务 / 工作场景组，不是互斥房间类型。目录说明曾写 24 groups，但同页发布表与 484 clips 合计对应 22 groups；本页采用可核对的发布表。",
    sources: [{label: "官方数据卡与分布表", url: "https://huggingface.co/datasets/humanarchive/HA-Ego-1K"}]
  },

  "ace-data-0": {
    status: "reported",
    basis: "任务族 / 采集尺度",
    scope: "官方 Figure 8 的帧级任务族分布；物理环境只有 table-scale 与 room-scale 两类范围说明。",
    charts: [{
      dimension: "任务族（官方图）",
      unit: "M frames",
      total: 17,
      scaleNote: "约 17M frames；百分比为官方图给出的占比",
      items: [
        {label: "Chain of HOI", value: 7.3, display: "7.3M+ · 42.9%"},
        {label: "Atomic HOI", value: 6.2, display: "6.2M+ · 36.5%"},
        {label: "Human–scene interaction", value: 3.5, display: "3.5M+ · 20.6%"}
      ]
    }],
    facts: [
      {label: "table-scale 桌面区", value: "≈30 m²"},
      {label: "room-scale 公寓", value: "≈200 m²"},
      {label: "任务类别", value: "200+"},
      {label: "episodes", value: "75K+"}
    ],
    note: "官方尚未正式发布逐 record 文件，因此可引用任务族占比，但拿不到每个具体任务或每种房间的 episode / 小时分布。",
    sources: [
      {label: "官方项目页", url: "https://ace-data-engine.github.io/ACE-Data-0/"},
      {label: "官方论文", url: "https://arxiv.org/abs/2607.28625"}
    ]
  },

  "ego-exo4d": {
    status: "reported",
    basis: "活动 domain",
    scope: "Ego-Exo4D V2 官方 8 个 domain；柱长按 takes，右侧同时列多视角视频小时与 sites。",
    charts: [{
      dimension: "V2 domain 分布",
      unit: "takes",
      total: 5035,
      items: [
        {label: "Rock climbing", value: 1401, display: "1,401 · 93.90 h · 2 sites"},
        {label: "Basketball", value: 910, display: "910 · 78.01 h · 5 sites"},
        {label: "Dance", value: 728, display: "728 · 106.57 h · 7 sites"},
        {label: "Cooking", value: 678, display: "678 · 564.13 h · 60 sites"},
        {label: "Health", value: 397, display: "397 · 114.50 h · 24 sites"},
        {label: "Bike repair", value: 363, display: "363 · 82.15 h · 8 sites"},
        {label: "Soccer", value: 282, display: "282 · 66.97 h · 14 sites"},
        {label: "Music", value: 276, display: "276 · 180.08 h · 8 sites"}
      ]
    }],
    facts: [
      {label: "V2 多视角视频小时", value: "1,286.30 h"},
      {label: "ego 小时", value: "221.26 h"},
      {label: "独立 sites", value: "123"},
      {label: "城市", value: "13"}
    ],
    note: "participants 与 sites 可能跨 domain 重叠，不能逐行相加；多视角 video-hours 也不等同于真实经过时长。各域两位小数相加为 1,286.31 h，而官方总表写 1,286.30 h，是逐行舍入差。",
    sources: [
      {label: "官方 V2 数据页", url: "https://ego-exo4d-data.org/"},
      {label: "官方文档", url: "https://docs.ego-exo4d-data.org/"}
    ]
  },

  "adt": {
    status: "reported",
    basis: "物理场景类型",
    scope: "原始 ADT 论文发布口径：200 条序列分布于 apartment 与 office。",
    charts: [{
      dimension: "原始发布 scene split",
      unit: "sequences",
      total: 200,
      items: [
        {label: "Apartment", value: 150, display: "150 · 75%"},
        {label: "Office", value: 50, display: "50 · 25%"}
      ]
    }],
    taxonomyLabel: "Apartment 内活动范围",
    taxonomy: ["room decoration", "meal preparation", "work", "object examination", "room cleaning · single-person", "room cleaning · dual-person", "partying", "dining-table cleaning"],
    note: "当前官方文档内部同时出现 236、284+52=336 等不同扩展版数字；为避免混版，本图明确采用原始论文的 150+50=200 发布口径。",
    sources: [
      {label: "原始论文", url: "https://arxiv.org/abs/2306.06362"},
      {label: "当前官方文档", url: "https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_digital_twin_dataset"}
    ]
  },

  "egohtr": {
    status: "reported",
    basis: "物理 location",
    scope: "官方项目页公布的 7 个采集地点；柱长按实际录制分钟。",
    charts: [{
      dimension: "Location 时长",
      unit: "min",
      total: 81.98,
      items: [
        {label: "X3 · Lab Hall", value: 23.29, display: "23.29 min · 9 seq"},
        {label: "B1 · Debris Field", value: 23.01, display: "23.01 min · 20 seq"},
        {label: "X2 · Lab Hall", value: 19.00, display: "19.00 min · 6 seq"},
        {label: "G1 · Gym Hall", value: 10.24, display: "10.24 min · 8 seq"},
        {label: "G2 · Gym Hall", value: 3.23, display: "3.23 min · 4 seq"},
        {label: "X1 · Lab Hall", value: 2.50, display: "2.50 min · 6 seq"},
        {label: "L1 · Office", value: 0.71, display: "0.71 min · 2 seq"}
      ]
    }],
    taxonomyLabel: "官方 action codes",
    taxonomy: ["S · sitting / laying", "St · stairs", "P · parkour", "C · climbing", "F · flips"],
    facts: [
      {label: "总序列", value: "55"},
      {label: "总时长", value: "81.98 min"},
      {label: "总帧数", value: "147.58K"}
    ],
    note: "项目页公开了完整 location 表，但 dataset / code 仍标为 coming soon，因此这里是官方汇总，不是从下载文件独立复算。",
    sources: [{label: "官方项目页", url: "https://egohtr.github.io/"}]
  },

  "ego-1k": {
    status: "computed",
    basis: "record-level scene tags",
    scope: "从官方 490,966 行 Parquet 去重得到 956 条 scene_id recording；layout 标签互斥，lux 为同一批记录的照度段。",
    charts: [
      {
        dimension: "Layout tag",
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
      },
      {
        dimension: "Illuminance bucket",
        unit: "recordings",
        total: 956,
        items: [
          {label: "51–75 lux", value: 18},
          {label: "76–100 lux", value: 49},
          {label: "101–200 lux", value: 351},
          {label: "201–400 lux", value: 282},
          {label: "401–1,000 lux", value: 251},
          {label: "1,001+ lux", value: 5}
        ]
      }
    ],
    facts: [
      {label: "OVD_M1 lab", value: "513 recordings"},
      {label: "OVD_M2 apartment", value: "414 recordings"},
      {label: "DD4 unspecified", value: "29 recordings"}
    ],
    note: "同一 recording 的 wall/window、mirror、paintings 等辅助标签可重叠；主图只使用互斥 layout，避免重复计数。",
    sources: [
      {label: "官方数据集", url: "https://huggingface.co/datasets/facebook/ego-1k"},
      {label: "官方论文", url: "https://arxiv.org/abs/2603.13741"}
    ]
  },

  "ego-oscar": {
    status: "reported",
    basis: "activity family（关键词派生）",
    scope: "官方从自由文本 action captions 近似聚合的 7 个活动族；约 550 h 是每个 wearer camera 的时间口径，同时列 labeled hours 与 primary sessions。",
    charts: [{
      dimension: "Activity family",
      unit: "h",
      total: 550,
      items: [
        {label: "Cooking / food prep", value: 187, display: "187 h · 664 sessions"},
        {label: "Generic manipulation / transitions", value: 106, display: "106 h · 7 sessions"},
        {label: "Dishwashing / kitchen cleanup", value: 90, display: "90 h · 258 sessions"},
        {label: "Textile / craft", value: 54, display: "54 h · 214 sessions"},
        {label: "Laundry / clothing care", value: 45, display: "45 h · 145 sessions"},
        {label: "Organizing / storage", value: 39, display: "39 h · 87 sessions"},
        {label: "Cleaning / housekeeping", value: 29, display: "29 h · 87 sessions"}
      ]
    }],
    facts: [
      {label: "采集范围", value: "India · 100+ environments"},
      {label: "双目 sessions", value: "1,462"},
      {label: "动作时间段", value: "209,315"}
    ],
    note: "活动族由关键词匹配自由文本得到，是近似口径，不是原生互斥 scene GT。labeled hours 会跨所有 session 累计，primary sessions 只统计该活动为主的 session，因此两列不能相除求平均；官方也未发布 100+ environments 各自的类型、session 或时长分布。",
    sources: [
      {label: "官方项目说明", url: "https://www.fpvlabs.ai/essays/ego-oscar"},
      {label: "官方数据卡", url: "https://huggingface.co/datasets/fpvlabs/stereo-550"}
    ]
  },

  "comind": {
    status: "computed",
    basis: "公开 benchmark annotation events",
    scope: "当前公开 v1 consolidated JSON 中 986 个非 null SCOIA events；这不是每个厨房的时长分布。",
    charts: [
      {
        dimension: "SCOIA verbs · top 8 + rest",
        unit: "events",
        total: 986,
        items: [
          {label: "grab", value: 386},
          {label: "receive", value: 131},
          {label: "pass", value: 130},
          {label: "open", value: 82},
          {label: "add", value: 54},
          {label: "place", value: 50},
          {label: "turn on", value: 39},
          {label: "cut", value: 33},
          {label: "other 12 spellings", value: 81, note: "其余 12 个非空 verb spellings 合并；包含极少量公开文件中的拼写变体。"}
        ]
      },
      {
        dimension: "SCOIA L3 objects · top 8 + rest",
        unit: "events",
        total: 986,
        items: [
          {label: "utensil", value: 153},
          {label: "vegetable_or_fruit", value: 115},
          {label: "container_packaging", value: 110},
          {label: "serveware", value: 107},
          {label: "seasoning", value: 102},
          {label: "kitchenware", value: 83},
          {label: "food", value: 74},
          {label: "fixture", value: 61},
          {label: "other 6 L3 classes", value: 181}
        ]
      }
    ],
    facts: [
      {label: "物理厨房", value: "55"},
      {label: "协作 recordings", value: "80"},
      {label: "不重复协作时长", value: "40 h 43 min"},
      {label: "双 wearer-view 时长", value: "81 h 26 min"}
    ],
    note: "公开 JSON 没有稳定 kitchen_id 映射，无法把 80 条 recording 聚合到 55 个厨房；test GT 还有 null / withheld 项，所以 986 是当前可见事件，不是完整小时分布。",
    sources: [
      {label: "官方项目页", url: "https://comind.ethz.ch/"},
      {label: "官方 SCOIA JSON", url: "https://comind.ethz.ch/dataset/annotations/dataset_scoia_consolidated.json"}
    ]
  },

  "egobody": {
    status: "taxonomy",
    basis: "物理 scene + interaction taxonomy",
    scope: "15 个 indoor 3D scenes、125 sequences；官方定义 5 类社交互动，但未公开各类频数。",
    taxonomyLabel: "官方 interaction categories",
    taxonomy: ["Cooperation", "Social exchange", "Conflict", "Conformity", "Others"],
    facts: [
      {label: "indoor 3D scenes", value: "15"},
      {label: "sequences", value: "125"},
      {label: "subjects", value: "36"},
      {label: "ego frames", value: "199,111"}
    ],
    note: "逐 scene 分布可由受许可约束的 data_info_release.csv 复算，但无需签约的公开仓库只描述 schema、不提供 CSV 内容；5 类 interaction 的频数也未发布。",
    sources: [
      {label: "官方项目页", url: "https://sanweiliti.github.io/egobody/egobody.html"},
      {label: "官方 schema", url: "https://github.com/sanweiliti/EgoBody"}
    ]
  },

  "hoi4d": {
    status: "computed",
    basis: "公开 release path metadata",
    scope: "官方 release.txt 的 2,971 条 sequence paths；object class 可命名，room ID 与 layout ID 只有匿名编号。",
    charts: [{
      dimension: "Object category · released subset",
      unit: "sequences",
      total: 2971,
      items: [
        {label: "ToyCar", value: 223},
        {label: "Knife", value: 199},
        {label: "Kettle", value: 199},
        {label: "Lamp", value: 197},
        {label: "Mug", value: 196},
        {label: "TrashCan", value: 196},
        {label: "Bottle", value: 190},
        {label: "Bowl", value: 187},
        {label: "StorageFurniture", value: 187},
        {label: "Pliers", value: 184},
        {label: "Stapler", value: 176},
        {label: "Scissors", value: 172},
        {label: "Bucket", value: 170},
        {label: "Safe", value: 167},
        {label: "Chair", value: 166},
        {label: "Laptop", value: 162}
      ]
    }],
    facts: [
      {label: "官方完整集", value: "4,000 sequences · 610 rooms"},
      {label: "公开 released paths", value: "2,971"},
      {label: "公开 room IDs", value: "282"},
      {label: "room-layout pairs", value: "961"}
    ],
    note: "S* 只是匿名 room ID，没有 kitchen / bedroom / office 的语义映射。官方 test list 也不能与 release list 无损拼成完整 4,000 条命名分布。",
    sources: [
      {label: "官方项目页", url: "https://hoi4d.github.io/"},
      {label: "官方 release.txt", url: "https://raw.githubusercontent.com/leolyliu/HOI4D-Instructions/main/release.txt"},
      {label: "官方 class mapping", url: "https://github.com/leolyliu/HOI4D-Instructions"}
    ]
  },

  "show3d": {
    status: "computed",
    basis: "官方 train/test Parquet 的 scene_id",
    scope: "2,137 scenes；物理地点无公开 ID，因此图表使用可精确解析的 object alias 与 action string。",
    charts: [
      {
        dimension: "Object alias · top 10",
        unit: "scenes",
        total: 2137,
        scaleNote: "Top 10 显示 1,259 / 2,137 scenes；条长按全量计算",
        items: [
          {label: "none", value: 388, display: "388 · 4.397 h"},
          {label: "dumbbell", value: 126, display: "126 · 1.130 h"},
          {label: "dinotoy", value: 107, display: "107 · 0.853 h"},
          {label: "mug", value: 106, display: "106 · 0.870 h"},
          {label: "keyboard", value: 102, display: "102 · 0.812 h"},
          {label: "birdhousetoy", value: 97, display: "97 · 0.791 h"},
          {label: "milk", value: 86, display: "86 · 0.707 h"},
          {label: "canparmesan", value: 83, display: "83 · 0.683 h"},
          {label: "vase", value: 83, display: "83 · 0.685 h"},
          {label: "aria", value: 81, display: "81 · 0.656 h"}
        ]
      },
      {
        dimension: "Action string · top 8",
        unit: "scenes",
        total: 2137,
        scaleNote: "Top 8 显示 685 / 2,137 scenes；条长按全量计算",
        items: [
          {label: "inspecting", value: 195},
          {label: "shaking", value: 113},
          {label: "pretend-opening", value: 73},
          {label: "pick-up-put-down", value: 72},
          {label: "pouring-out", value: 67},
          {label: "washing", value: 61},
          {label: "cleaning-the-outside", value: 53},
          {label: "tapping", value: 51}
        ]
      }
    ],
    facts: [
      {label: "真实 indoor + outdoor locations", value: "30+"},
      {label: "有效行复算时长", value: "19.7999 h"},
      {label: "exact object aliases", value: "28"},
      {label: "exact action strings", value: "173"}
    ],
    note: "公开 Parquet 没有 location_id / indoor-outdoor 字段；28 aliases 也没有到论文 21 个 semantic objects 的官方映射，因此不擅自合并。none 是官方 hand-only / no-object alias。",
    sources: [
      {label: "官方数据卡", url: "https://huggingface.co/datasets/facebook/show3d-dataset"},
      {label: "官方项目页", url: "https://show3d-dataset.github.io/"}
    ]
  },

  "assembly101": {
    status: "reported",
    basis: "procedure / toy category",
    scope: "单一受控桌面 rig；官方论文 Figure 3 的 15 个 vehicle categories。",
    charts: [{
      dimension: "Toy category",
      unit: "recordings",
      total: 362,
      items: [
        {label: "dumper", value: 47, display: "47 rec · 14 toys"},
        {label: "excavator", value: 47, display: "47 rec · 14 toys"},
        {label: "bulldozer", value: 34, display: "34 rec · 13 toys"},
        {label: "roller", value: 28, display: "28 rec · 6 toys"},
        {label: "crane", value: 25, display: "25 rec · 7 toys"},
        {label: "transporter", value: 22, display: "22 rec · 4 toys"},
        {label: "ladder truck", value: 21, display: "21 rec · 6 toys"},
        {label: "cement mixer", value: 20, display: "20 rec · 5 toys"},
        {label: "clamp", value: 18, display: "18 rec · 5 toys"},
        {label: "garbage truck", value: 18, display: "18 rec · 5 toys"},
        {label: "jackhammer", value: 17, display: "17 rec · 4 toys"},
        {label: "SUV", value: 17, display: "17 rec · 4 toys"},
        {label: "car", value: 17, display: "17 rec · 5 toys"},
        {label: "water tanker", value: 16, display: "16 rec · 5 toys"},
        {label: "fire truck", value: 15, display: "15 rec · 4 toys"}
      ]
    }],
    facts: [
      {label: "unique procedures", value: "362"},
      {label: "toy instances", value: "101"},
      {label: "ego video", value: "167 h"},
      {label: "physical environment", value: "1 controlled rig"}
    ],
    note: "玩具类别是任务对象，不是房间类型。当前 annotation CSV 隐藏 train split 的 toy_name，完整分布取自官方图中印出的整数。",
    sources: [
      {label: "官方项目页", url: "https://assembly-101.github.io/"},
      {label: "官方 Figure 3", url: "https://arxiv.org/html/2203.14712v2/img/rec_cat.png"}
    ]
  },

  "hd-epic": {
    status: "computed",
    basis: "home-kitchen 结构 + 公开 recipe annotations",
    scope: "9 个家庭厨房；fixture 为官方均值，recipe captures 从 complete_recipes.json 复算。",
    charts: [
      {
        dimension: "Selected fixture types · average per kitchen",
        unit: "/ kitchen",
        items: [
          {label: "cupboards", value: 11.8},
          {label: "counters / surfaces", value: 11.1},
          {label: "drawers", value: 7.7},
          {label: "appliances", value: 3.3}
        ]
      },
      {
        dimension: "Frequent recipe names + 1-capture examples",
        unit: "captures",
        total: 80,
        scaleNote: "显示 25 / 80 captures；末 3 项是并列 1-capture 长尾示例",
        items: [
          {label: "Coffee", value: 4},
          {label: "Drip Coffee", value: 4},
          {label: "Squash", value: 4},
          {label: "Nespresso", value: 3},
          {label: "Porridge", value: 3},
          {label: "Cappuccino", value: 2},
          {label: "Hibiscus Drink", value: 2},
          {label: "Cacio e Pepe", value: 1},
          {label: "Masala Dosa", value: 1},
          {label: "Sfesiha (Lebanese Meat Pies)", value: 1}
        ]
      }
    ],
    facts: [
      {label: "home kitchens", value: "9"},
      {label: "video", value: "41.3 h · 156 files"},
      {label: "recipes / captures", value: "69 / 80"},
      {label: "平均 labeled fixtures", value: "44.9 / kitchen"}
    ],
    note: "recipe 图可从公开 JSON 复算；fixture 图只列 4 种官方均值，不是全部 44.9 fixtures/kitchen 的完整构成。65 个 exact recipe names 中大量类别并列 1 capture，图末 3 项只是该长尾示例。activity CSV 只有 149/156 个 video IDs，且末段 end_time 常为字面值 end，因此拿不到 9 个厨房各自的精确小时或规范化 activity-family 时长。",
    sources: [
      {label: "官方项目页", url: "https://hd-epic.github.io/site/"},
      {label: "官方 annotations", url: "https://github.com/hd-epic/hd-epic-annotations"}
    ]
  },

  "intervla": {
    status: "taxonomy",
    basis: "scene composition / interaction range",
    scope: "同一 8.5 × 5.4 m MoCap 场地内随机改变家具与物体布局；100 scripts 不是 100 个物理房间。",
    taxonomyLabel: "官方交互范围",
    taxonomy: ["human–human", "human–object", "human–scene", "multi-object", "navigation"],
    facts: [
      {label: "scripts / setups", value: "100"},
      {label: "large-object scripts", value: "41"},
      {label: "small / large object classes", value: "35 / 15"},
      {label: "平均物体 / commands", value: "5 / 8 per script"},
      {label: "sequences", value: "3.9K"},
      {label: "官方时长", value: "11.4 h（Table 1: 11.2 h）"}
    ],
    note: "官方尚未发布 record-level metadata 或完整脚本清单，也未给各交互类型的 sequence / hour 频数；这些数字只描述场景组成。",
    sources: [
      {label: "官方项目页", url: "https://liangxuy.github.io/InterVLA/"},
      {label: "官方论文", url: "https://arxiv.org/html/2508.04681"}
    ]
  },

  "egodex": {
    status: "reported",
    basis: "tabletop task type",
    scope: "官方附录按重置机制统计 194 个任务；不是 episode 数，也不是物理房间分布。",
    charts: [{
      dimension: "Task type",
      unit: "tasks",
      total: 194,
      items: [
        {label: "Reversible", value: 152, display: "152 · 78.35%"},
        {label: "Reset-free", value: 28, display: "28 · 14.43%"},
        {label: "Reset", value: 14, display: "14 · 7.22%"}
      ]
    }],
    taxonomyLabel: "代表任务（无公开频数）",
    taxonomy: ["basic_pick_place", "tie_and_untie_shoelace", "fold_stack_unstack_unfold_cloths", "screw_unscrew_bottle_cap", "insert_remove_plug_socket", "wash_kitchen_dishes", "assemble_disassemble_furniture", "deal_gather_cards", "make_sandwich", "use_chopsticks"],
    facts: [
      {label: "episodes", value: "338K"},
      {label: "总时长", value: "829 h"},
      {label: "环境范围", value: "tabletop only"}
    ],
    note: "没有规范化 location / room 字段；每个 task 的 episode / hour 分布要下载约 2 TB 文件后按目录和媒体时长复算，官方未提供轻量汇总 manifest。",
    sources: [
      {label: "官方仓库", url: "https://github.com/apple/ml-egodex"},
      {label: "官方论文", url: "https://arxiv.org/html/2505.11709"}
    ]
  },

  "open-aoe": {
    status: "reported",
    basis: "semantic scene label",
    scope: "官方论文随机 100-hour audit subset 的 relative prevalence；权重口径未公开，不能解释为确定的视频时长占比。",
    charts: [{
      dimension: "100 h audit scene prevalence",
      unit: "%",
      total: 100,
      scaleNote: "官方 prevalence；Other 25.0% 为四项已公布比例的差额",
      items: [
        {label: "Other combined", value: 25.0, display: "25.0% · 差额合并"},
        {label: "Kitchens", value: 24.8, display: "24.8%"},
        {label: "Tabletop / indoor", value: 23.3, display: "23.3%"},
        {label: "Offices / desks", value: 17.8, display: "17.8%"},
        {label: "Bedrooms", value: 9.1, display: "9.1%"}
      ]
    }],
    facts: [
      {label: "audit scene labels", value: "135"},
      {label: "distinct 自然语言动作描述", value: "32,407"},
      {label: "当前 HF 已上传", value: "≈694 h（2026-08-12）"},
      {label: "目标规模", value: "≈2,000 h"}
    ],
    note: "Other 25.0% 是由四个已公布比例的差额计算，内部含 living room、workshop、bathroom、outdoor、laundry、retail/service，但官方未给子类比例。audit IDs、聚合映射和权重规则也未公开。",
    sources: [
      {label: "官方论文", url: "https://arxiv.org/html/2607.14183"},
      {label: "官方数据卡", url: "https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h"}
    ]
  },

  "humanego": {
    status: "computed",
    basis: "当前公开 task directories",
    scope: "Hugging Face 当前公开版本只包含 2 个任务，各 61 条 recording。",
    charts: [{
      dimension: "Released task",
      unit: "recordings",
      total: 122,
      items: [
        {label: "Serve Bread", value: 61, display: "61 · 50%"},
        {label: "Water Flowers", value: 61, display: "61 · 50%"}
      ]
    }],
    facts: [
      {label: "公开 recordings", value: "122"},
      {label: "标称 clip 长度", value: "≈30 s"}
    ],
    note: "公开 schema 没有 location / room / environment 字段。论文提到的 Downstack Cups、Adjust Table 等评测或展示任务不在当前公开目录计数中，因此未混入分布。",
    sources: [
      {label: "官方数据卡", url: "https://huggingface.co/datasets/Leo-TX/HumanEgo"},
      {label: "固定版本数据卡", url: "https://huggingface.co/datasets/Leo-TX/HumanEgo/blob/f0aa87fade6a41316d65322512f56f066dec62e3/README.md"},
      {label: "官方仓库", url: "https://github.com/TX-Leo/HumanEgo"}
    ]
  },

  "aea": {
    status: "reported",
    basis: "physical location",
    scope: "官方 5 个匿名 indoor locations；主图按 recording 数，右侧列官方四舍五入时长。",
    charts: [{
      dimension: "Location",
      unit: "recordings",
      total: 143,
      items: [
        {label: "Location 2", value: 43, display: "43 · 2.3 h"},
        {label: "Location 3", value: 38, display: "38 · 1.7 h"},
        {label: "Location 1", value: 29, display: "29 · 1.6 h"},
        {label: "Location 4", value: 19, display: "19 · 0.6 h"},
        {label: "Location 5", value: 14, display: "14 · 1.1 h"}
      ]
    }],
    taxonomyLabel: "脚本覆盖的 activity groups（非时长频次）",
    taxonomy: ["making coffee", "prepare snacks", "cooking", "cleaning", "dining", "organization / laundry", "reading / games / exercise", "touring", "multi-person indoor", "indoor–outdoor transition"],
    facts: [
      {label: "recordings", value: "143"},
      {label: "two-user simultaneous recordings", value: "53"},
      {label: "官方逐 location 合计", value: "≈7.3 h"}
    ],
    note: "location 表时长四舍五入后合计 7.3 h，而 overview 写 over 7.5 h；因此柱长采用精确 recording 数。activity 只有 script taxonomy，没有逐帧时间边界。",
    sources: [
      {label: "官方 location / activity 表", url: "https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_everyday_activities_dataset/aea_activities"},
      {label: "官方概览", url: "https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_everyday_activities_dataset"}
    ]
  },

  "egopat3d": {
    status: "reported",
    basis: "named physical household scene",
    scope: "官方处理后数据目录：15 个命名场景完全均衡，各 10 recordings、1,000 hand-object actions。",
    charts: [{
      dimension: "Scene",
      unit: "recordings",
      total: 150,
      items: [
        {label: "bathroomCabinet", value: 10, display: "10 rec · 1,000 actions"},
        {label: "bathroomCounter", value: 10, display: "10 rec · 1,000 actions"},
        {label: "bin", value: 10, display: "10 rec · 1,000 actions"},
        {label: "desk", value: 10, display: "10 rec · 1,000 actions"},
        {label: "drawer", value: 10, display: "10 rec · 1,000 actions"},
        {label: "kitchenCounter", value: 10, display: "10 rec · 1,000 actions"},
        {label: "kitchenCupboard", value: 10, display: "10 rec · 1,000 actions"},
        {label: "kitchenSink", value: 10, display: "10 rec · 1,000 actions"},
        {label: "microwave", value: 10, display: "10 rec · 1,000 actions"},
        {label: "nightstand", value: 10, display: "10 rec · 1,000 actions"},
        {label: "pantryshelf", value: 10, display: "10 rec · 1,000 actions"},
        {label: "smallbins", value: 10, display: "10 rec · 1,000 actions"},
        {label: "stovetop", value: 10, display: "10 rec · 1,000 actions"},
        {label: "windowsillAC", value: 10, display: "10 rec · 1,000 actions"},
        {label: "woodenTable", value: 10, display: "10 rec · 1,000 actions"}
      ]
    }],
    facts: [
      {label: "scenes", value: "15"},
      {label: "recordings", value: "150"},
      {label: "hand-object actions", value: "15,000"},
      {label: "总视频", value: "≈600 min"}
    ],
    note: "场景计数与 action 数可直接复算；官方没有逐 scene 的精确媒体分钟汇总，也没有集中 object-category frequency manifest，因此不按总量均分冒充实测。",
    sources: [
      {label: "官方仓库与 scene index", url: "https://github.com/ai4ce/EgoPAT3D"},
      {label: "官方项目页", url: "https://ai4ce.github.io/EgoPAT3D/"}
    ]
  }
};
