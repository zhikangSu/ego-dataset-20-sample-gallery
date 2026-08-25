window.EGO_GALLERY = [
  {
    no: 1, slug: "ropedia", name: "Ropedia Xperience-10M",
    sampleId: "ropedia-ai/xperience-10m-sample / stereo_left.mp4",
    evidence: "raw", license: "CC BY-NC 4.0", redistribution: "noncommercial-download",
    source: "https://huggingface.co/datasets/ropedia-ai/xperience-10m-sample/tree/main",
    summary: "291 秒六目公开 sample；页面固定查看 20–32 秒，并同步显示同一 HDF5 中的动作、身体/手部 3D、SLAM、IMU、深度与标定摘要。",
    annotationBinding: "exact",
    media: [
      {label:"20–32 秒", type:"video", local:"assets/local/ropedia/preview.mp4", remote:"https://huggingface.co/datasets/ropedia-ai/xperience-10m-sample/resolve/main/stereo_left.mp4", provenance:"exact raw time window", sourceStart:20, clipDuration:12, annotation:{kind:"ropedia",path:"data/annotations/ropedia/stereo_left_20_32.json"}},
      {label:"四帧速览", type:"image", local:"assets/local/ropedia/contact.webp", provenance:"raw frames"}
    ],
    annotations: [
      {label:"20–32 s 同步摘要",status:"derived-excerpt",format:"JSON · 5 Hz",path:"data/annotations/ropedia/stereo_left_20_32.json",viewer:"record-timeline",note:"从同一官方 HDF5 按设备时间抽取；包含动作、52 点身体、双手各 21 点、SLAM、IMU、接触、深度统计与标定。"},
      {label:"annotation.hdf5", status:"not-bundled", format:"HDF5 · 1.93 GB", note:"完整 dense depth 与原频率数据仍保留在官方文件；CC BY-NC 4.0。", source:"https://huggingface.co/datasets/ropedia-ai/xperience-10m-sample/blob/main/annotation.hdf5"}
    ]
  },
  {
    no: 2, slug: "ha-ego-1k", name: "HA-Ego-1K",
    sampleId: "car_workshop/car_door_audio_system_installation_142 / clip03",
    evidence: "locked", license: "CC BY-NC 4.0 + gated terms", redistribution: "external-only",
    source: "https://huggingface.co/datasets/humanarchive/HA-Ego-1K",
    summary: "六路同步视频与 IMU/标定均需先接受 Hugging Face 访问条件；仓库不会绕过 gate。",
    annotationBinding: "gated",
    media: [],
    annotations: [{label:"IMU + metadata + Kalibr",status:"gated",format:"CSV / JSON / YAML",note:"接受官方条款后由用户自行下载。"}]
  },
  {
    no: 3, slug: "ace-data-0", name: "ACE-Data-0",
    sampleId: "Video Example 01 / table-scale household interaction",
    evidence: "raw", license: "Official sample; dataset terms apply", redistribution: "fetch",
    source: "https://ace-data-engine.github.io/ACE-Data-0/#video-examples",
    summary: "同一 25 秒事件的 ego 与八路 GoPro；当前网页样例没有公开 record ID，不能把数据集级 SMPL-X 强绑到这段视频。",
    annotationBinding: "unmapped",
    media: [
      {label:"Ego",type:"video",local:"assets/local/ace-data-0/ego.mp4",remote:"https://ace-data-engine.github.io/ACE-Data-0/assets/videos/example1-rego-front-left.mp4",provenance:"official raw-looking sample",sourceStart:4,clipDuration:12},
      {label:"Exo 0",type:"video",local:"assets/local/ace-data-0/exo0.mp4",remote:"https://ace-data-engine.github.io/ACE-Data-0/assets/videos/example1-gopro-cam0.mp4",provenance:"synchronized official sample",sourceStart:4,clipDuration:12},
      {label:"官方姿态示意",type:"image",remote:"https://ace-data-engine.github.io/ACE-Data-0/assets/images/annotation-smplx-sg.webp",provenance:"official annotation visualization; not proven to be Video Example 01",bakedAnnotations:["SMPL-X","scene graph"]}
    ],
    annotations: [{label:"SMPL-X / hands / objects / tactile",status:"source-only",format:"dataset fields",note:"项目页展示标注 overlay，但未提供该网页样例的独立小型标注文件。"}]
  },
  {
    no: 4, slug: "ego-exo4d", name: "Ego-Exo4D",
    sampleId: "official asset: bike_repair/aria.mp4",
    evidence: "raw", license: "Ego-Exo4D data license", redistribution: "fetch",
    source: "https://ego-exo4d-data.org/",
    summary: "网页公开的 30 秒 Aria + 4 GoPro 自行车维修样例；网页资产未公开 take UID，因此不叠加可能错配的 take 标注。",
    annotationBinding: "unmapped",
    media: [
      {label:"Aria ego",type:"video",local:"assets/local/ego-exo4d/aria.mp4",remote:"https://ego-exo4d-data.org/assets/videos/bike_repair/aria.mp4",provenance:"official site sample",sourceStart:4,clipDuration:12},
      {label:"GoPro 01",type:"video",local:"assets/local/ego-exo4d/cam01.mp4",remote:"https://ego-exo4d-data.org/assets/videos/bike_repair/cam01.mp4",provenance:"synchronized official site sample",sourceStart:4,clipDuration:12}
    ],
    annotations: [{label:"take annotations",status:"gated",format:"JSON / CSV / trajectory",note:"网页样例未映射公开 take UID；不伪造 record-level 标注。"}]
  },
  {
    no: 5, slug: "adt", name: "ADT (Aria Digital Twin)",
    sampleId: "viewer=Apartment_release_multiskeleton_party_seq104 / timeline episode undisclosed",
    evidence: "viz", license: "Project Aria dataset license", redistribution: "fetch",
    source: "https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_digital_twin_dataset/visualizers",
    summary: "官方 Rerun viewer 同时显示 Aria RGB、数字孪生、skeleton、objects 与时间轴；这些标注已烧录在 seq104 viewer 图中。",
    annotationBinding: "baked",
    media: [
      {label:"RGB + 3D",type:"image",local:"assets/local/adt/viewer.png",remote:"https://facebookresearch.github.io/projectaria_tools/assets/images/rerun-adt-8f99fc7ab867aeb74af652b7dc49a61c.png",provenance:"official record-level visualization",bakedAnnotations:["3D skeleton","objects","digital twin","camera trajectory"]},
      {label:"时间窗口",type:"image",local:"assets/local/adt/timeline.png",remote:"https://facebookresearch.github.io/projectaria_tools/assets/images/rerun-adt-time-window-e461b5593e86b60f79aacbdb82a7cd2d.png",provenance:"official visualization",bakedAnnotations:["timeline","RGB","skeleton"]}
    ],
    annotations: [{label:"digital-twin streams",status:"gated",format:"VRS / CSV / JSON",note:"完整 depth、segmentation、boxes、skeleton 与 trajectory 需官方 downloader。"}]
  },
  {
    no: 6, slug: "egohtr", name: "EgoHTR",
    sampleId: "official modality explorer / episode ID not disclosed",
    evidence: "viz", license: "Dataset/code not yet released", redistribution: "fetch",
    source: "https://egohtr.github.io/",
    summary: "官网真实多模态 explorer，展示 ego/exo、SLAM、mesh、point cloud 与 SMPL；标注已烧录在视频中。",
    annotationBinding: "baked",
    media: [
      {label:"多模态",type:"video",local:"assets/local/egohtr/modalities.mp4",remote:"https://egohtr.github.io/assets/explorer_modalities/all.mp4",provenance:"official visualization",sourceStart:2,clipDuration:12,bakedAnnotations:["SMPL body","SLAM","mesh","point cloud","ego/exo alignment"]},
      {label:"contact sheet",type:"image",local:"assets/local/egohtr/contact.webp",provenance:"frames from official visualization",bakedAnnotations:["SMPL body","SLAM","mesh","point cloud","ego/exo alignment"]}
    ],
    annotations: [{label:"body / terrain / SLAM",status:"unreleased",format:"planned dataset",note:"项目页能看 overlay，但当前没有可放入仓库的逐帧标注文件。"}]
  },
  {
    no: 7, slug: "ego-1k", name: "Ego-1K",
    sampleId: "scene=1001040591928025 / frame=000000 / cameras 200-1…12",
    evidence: "raw", license: "FAIR non-commercial research license", redistribution: "noncommercial-download",
    source: "https://huggingface.co/datasets/facebook/ego-1k",
    summary: "官方 shard 中同一时刻的 12 路原始 PNG；许可要求每位使用者自行接受 FAIR 非商业研究协议。",
    annotationBinding: "exact-no-media",
    media: [],
    annotations: [{label:"12-view frame + metadata",status:"source-only",format:"PNG / JSON in tar shard",note:"包含 rig pose 与 per-camera calibration；仓库不替公司用户再分发这些像素。",source:"https://huggingface.co/datasets/facebook/ego-1k"}]
  },
  {
    no: 8, slug: "ego-oscar", name: "Ego-OSCAR-550h",
    sampleId: "stera006_8zlo11pxcsqd (directory example)",
    evidence: "frames", license: "Dataset gated / paper figures", redistribution: "external-only",
    source: "https://huggingface.co/datasets/fpvlabs/stereo-550",
    summary: "session gated；公开页面只有论文实拍网格与校准图，且不能强绑到该 session。",
    annotationBinding: "unmapped",
    media: [
      {label:"任务网格",type:"image",remote:"https://arxiv.org/html/2608.08285v1/images/diversity.png",provenance:"paper figure; not record-bound"},
      {label:"双目校准",type:"image",remote:"https://arxiv.org/html/2608.08285v1/images/Rectified_image.jpg",provenance:"paper figure"}
    ],
    annotations: [{label:"stereo / IMU / 3D hands / captions",status:"gated",format:"MP4 / JSON / CSV",note:"不在 GitHub 重新分发。"}]
  },
  {
    no: 9, slug: "comind", name: "CoMind",
    sampleId: "21c13149-ca54-45dc-94a1-bd74a1c8a27e",
    evidence: "raw", license: "CC BY 4.0", redistribution: "bundled",
    source: "https://comind.ethz.ch/",
    summary: "同一 UUID 的 leader/helper 两路协作烹饪视频；仓库内置 5–17 秒片段，并同步官方 MPS 手、gaze、SLAM 与逐词 transcript。",
    annotationBinding: "exact",
    media: [
      {label:"Leader",type:"video",local:"assets/datasets/comind/leader.mp4",remote:"https://comind.ethz.ch/files/example_videos/generic/21c13149-ca54-45dc-94a1-bd74a1c8a27e_leader.mp4",provenance:"official raw sample",sourceStart:5,clipDuration:12,wearer:"leader",annotation:{kind:"comind",path:"data/annotations/comind/21c13149_5_17.json"}},
      {label:"Helper",type:"video",local:"assets/datasets/comind/helper.mp4",remote:"https://comind.ethz.ch/files/example_videos/generic/21c13149-ca54-45dc-94a1-bd74a1c8a27e_helper.mp4",provenance:"official synchronized raw sample",sourceStart:5,clipDuration:12,wearer:"helper",annotation:{kind:"comind",path:"data/annotations/comind/21c13149_5_17.json"}},
      {label:"配对帧",type:"image",local:"assets/datasets/comind/contact.webp",provenance:"frames from both official videos"}
    ],
    annotations: [
      {label:"5–17 s MPS + transcript",status:"derived-excerpt",format:"JSON · 5 Hz pose/gaze/SLAM",path:"data/annotations/comind/21c13149_5_17.json",viewer:"record-timeline",note:"同 UUID、同 wearer 的官方 healthcheck 文件；按 MP4 description 设备时间精确对齐，逐词 transcript 保留原时间。"},
      {label:"objects / social / action benchmark",status:"not-available",format:"consolidated JSON",note:"该 UUID 属于 test split，官方 benchmark GT 为 null；不把其他帧或其他记录的标签贴到当前片段。"}
    ]
  },
  {
    no: 10, slug: "egobody", name: "EgoBody",
    sampleId: "official teaser / recording_name not disclosed",
    evidence: "frames", license: "Research-use agreement", redistribution: "external-only",
    source: "https://sanweiliti.github.io/egobody/egobody.html",
    summary: "官方同步 teaser 展示 HoloLens ego、Kinect、gaze 与人体 mesh；原始记录需签协议。",
    annotationBinding: "baked-unmapped",
    media: [{label:"同步 teaser",type:"image",remote:"https://sanweiliti.github.io/egobody/images/teaser_v2.jpg",provenance:"official visualization",bakedAnnotations:["SMPL-X body","gaze","scene registration"]}],
    annotations: [{label:"SMPL-X / scene registration",status:"gated",format:"body + scene files",note:"不在 GitHub 重新分发。"}]
  },
  {
    no: 11, slug: "hoi4d", name: "HOI4D",
    sampleId: "ZY20210800004/H4/C3/N68/S380/s05/T2",
    evidence: "frames", license: "Research terms", redistribution: "external-only",
    source: "https://hoi4d.github.io/",
    summary: "ID 对应 Laptop / Open and close display；官方 teaser 未声明来自该 ID。",
    annotationBinding: "unmapped",
    media: [{label:"数据与 GT",type:"image",remote:"https://hoi4d.github.io/teaser.png",provenance:"official overview; not record-bound"}],
    annotations: [{label:"hand/object pose + masks + mesh",status:"gated",format:"JSON / images / point cloud",note:"需接受官方条款后批量下载。"}]
  },
  {
    no: 12, slug: "show3d", name: "SHOW3D",
    sampleId: "YZH016/balandabowl_scooping_0663",
    evidence: "raw", license: "CC BY-NC 4.0", redistribution: "noncommercial-download",
    source: "https://huggingface.co/datasets/facebook/show3d-dataset",
    summary: "同一 scene 的两路 headset 视频；页面直接从官方源加载 hand-pose v2、object R/t 与 caption，并按 60 Hz 同步。",
    annotationBinding: "exact",
    media: [
      {label:"Headset 0 + hands",type:"video",local:"assets/local/show3d/headset0.mp4",remote:"https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/scenes/YZH016/balandabowl_scooping_0663/headset0.mp4",provenance:"official raw clip + official hand-pose v2",sourceStart:3,clipDuration:12,fps:60,overlay:{kind:"show3d-hands",camera:"headset0",paths:["assets/local/show3d/annotations/hand_overlay_compact.json","https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/hand_pose/v2/scenes/YZH016/balandabowl_scooping_0663/hand_pose.json"],width:1024,height:1280},annotation:{kind:"show3d"}},
      {label:"Headset 1 + hands",type:"video",local:"assets/local/show3d/headset1.mp4",remote:"https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/scenes/YZH016/balandabowl_scooping_0663/headset1.mp4",provenance:"official synchronized raw clip + official hand-pose v2",sourceStart:3,clipDuration:12,fps:60,overlay:{kind:"show3d-hands",camera:"headset1",paths:["assets/local/show3d/annotations/hand_overlay_compact.json","https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/hand_pose/v2/scenes/YZH016/balandabowl_scooping_0663/hand_pose.json"],width:1024,height:1280},annotation:{kind:"show3d"}}
    ],
    annotations: [
      {label:"hand_overlay_compact.json",status:"derived-local",format:"JSON · 2D landmarks",path:"assets/local/show3d/annotations/hand_overlay_compact.json",note:"由官方 hand-pose v2 在本机裁出 confidence>0.5 的左右手 2D 点；视频上蓝=左手、红=右手。"},
      {label:"hand_pose_v2.json",status:"fetch",format:"JSON · 1786 frames",path:"assets/local/show3d/annotations/hand_pose_v2.json",source:"https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/hand_pose/v2/scenes/YZH016/balandabowl_scooping_0663/hand_pose.json",note:"使用 v2；v1 存在官方已知的 scale/projection 问题。"},
      {label:"object_pose.json",status:"fetch",format:"JSON · R/t",path:"assets/local/show3d/annotations/object_pose.json",source:"https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/object_pose/v1/scenes/YZH016/balandabowl_scooping_0663/object_pose.json",note:"本样本不含 vertices_world_space；因此不绘制虚假的物体网格/轮廓。"},
      {label:"headset calibrations",status:"fetch",format:"JSON",path:"assets/local/show3d/annotations/headset0_calibration.json",source:"https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/scenes/YZH016/balandabowl_scooping_0663/camera_calibration/headset0.json",note:"用于需要时投影物体中心/坐标轴。"},
      {label:"caption.json",status:"fetch",format:"JSON",path:"assets/local/show3d/annotations/caption.json",source:"https://huggingface.co/datasets/facebook/show3d-dataset/resolve/main/captions/v1/scenes/YZH016/balandabowl_scooping_0663/caption.json"}
    ]
  },
  {
    no: 13, slug: "assembly101", name: "Assembly101",
    sampleId: "nusar-2021_action_both_9031-c04d_9031_user_id_2021-02-04_104130",
    evidence: "raw", license: "CC BY-NC 4.0", redistribution: "noncommercial-download",
    source: "https://assembly-101.github.io/",
    summary: "官网 exact e1 序列的 175–185 秒；页面同步官方 fine action，12-view montage 仍明确标为非同一记录。",
    annotationBinding: "partial",
    media: [
      {label:"Ego e1",type:"video",local:"assets/local/assembly101/e1.mp4",remote:"https://drive.usercontent.google.com/download?id=12gg-hMcLGnPXPVzkvhRyud1nqOzQ2_UG&export=download&confirm=t",provenance:"exact official sample window",sourceStart:175,clipDuration:10,crossOrigin:"anonymous",annotation:{kind:"segments",path:"data/annotations/assembly101/e1_175_185.json"}},
      {label:"12-view",type:"video",local:"assets/local/assembly101/montage.mp4",remote:"https://assembly-101.github.io/assets/12_view_assembly.mp4",provenance:"official overview; not record-bound",sourceStart:5,clipDuration:10,annotationBinding:"unmapped"}
    ],
    annotations: [
      {label:"e1 fine actions",status:"derived-excerpt",format:"JSON · 3 segments",path:"data/annotations/assembly101/e1_175_185.json",viewer:"record-timeline",note:"从官方 validation.csv 的 HMC_21176875(e1) 按 30 fps 裁到 175–185 秒。"},
      {label:"errors / 3D hands",status:"not-bundled",format:"CSV / 72 GB pose archive",note:"3D hands 位于大型受控下载；当前片段未下载。12-view montage 也不是该序列。"}
    ]
  },
  {
    no: 14, slug: "hd-epic", name: "HD-EPIC",
    sampleId: "P01-20240202-110250 / 134–153 s",
    evidence: "raw", license: "CC BY 4.0 (Bristol metadata; annotation repo has no standalone LICENSE)", redistribution: "fetch",
    source: "https://hd-epic.github.io/site/",
    summary: "真实 Nespresso 时间段：页面同步 narration/action、verb/noun/hand、高层活动、声音、物体移动与 gaze priming。",
    annotationBinding: "exact",
    media: [{label:"134–153 秒",type:"video",local:"assets/local/hd-epic/p01_134_153.mp4",remote:"https://data.bris.ac.uk/datasets/3cqb5b81wk2dc2379fx1mrxh47/Videos/P01/P01-20240202-110250.mp4",provenance:"exact raw time window",sourceStart:134,clipDuration:19,annotation:{kind:"hd-epic",path:"data/annotations/hd-epic/P01_134_153.json"}}],
    annotations: [
      {label:"134–153 s 多轨标注",status:"derived-excerpt",format:"JSON",path:"data/annotations/hd-epic/P01_134_153.json",viewer:"record-timeline",source:"https://github.com/hd-epic/hd-epic-annotations",note:"官方记录级标注：12 个 narration/action、2 个 high-level activity、6 个 sound、4 个 object movement 与 8 个 gaze-priming 事件。"},
      {label:"camera pose / dense gaze / masks",status:"source-only",format:"external intermediate data / PNG",source:"https://github.com/hd-epic/hd-epic-annotations",note:"官方另行下载；未把外部大文件复制到本仓库。"}
    ]
  },
  {
    no: 15, slug: "intervla", name: "InterVLA",
    sampleId: "official dataset sample / sequence ID not disclosed",
    evidence: "frames", license: "Paper/project page only", redistribution: "external-only",
    source: "https://liangxuy.github.io/InterVLA/",
    summary: "只有项目页数据图；截至 2026-08-25，所链接数据仓库不可用。",
    annotationBinding: "unmapped",
    media: [{label:"样例帧",type:"image",remote:"https://liangxuy.github.io/InterVLA/static/images/dataset_sample.png",provenance:"official paper/project figure"}],
    annotations: [{label:"instruction + human/object motion",status:"unreleased",format:"described schema",note:"没有可核验的 record-level 文件。"}]
  },
  {
    no: 16, slug: "egodex", name: "EgoDex",
    sampleId: "official montage / task1/0.* is README schema only",
    evidence: "frames", license: "CC BY-NC-ND data terms", redistribution: "external-only",
    source: "https://github.com/apple/ml-egodex",
    summary: "官方真实数据 montage；最小 test archive 约 16 GB，不把 task1/0 强绑到图片。",
    annotationBinding: "unmapped",
    media: [{label:"任务网格",type:"image",remote:"https://arxiv.org/html/2505.11709v1/grid_v4.png",provenance:"official paper figure"}],
    annotations: [{label:"paired HDF5",status:"not-bundled",format:"HDF5 · 68-joint SE(3)",note:"CC BY-NC-ND，仓库不制作或再分发修改版数据片段。"}]
  },
  {
    no: 17, slug: "open-aoe", name: "Open-AoE",
    sampleId: "aoe_20260214_233341_p000",
    evidence: "raw", license: "See dataset card", redistribution: "fetch",
    source: "https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h/tree/c363c7866816505c697b9a7ab76341eb2773716b/aoe_20260214_233341_p000",
    summary: "固定 revision 下同一 sample 的 Raw、手网格、MANO 参数、相机轨迹与 action JSON；页面从官方源按帧读取。动作 JSON 存在显著 QC 异常。",
    annotationBinding: "exact",
    media: [
      {label:"Raw",type:"video",local:"assets/local/open-aoe/raw.mp4",remote:"https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h/resolve/c363c7866816505c697b9a7ab76341eb2773716b/aoe_20260214_233341_p000/raw_video.mp4",provenance:"official raw sample at pinned revision",sourceStart:3,clipDuration:12,fps:30,syncGroup:"open-aoe",annotation:{kind:"open-aoe"}},
      {label:"Hands overlay",type:"video",local:"assets/local/open-aoe/hands.mp4",remote:"https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h/resolve/c363c7866816505c697b9a7ab76341eb2773716b/aoe_20260214_233341_p000/ego_process/ego_hands_reconstruction/visualization/hands_combined.mp4",provenance:"official automatic hand-mesh visualization at pinned revision",sourceStart:3,clipDuration:12,fps:30,syncGroup:"open-aoe",bakedAnnotations:["MANO hand mesh"],annotation:{kind:"open-aoe"}}
    ],
    annotations: [
      {label:"ego_action_annotation.json",status:"remote · QC warning",format:"JSON · 25 segments",path:"assets/local/open-aoe/annotations/ego_action_annotation.json",source:"https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h/resolve/c363c7866816505c697b9a7ab76341eb2773716b/aoe_20260214_233341_p000/ego_annotation/ego_action_annotation.json",viewer:"open-aoe-timeline",note:"前 24 段集中在 0–2.57 s，末段覆盖 2.57–180.997 s；页面标红，不将其当作干净 GT。"},
      {label:"hands.npz + camera_traj.npz",status:"remote exact",format:"MANO / SE(3) · 5430 frames",source:"https://huggingface.co/datasets/inclusionAI/OpenAoE-2000h/tree/c363c7866816505c697b9a7ab76341eb2773716b/aoe_20260214_233341_p000/ego_process/ego_hands_reconstruction",note:"浏览器直接解析官方未压缩 NPZ：双手 validity、wrist translation/rotation、45D pose 与 cam_c2w；不在仓库复制数据。"}
    ]
  },
  {
    no: 18, slug: "humanego", name: "HumanEgo",
    sampleId: "serve_bread/aria/mps_serve_bread_000_vrs",
    evidence: "viz", license: "CC BY-NC 4.0 + Project Aria terms", redistribution: "noncommercial-download",
    source: "https://huggingface.co/datasets/Leo-TX/HumanEgo",
    summary: "同一 Aria VRS recording 的 MPS 与 visual-keypoint 处理视频；姿态已烧录在 Keypoints 视图中。",
    annotationBinding: "baked",
    media: [
      {label:"Aria + MPS",type:"video",local:"assets/local/humanego/aria_vis.mp4",remote:"https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/main/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/vis/aria_vis.mp4",provenance:"official derived visualization",sourceStart:2,clipDuration:12,recordFrameOffset:0,fps:30,bakedAnnotations:["MPS hand landmarks","phase label","RGB processing"],annotation:{kind:"humanego",mode:"aria"}},
      {label:"Keypoints",type:"video",local:"assets/local/humanego/keypoints.mp4",remote:"https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/main/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/vis/visualkpts_vis.mp4",provenance:"official derived visualization",sourceStart:2,clipDuration:12,recordFrameOffset:58,fps:30,bakedAnnotations:["arm/object 2D keypoint tracks","RGB / arm-masked RGB"],annotation:{kind:"humanego",mode:"keypoints"}}
    ],
    annotations: [
      {label:"hand_tracking_results.csv",status:"remote / local exact",format:"CSV · 1002 rows · 155 cols",path:"assets/local/humanego/annotations/hand_tracking_results.csv",source:"https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/hand_tracking/hand_tracking_results.csv",note:"双手 confidence、各 21×3 landmarks、wrist SE(3) 与 palm/wrist normals；页面按当前 recording frame 读取。"},
      {label:"aria_phases_results.json",status:"remote / local exact",format:"JSON · 1002 frames",path:"assets/local/humanego/annotations/aria_phases_results.json",source:"https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/aria_phases_results.json",note:"0=STOP/MANIPULATION、1=FORWARD/NAV、2=ROTATE/NAV、3=TRANSITION、4=FINISHED。"},
      {label:"cotracker_results.json",status:"remote / local exact",format:"JSON · obj1/obj2 · 944 frames",path:"assets/local/humanego/annotations/cotracker_results.json",source:"https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/cotracker_results.json",note:"Keypoints 视图：obj1=bread、obj2=plate，各 20 个 2D track + visibility。"},
      {label:"aria_cam_rgb_config.json",status:"remote / local exact",format:"JSON · RGB calibration",path:"assets/local/humanego/annotations/aria_cam_rgb_config.json",source:"https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/aria_cam_rgb_config.json",note:"同 recording 的 RGB camera configuration。"},
      {label:"kptsselector_results.json",status:"remote / local exact",format:"JSON · 2×20 reference points",path:"assets/local/humanego/annotations/kptsselector_results.json",source:"https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/kptsselector_results.json",note:"bread / plate 各 20 个 reference 2D points。"},
      {label:"camtriangulator_results.json",status:"remote / local exact",format:"JSON · static 3D points / transforms",path:"assets/local/humanego/annotations/camtriangulator_results.json",source:"https://huggingface.co/datasets/Leo-TX/HumanEgo/resolve/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs/preprocess/camtriangulator_results.json",note:"cam0_c2w、每物体 20×3 world/cam0 points 与单个 object_to_cam0_matrix；不是逐帧 object pose。"},
      {label:"VRS + dense point cloud",status:"source-only",format:"VRS / CSV / point cloud",source:"https://huggingface.co/datasets/Leo-TX/HumanEgo/tree/f0aa87fade6a41316d65322512f56f066dec62e3/serve_bread/aria/mps_serve_bread_000_vrs",note:"Keypoints 视图从 recording frame 58 开始；MPS 是官方 row-aligned overlay，存在约 2 帧 timestamp QC 偏差。"}
    ]
  },
  {
    no: 19, slug: "aea", name: "AEA (Aria Everyday Activities)",
    sampleId: "loc5_script4_seq6_rec1 (downloader example)",
    evidence: "viz", license: "Project Aria dataset license", redistribution: "external-only",
    source: "https://facebookresearch.github.io/projectaria_tools/docs/open_datasets/aria_everyday_activities_dataset",
    summary: "官方真实活动/viewer/共享轨迹图；图片未声明属于该 downloader 样例 ID。",
    annotationBinding: "unmapped",
    media: [
      {label:"活动实拍",type:"image",remote:"https://arxiv.org/html/2402.13349v1/figures/images/aria_teaser_updated.png",provenance:"official paper figure"},
      {label:"共享轨迹",type:"image",remote:"https://facebookresearch.github.io/projectaria_tools/assets/images/aea_shared_3d_global_trajectories-b03ad9fb2da530ab71b888f61fa6689c.png",provenance:"official visualization"}
    ],
    annotations: [{label:"VRS / MPS / gaze / audio",status:"gated",format:"VRS / CSV / JSONL",note:"按 Project Aria 下载流程获取。"}]
  },
  {
    no: 20, slug: "egopat3d", name: "EgoPAT3D",
    sampleId: "official sequence asset 1.gif",
    evidence: "raw", license: "See project terms", redistribution: "fetch",
    source: "https://ai4ce.github.io/EgoPAT3D/index.html",
    summary: "官网编号动画展示 RGB-D ego 中的手、目标物与未来 3D trajectory；这些轨迹已烧录在动画中。",
    annotationBinding: "baked",
    media: [{label:"Sequence 1",type:"video",local:"assets/local/egopat3d/sequence1.mp4",remote:"https://ai4ce.github.io/EgoPAT3D/img/gif/1.gif",provenance:"official animated sample",sourceStart:0,clipDuration:12,bakedAnnotations:["future 3D trajectory","hand/object visualization"]}],
    annotations: [{label:"trajectory / scene PLY / hand keypoints",status:"source-only",format:"TXT / PLY",note:"官网动画不附该片段的独立 annotation 文件。"}]
  }
];
