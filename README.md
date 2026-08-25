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

- Ropedia：动作/子任务/物体、52 点身体、双手 21 点、接触、SLAM、IMU、深度和 3D 点投影。
- CoMind：leader/helper 各自的 MPS 双手、gaze、SLAM 与逐词 transcript；该 test UUID 的 action/object/social benchmark GT 为 withheld，页面不会伪造。
- SHOW3D：视频上的双手 2D overlay，以及下方同步的 hand confidence、3D wrist、object R/t 与 recording caption。
- Assembly101：exact e1 的 fine action 区间；3D hands 在约 72 GB 的 pose release 中，未下载时明确注明。
- HD-EPIC：action、verb/noun/hand、高层活动、声音、物体移动和 gaze priming 多轨时间轴。
- Open-AoE：MANO validity/wrist/45D pose、camera SE(3) 与 atomic action；官方 action JSON 的 QC 异常会醒目标红。
- HumanEgo：同 recording 的 phase、双手 tracking，以及 Keypoints 视图里的 bread/plate 2D tracks；页面保留两支派生视频的 58 帧偏移和 MPS timestamp QC 说明。
- ADT、EgoHTR、EgoBody、EgoPAT3D 等：官方 overlay 已烧录在图像或视频中，面板逐项解释画面内容。没有 record ID 的媒体只显示 schema/status，不把其他记录的标注强行贴上去。

## 文件结构

```text
index.html                  本地优先的 20 项观察窗
report.html                 完整调研报告（直接嵌入 local-first 观察窗）
data/catalog.js             页面数据与媒体/标注路径
gallery.js                  媒体加载、时间对齐、姿态/语义标注面板
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
