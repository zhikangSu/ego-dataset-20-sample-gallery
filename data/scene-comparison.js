window.EGO_SCENE_TAXONOMY = [
  {id: "home", label: "住宅综合", short: "住宅", color: "#4f7cac"},
  {id: "kitchen", label: "厨房", short: "厨房", color: "#d87942"},
  {id: "living-dining", label: "起居 / 餐厅", short: "起居餐厅", color: "#b88746"},
  {id: "bedroom", label: "卧室", short: "卧室", color: "#8b6fb0"},
  {id: "bath-laundry", label: "卫浴 / 洗衣", short: "卫浴洗衣", color: "#4aa3a2"},
  {id: "office", label: "办公 / 学习", short: "办公学习", color: "#547fbd"},
  {id: "lab", label: "实验室 / 动捕棚", short: "实验室", color: "#6b79a8"},
  {id: "workshop", label: "维修 / 工坊", short: "维修工坊", color: "#9b6a43"},
  {id: "industrial", label: "工厂 / 仓库 / 工地", short: "工业工地", color: "#7f7065"},
  {id: "service", label: "商业 / 服务", short: "商业服务", color: "#c05c7a"},
  {id: "sports", label: "运动 / 健身", short: "运动健身", color: "#4e9b62"},
  {id: "outdoor", label: "户外", short: "户外", color: "#6e9b4b"},
  {id: "transport", label: "交通工具", short: "交通工具", color: "#5e8291"},
  {id: "tabletop", label: "桌面 / 操作台", short: "桌面操作", color: "#bd8b2f"},
  {id: "other", label: "其他 / 匿名", short: "其他匿名", color: "#9aa4a9"}
];

window.EGO_SCENE_METHOD = {
  frequency: {
    label: "场景比例可量化",
    short: "比例可量化",
    description: "官方或公开文件提供场景级时长、recording、sequence、location 数，或明确说明数据全部来自同一语义场景。"
  },
  proxy: {
    label: "代理比例",
    short: "代理比例",
    description: "比例来自官方 audit，或由场景—任务混合标签映射到统一场景类别；可用于理解构成，但不是严格的物理房间真值。"
  },
  presence: {
    label: "只有场景清单",
    short: "只有清单",
    description: "可以确认包含哪些场景或地点范围，但没有足够信息计算各类比例。"
  },
  none: {
    label: "场景信息不可得",
    short: "不可得",
    description: "公开材料没有可核验的场景 taxonomy 或分布；不从演示视频和任务名称主观推断。"
  }
};
