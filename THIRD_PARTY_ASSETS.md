# 第三方资产与许可

核验日期：2026-08-25。机器可读版本见 `data/license_audit.json`；每项代表样例的来源、精确 ID 和转码说明见 `data/manifests/`。

## 仓库内置媒体

### CoMind

- 数据集/创作者：CoMind dataset authors, ETH Zürich
- 代表记录：`21c13149-ca54-45dc-94a1-bd74a1c8a27e`
- 来源：[CoMind 官方站](https://comind.ethz.ch/)
- 许可：[Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/)
- 本仓库变更：从官方 leader/helper 示例各截取 12 秒；缩放至 720×720；转为 H.264/yuv420p；移除音频；启用 faststart；另生成配对 contact sheet。
- 文件：`assets/datasets/comind/leader.mp4`、`helper.mp4`、`contact.webp`、`data/annotations/comind/21c13149_5_17.json`

使用这些文件时请保留上述署名、来源、许可链接和变更说明。

## 20 项分发结论

| # | 数据集 | 核验结论 | 仓库策略 |
|---:|---|---|---|
| 1 | Ropedia Xperience-10M | CC BY-NC 4.0（公开 sample）；完整集受控 | 非商业条件下载到本地缓存 |
| 2 | HA-Ego-1K | gated；click-through 条款未公开核验 | 官方入口 |
| 3 | ACE-Data-0 | 研究许可，明确禁止再分发 | 本地下载/官方入口 |
| 4 | Ego-Exo4D | 签署协议，限制再分发 | 本地下载/官方入口 |
| 5 | Aria Digital Twin | 协议禁止分发、衍生分发及公开展示 | 本地查看/官方入口 |
| 6 | EgoHTR | 未找到数据或媒体再分发许可 | 本地缓存/官方入口 |
| 7 | Ego-1K | FAIR Noncommercial Research License | 每位用户在官方站接受条款 |
| 8 | Ego-OSCAR-550h | gated；未核验再分发授权 | 官方入口 |
| 9 | CoMind | CC BY 4.0 | 仓库内置并署名 |
| 10 | EgoBody | 签署研究许可 | 官方入口 |
| 11 | HOI4D | CC BY-NC 4.0 | 非商业用户可自行下载 |
| 12 | SHOW3D | CC BY-NC 4.0 | 非商业条件下载到本地缓存 |
| 13 | Assembly101 | CC BY-NC 4.0 | 非商业条件下载到本地缓存 |
| 14 | HD-EPIC | Bristol dataset metadata 标为 CC BY 4.0；annotations repo 无独立 LICENSE | 官方直连；保留来源与条款说明 |
| 15 | InterVLA | 未找到媒体许可；数据入口不可用 | 官方入口 |
| 16 | EgoDex | CC BY-NC-ND | 不制作/提交修改片段 |
| 17 | Open-AoE | 代码 Apache-2.0；数据许可标为 other | 本地缓存/官方入口 |
| 18 | HumanEgo | CC BY-NC 4.0 + Project Aria 条款 | 非商业条件下载到本地缓存 |
| 19 | Aria Everyday Activities | 协议禁止分发、衍生分发及公开展示 | 官方入口 |
| 20 | EgoPAT3D | 代码 MIT；数据/站点媒体无明确再分发授权 | 本地缓存/官方入口 |

SHOW3D 的手部叠加来自官方 `hand_pose/v2`，本机脚本只保留 `confidence > 0.5` 的 2D landmarks 生成轻量 overlay；原始 JSON、轻量派生文件和转码视频均位于 `.gitignore` 的本地缓存，不随仓库分发。Open-AoE 样例固定到 Hugging Face revision `c363c7866816505c697b9a7ab76341eb2773716b`，避免上游文件变化后媒体与标注错配；其 action JSON 的时序异常也在页面中原样披露。

公开网页可访问不等于允许把媒体复制进 GitHub。若官方条款更新，以最新官方条款为准；发生冲突时，本项目采用更严格的解释。
