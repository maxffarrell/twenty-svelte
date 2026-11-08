/** Optional audit tool; install the parser outside this package, then pass its entry path.
 * node scripts/audit-figma-export.mjs /path/to/design.fig /path/to/openfig-core/dist/index.js
 * Emits only the five ported components and their resolved styling, not the full file.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
const [snapshotPath, parserPath] = process.argv.slice(2);
if (!snapshotPath || !parserPath) throw new Error('Pass the .fig snapshot and installed openfig-core entry path.');
const { parseFig } = await import(pathToFileURL(parserPath).href);
const snapshot = fs.readFileSync(snapshotPath);
const document = parseFig(new Uint8Array(snapshot));
const nodes = document.nodes;
const id=g=>g?`${g.sessionID}:${g.localID}`:null;
const map=new Map(nodes.map(n=>[id(n.guid),n]));
const children=new Map();for(const n of nodes){const p=id(n.parentIndex?.guid);if(!children.has(p))children.set(p,[]);children.get(p).push(n);}
for(const list of children.values())list.sort((a,b)=>(a.parentIndex?.position??'').localeCompare(b.parentIndex?.position??''));
const modes={light:'80588:0',dark:'80588:1'};
function resolve(data,theme,trail=[]){
 if(!data)return null;
 if(data.dataType==='COLOR')return data.value.colorValue;
 if(data.dataType!=='ALIAS')throw Error(`Unhandled ${data.dataType}`);
 const guid=id(data.value.alias.guid),n=map.get(guid);
 if(!n)throw Error(`Missing variable ${guid}`);
 if(trail.includes(guid))throw Error('Variable cycle');
 const set=map.get(id(n.variableSetID?.guid));
 const mode=id(set.guid)==='80588:123434'?modes[theme]:id(set.variableSetModes[0].id);
 const entry=n.variableDataValues.entries.find(entry=>id(entry.modeID)===mode);
 if(!entry)throw Error(`Missing ${mode} for ${n.name}`);
 return resolve(entry.variableData,theme,[...trail,guid]);
}
const rounded=x=>Math.round(x*10000)/10000;
function paint(p,theme){
 if(!p||p.visible===false)return null;
 const c=p.colorVar?resolve(p.colorVar,theme):{...p.color,a:p.opacity??p.color?.a??1};
 if(!c)throw Error('No color');
 return '#'+[c.r,c.g,c.b].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('')+'/'+rounded(c.a);
}
function paintInfo(p,theme){return {value:paint(p,theme),variable:p?.colorVar?.value?.alias?map.get(id(p.colorVar.value.alias.guid))?.name:null,variableId:id(p?.colorVar?.value?.alias?.guid)};}


const originals=JSON.parse(fs.readFileSync('docs/figma-button-audit.json','utf8'));
const actualVariants=(children.get('170:9512')??[]).filter(node=>node.type==='SYMBOL');
const expectedIds=new Set(originals.rows.map(row=>row[0]));
if(actualVariants.length!==expectedIds.size||actualVariants.some(node=>!expectedIds.has(id(node.guid)))) throw new Error('Source Button variant inventory changed; update the source inventory before generating styles.');
const buttons=originals.rows.map(([key,name])=>{
 const n=map.get(key),cs=children.get(key)??[];
 const text=cs.find(c=>c.type==='TEXT'&&c.name!=='Shortcut');
 const shortcut=cs.find(c=>c.name==='Shortcut'),separator=cs.find(c=>c.name==='Separator');
 if(!text)throw Error('Missing button text '+key);
 const colors=Object.fromEntries(['light','dark'].map(theme=>[theme,{
  fill:paintInfo(n.fillPaints?.[0],theme),stroke:paintInfo(n.strokePaints?.[0],theme),text:paintInfo(text.fillPaints?.[0],theme),
  shortcut:paintInfo(shortcut?.fillPaints?.[0],theme),separator:paintInfo(separator?.fillPaints?.[0],theme),
  effects:(n.effects??[]).filter(e=>e.visible!==false).map(e=>({type:e.type,spread:e.spread,offset:e.offset,radius:e.radius,...paintInfo(e,theme)}))
 }]));
 return {nodeId:key,name:n.name,key:name,geometry:{size:n.size,radius:n.cornerRadius,cornerSmoothing:n.cornerSmoothing},opacity:rounded(n.opacity??1),colors,
 interactions:(n.prototypeInteractions??[]).filter(p=>!p.isDeleted).map(p=>({trigger:p.event.interactionType,actions:p.actions.map(a=>({destination:id(a.transitionNodeID),type:a.transitionType??'INSTANT',durationMs:Math.round((a.transitionDuration??0)*1000),easing:a.easingType??null,curve:a.easingFunction?.map(rounded)}))}))};
});
fs.writeFileSync('docs/figma-resolved-button-audit.json',JSON.stringify({fileKey:'zpykphKQ2es7WjtOvymue6',source:'Local .fig export from authenticated Figma File > Save local copy',sourceSha256:crypto.createHash('sha256').update(snapshot).digest('hex'),sourceFormatVersion:document.header.version,paletteModes:modes,accentMode:'5723:5',buttons},null,2)+'\n');
const pathOf=o=>o.guidPath.guids.map(id);
function expand(original, inherited=[], depth=0, inheritedProps=new Map()){
 if(depth>15)throw Error('Instance depth exceeded');
 let n={...original};
 for(const o of inherited.filter(o=>o.path.length===0))n={...n,...o.value};
 const props=new Map(inheritedProps);
 for(const assignment of n.componentPropAssignments??[]) props.set(id(assignment.defID),assignment.varValue?.value??assignment.value);
 for(const ref of n.componentPropRefs??[]) {
  const value=props.get(id(ref.defID));
  const guid=value?.symbolIdValue?.guid??value?.guidValue;
  if(ref.componentPropNodeField==='OVERRIDDEN_SYMBOL_ID'&&guid) n.symbolData={...n.symbolData,symbolID:guid};
 }
 const base=n.symbolData?map.get(id(n.symbolData.symbolID)):n;
 if(!base)throw Error('Missing symbol '+n.name);
 const merged={...base,...n};
 let overrides=[...(base.symbolData?.symbolOverrides??[]),...(n.symbolData?.symbolOverrides??[])].map(o=>({path:pathOf(o),value:o}));
 for(const o of overrides.filter(o=>o.path.length===1&&o.path[0]===id(base.guid)))Object.assign(merged,o.value);
 overrides=overrides.filter(o=>!(o.path.length===1&&o.path[0]===id(base.guid))).map(o=>o.path[0]===id(base.guid)?{...o,path:o.path.slice(1)}:o);
 overrides.push(...inherited.filter(o=>o.path.length));
 return {node:merged,sourceId:id(original.guid),baseId:id(base.guid),children:(children.get(id(base.guid))??[]).map(child=>expand(child,overrides.filter(o=>o.path[0]===id(child.guid)||o.path[0]===id(child.overrideKey)).map(o=>({...o,path:o.path.slice(1)})),depth+1,props))};
}
function trim(tree){const n=tree.node;return {nodeId:tree.sourceId,baseId:tree.baseId,name:n.name,type:n.type,visible:n.visible!==false,size:n.size,radius:n.cornerRadius,cornerSmoothing:n.cornerSmoothing,opacity:n.opacity??1,font:n.fontName,fontSize:n.fontSize,
 colors:Object.fromEntries(['light','dark'].map(theme=>[theme,{fill:paintInfo(n.fillPaints?.[0],theme),stroke:paintInfo(n.strokePaints?.[0],theme)}])),
 interactions:(n.prototypeInteractions??[]).filter(i=>!i.isDeleted),children:tree.children.map(trim)};}
const input=(children.get('27154:311567')??[]).map(n=>trim(expand(n)));
const textarea=(children.get('93731:320136')??[]).map(n=>trim(expand(n)));
const card=trim(expand(map.get('9214:89505')));
const actionBase=map.get('1458:86003');
const actionVariants=(children.get(id(actionBase.parentIndex.guid))??[]).filter(n=>n.type==='SYMBOL'&&n.name.includes('size=24px')&&n.name.includes('color=tertiary')).map(n=>trim(expand(n)));
fs.writeFileSync('docs/figma-resolved-field-audit.json',JSON.stringify({fileKey:'zpykphKQ2es7WjtOvymue6',source:'Read-only local .fig snapshot; palette Light/Dark and default accent modes',sourceSha256:crypto.createHash('sha256').update(snapshot).digest('hex'),input,textarea,card,actionVariants},null,2)+'\n');
console.log('Audited 180 button variants in both modes, all input/textarea states, and the Big non-clickable card with its action.');
