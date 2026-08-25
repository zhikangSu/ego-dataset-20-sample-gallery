# Record-level annotation excerpts

These small files exist only where the displayed media can be tied to an official record and time base.

- `ropedia/stereo_left_20_32.json` is a temporally downsampled 20–32 s excerpt from the matching official `annotation.hdf5` (CC BY-NC 4.0). Dense depth remains at the official source.
- `assembly101/e1_175_185.json` preserves the matching official fine-action frame intervals and clips them to the displayed window (CC BY-NC 4.0).
- `hd-epic/P01_134_153.json` filters the public official annotation repository to the displayed record and time window. Bristol dataset metadata states CC BY 4.0; the upstream annotation repository does not contain a standalone `LICENSE`, so both facts remain visible.
- `comind/21c13149_5_17.json` uses matching official healthcheck data (CC BY 4.0), aligns device timestamps to the bundled clips, and samples hand/gaze/SLAM streams at 5 Hz while preserving transcript word times.

No annotation from another record is presented as ground truth for a displayed sample. Open-AoE and SHOW3D annotations are loaded directly from their official hosts in the browser instead of being copied here.
