#!/usr/bin/env node
/** Rebuild per-dataset sample manifests from the gallery catalog and license audit. */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const catalogPath=path.join(root,'data','catalog.js');
const auditPath=path.join(root,'data','license_audit.json');
const outDir=path.join(root,'data','manifests');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(catalogPath,'utf8'),context,{filename:catalogPath});
const catalog=context.window.EGO_GALLERY||[];
const audit=JSON.parse(fs.readFileSync(auditPath,'utf8'));
const audits=new Map((audit.datasets||[]).map(x=>[Number(x.no),x]));

if(catalog.length!==20)throw new Error(`Expected 20 catalog records, found ${catalog.length}`);
fs.mkdirSync(outDir,{recursive:true});
for(const name of fs.readdirSync(outDir))if(name.endsWith('.json'))fs.unlinkSync(path.join(outDir,name));

for(const d of catalog){
  const license=audits.get(Number(d.no));
  if(!license)throw new Error(`Missing license audit for #${d.no} ${d.name}`);
  const manifest={
    schema_version:2,
    index:d.no,
    slug:d.slug,
    dataset:d.name,
    representative_id:d.sampleId,
    summary:d.summary,
    evidence:d.evidence,
    redistribution:d.redistribution,
    official_source:d.source,
    media:(d.media||[]).map(m=>({
      label:m.label,
      kind:m.type,
      local_path:m.local||null,
      official_url:m.remote||null,
      provenance:m.provenance||null,
      source_start_seconds:m.sourceStart??null,
      fps:m.fps??null,
      synchronized_group:m.syncGroup||null,
      overlay:m.overlay||null,
    })),
    annotations:(d.annotations||[]).map(a=>({
      label:a.label,
      status:a.status,
      format:a.format||null,
      local_path:a.path||null,
      official_url:a.source||null,
      viewer:a.viewer||null,
      note:a.note||null,
    })),
    license_audit:license,
    generated_from:['data/catalog.js','data/license_audit.json'],
  };
  fs.writeFileSync(path.join(outDir,`${d.slug}.json`),JSON.stringify(manifest,null,2)+'\n');
}

console.log(`Generated ${catalog.length} manifests in ${path.relative(root,outDir)}`);
