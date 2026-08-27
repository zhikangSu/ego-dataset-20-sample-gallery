# 20 个 Ego 数据集：本地样例与标注观察窗

这是直接嵌入 `report.html` 的本地优先观察窗。它解决原报告直接播放远端大视频时的卡顿，也把“原始媒体、官方可视化、逐帧标注、访问受限”明确区分开。完整报告与独立观察窗共用 `data/catalog.js`，不会维护两套媒体路径。

## 快速开始

```bash
git clone https://github.com/zhikangSu/ego-dataset-20-sample-gallery.git
cd ego-dataset-20-sample-gallery
python3 scripts/serve.py
```

然后打开 <http://localhost:8000/>。这个小型服务器支持视频 byte range，拖动时间轴也不需要重新读完整文件。不要直接双击 `index.html`：浏览器的 `file://` 安全策略会阻止页面内预览 JSON 标注。

仓库内已经包含一组可合法再分发的 CoMind 12 秒 H.264 样例。其他公开样例按许可下载到不会进入 Git 的本地缓存：

```bash
# 查看可下载项及许可提示
python3 scripts/bootstrap_assets.py --list

# 例：下载 SHOW3D 的两路视频和三份 JSON 标注
python3 scripts/bootstrap_assets.py --dataset show3d --accept-source-terms

# 下载脚本支持的全部公开样例（可能较慢）
python3 scripts/bootstrap_assets.py --all --accept-source-terms
```

需要 Python 3.10+ 与 `ffmpeg`：

```bash
# macOS
brew install ffmpeg

# Ubuntu / Debian
sudo apt-get install ffmpeg
```

下载后的短片统一为 H.264、`yuv420p`、无音频、最高 720p，并写入 `assets/local/`。该目录在 `.gitignore` 中；浏览器会自动优先使用这些本地文件。

下载器会校验视频编码、尺寸和 JSON 格式；`--all` 中单项失败时会继续处理其余数据集并在最后汇总。仓库级离线自检：

```bash
python3 scripts/check_repo.py
```

## 标注在哪里看

每个媒体窗下面都有“当前标注”面板。播放器移动时，能绑定到当前 record 和时间基准的字段会自动更新：

- Ropedia：视频与 1.93 GB HDF5 属同一记录，字段覆盖动作、52 点身体、双手 21 点、接触、SLAM、IMU、深度和 calibration；因 CC BY-NC 与公司分享场景，公开页只列官方源，不复制派生摘录。
- CoMind：leader/helper 各自的 MPS 双手、gaze、SLAM 与逐词 transcript；该 test UUID 的 action/object/social benchmark GT 为 withheld，页面不会伪造。
- SHOW3D：视频上的双手 2D overlay，以及下方同步的 hand confidence、3D wrist、object R/t 与 recording caption。
- Assembly101：exact e1 可在官方 validation.csv 反查 fine action；因 CC BY-NC，公开页只列官方源。3D hands 位于约 72 GB 的 pose release。
- HD-EPIC：视频窗口可精确绑定到官方 action、activity、sound、object movement 和 gaze priming 源，但 annotations repo 没有独立 LICENSE；公开仓库只列官方源，不复制派生事件 JSON。
- Open-AoE：MANO validity/wrist/45D pose、camera SE(3) 与 atomic action；官方 action JSON 的 QC 异常会醒目标红。
- HumanEgo：同 recording 的 phase、双手 tracking，以及 Keypoints 视图里的 bread/plate 2D tracks；页面保留两支派生视频的 58 帧偏移和 MPS timestamp QC 说明。
- ADT、EgoHTR、EgoBody、EgoPAT3D 等：官方 overlay 已烧录在图像或视频中，面板逐项解释画面内容。没有 record ID 的媒体只显示 schema/status，不把其他记录的标注强行贴上去。

## 具体场景分布怎么看

`distribution.html` 是独立的 39 项具体场景横向对比页，并嵌入 `report.html`。其中前 20 项与媒体观察窗对应，另补入 19 个大型或重要专项数据集，包括 EgoLive、EgoVerse、Ego4D、Egocentric-10K、EgoSuite-Open100K、Nymeria、EPIC-KITCHENS-100、HoloAssist、EgoLife 和 HOT3D。场景页只回答三个问题：每个数据集包含哪些真实采集场景、每种场景有多少数据 / 占比多少、哪些比例公开拿不到。任务、动作、物体和 interaction target 不再作为场景代理。

页面先把官方原始标签映射到 15 个统一场景族，再提供两层视图：

- 跨数据集热力图：所有数据集共享厨房、住宅、办公室、实验室、维修工坊、工业场地、运动空间、户外、桌面操作等固定轴；
- 逐数据集卡片：显示 100% 场景构成条、完整原始场景清单、数量 / 比例、统计分母、映射说明、缺口和一手来源。

数据可得性分成四档：

- `比例可量化`：有场景级时长、recording、sequence、location 计数，或官方明确说明全部数据来自同一类场景；
- `代理比例`：来自官方 audit，或由场景—任务混合标签映射；
- `只有场景清单`：能确认场景范围，但没有逐类比例；
- `不可得`：不从演示视频、任务名或常识主观推断。

不同数据集的分母仍可能不同，但每个数字旁都会标明是小时、recording、sequence 还是 audit prevalence。全部 39 项的数字与一手来源集中在 `data/scenes.js`；场景页自己的 39 项目录、开放状态与查漏边界集中在 `data/scene-catalog.js`；15 类统一场景轴和可得性定义集中在 `data/scene-comparison.js`。

## 39 项综合比较与 20 个媒体样例的边界

`report.html` 的能力矩阵和详细字段表同样覆盖全部 39 项，不再只比较原来的 20 个媒体 peer。新增 19 项与原 20 项共用规模、视角、同步 / 标定、传感器、人体、物体、场景、许可和九项能力强弱字段，并可按调研批次、开放状态、依据等级和相关度筛选。新增记录集中在 `data/comparison-additions.js`。

媒体观察窗仍保持 20 项：它只回答“是否有可合法展示、可绑定到具体 record 的媒体 / 标注样例”，不代表综合调研只有 20 项。报告现在明确区分三层：185 项去重综合目录、39 项核心横向比较、20 个媒体样例。

185 项综合目录的计算不是 `180 + 19 = 199`：新增调研的 19 项中，EgoLive、EgoVerse、Ego4D、EPIC-KITCHENS-100、HoloAssist、EgoLife、SABER、EgoExoLearn、EgoMAGIC、MECCANO、Ego-EXTRA、Charades-Ego、EgoCom 和 MobileEgo Anywhere 共 14 项已经存在于原仓库目录，只更新字段；Egocentric-10K、EgoSuite-Open100K、Nymeria、HOT3D、EgoBrain 共 5 项是净新增。主题和类型统计由这 185 项动态重算。

## 文件结构

```text
index.html                  本地优先的 20 项观察窗
distribution.html           39 项具体场景分布横向对比页
report.html                 完整调研报告（直接嵌入 local-first 观察窗）
data/catalog.js             页面数据与媒体/标注路径
data/scene-catalog.js       39 项场景调研目录、开放状态与不重复计数边界
data/scenes.js              39 项原始/统一场景分布、口径、缺口与一手来源
data/scene-comparison.js    15 类统一场景 taxonomy 与数据可得性定义
data/comparison-additions.js 新增 19 项的规模、模态、真值、许可和能力矩阵字段
gallery.js                  媒体加载、时间对齐、姿态/语义标注面板
distribution.js             场景热力图、筛选、排序与逐数据集完整分布卡片
data/annotations/           可核验到当前片段的轻量 record-level 摘要
data/license_audit.json     20 项机器可读许可审计
data/manifests/             从 catalog + license audit 生成的 20 份一致性 manifest
assets/datasets/comind/     可随仓库分发的 CC BY 4.0 短样例
assets/local/               本机下载缓存，不进入 Git
scripts/bootstrap_assets.py 许可感知的下载与转码脚本
scripts/generate_manifests.mjs 重新生成 20 份 manifest
scripts/check_repo.py         fresh-clone 离线一致性与 Range 自检
```

## 为什么不把 20 份视频全提交到 GitHub

这不是技术限制，而是许可限制。ACE、Ego-Exo4D、ADT、AEA 等协议限制或禁止再分发；若干数据集需要每位使用者自行接受 gate；CC BY-NC 数据对公司或产品研发也不应默认视为可用。因此仓库只内置 CoMind，其他条目采用官方链接或用户确认条款后的本地缓存。完整结论见 [THIRD_PARTY_ASSETS.md](THIRD_PARTY_ASSETS.md)。

本仓库自身源码与调研文本暂未授予开源许可证。第三方媒体不因出现在本仓库中而改变其原许可。
