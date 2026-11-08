import fs from 'node:fs';
const filename=process.argv[2];
if (!filename) throw new Error('Pass the browser reference capture JSON.');
const rendered=JSON.parse(fs.readFileSync(filename));
const source=JSON.parse(fs.readFileSync(new URL('../docs/figma-resolved-button-audit.json',import.meta.url)));
const key=b=>{ const [variant,accent,size,state,inverted]=b.key.split(', '); return `${variant}/${accent}/${size.startsWith('24')?'sm':'md'}/${inverted}/${state}`; };
const rgb=paint=>{if(!paint)return [0,0,0,0];const [hex,alpha]=paint.split('/');return [...[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),Number(alpha)];};
const parse=value=>{const match=value.match(/^rgba?\(([^)]+)\)/);if(!match)throw Error(`Unexpected computed color: ${value}`);const parts=match[1].split(/[, /]+/).map(Number);return parts.length===3?[...parts,1]:parts;};
const equal=(actual,expected)=>parse(actual).every((value,i)=>Math.abs(value-rgb(expected)[i])<0.005);
const failures=[];
let checks=0;
const check=(pass,name)=>{checks++;if(!pass)failures.push(name);};
for(const theme of ['light','dark']){
 const rows=rendered[theme].buttons;
 check(rows.length===source.buttons.length,`${theme}: variant count`);
 for(const button of source.buttons){
  const name=key(button),actual=rows.find(row=>row.key===name),expected=button.colors[theme];
  if(!actual){failures.push(`Missing ${theme}/${name}`);continue;}
  check(equal(actual.background,expected.fill.value),`${theme}/${name}: fill`);
  check(equal(actual.color,expected.text.value),`${theme}/${name}: text`);
  check(Number(actual.opacity)===button.opacity,`${theme}/${name}: opacity`);
  check(actual.height===button.geometry.size.y,`${theme}/${name}: height`);
  check(actual.width===button.geometry.size.x,`${theme}/${name}: width`);
  const colors=actual.shadow.match(/rgba?\([^)]+\)/g)??[];
  const expectedColors=[...(expected.stroke.value?[expected.stroke.value]:[]),...expected.effects.map(effect=>effect.value)];
  check(colors.length===expectedColors.length&&colors.every((value,i)=>equal(value,expectedColors[i])),`${theme}/${name}: stroke/effect colors`);
  const spreads=[...actual.shadow.replace(/rgba?\([^)]+\)/g,'').matchAll(/0px 0px 0px ([\d.]+)px inset/g)].map(match=>Number(match[1]));
  const expectedSpreads=[...(expected.stroke.value?[1]:[]),...expected.effects.map(effect=>effect.spread+1)];
  check(JSON.stringify(spreads)===JSON.stringify(expectedSpreads),`${theme}/${name}: inset geometry`);
  const extras=rendered[`${theme}Extras`]?.buttons.find(row=>row.key===name);
  if(extras){
   check(!!extras.shortcut&&equal(extras.shortcut.color,expected.shortcut.value),`${theme}/${name}: shortcut`);
   check(!!extras.separator&&equal(extras.separator.background,expected.separator.value),`${theme}/${name}: separator`);
  }
 }
}
if (process.argv[3]) {
 const fieldCapture=JSON.parse(fs.readFileSync(process.argv[3]));
 const fieldSource=JSON.parse(fs.readFileSync(new URL('../docs/figma-resolved-field-audit.json',import.meta.url)));
 const flat=node=>[node,...node.children.filter(child=>child.visible).flatMap(flat)];
 for(const theme of ['light','dark']){
  const capture=fieldCapture[theme];
  for(const [name,type,state,small,placeholder] of [
   ['reference-name','input','Default',false,false],['disabled-sm','input','Disabled',true,false],['disabled-md','input','Disabled',false,false],['live-danger','input','Danger',false,false],
   ['reference-note','textarea','Default',false,true],['disabled-textarea','textarea','Disabled',false,false],['danger-textarea','textarea','🔴 Error',false,false]
  ]) {
   const root=fieldSource[type].find(node=>node.name===`State=${state}${type==='input'?`, Size=${small?'Small (24px)':'Default (32px)'}`:''}`);
   const surface=type==='input'?flat(root).find(node=>node.name.includes('Inputs/.Subcomponents/Input')):root.children.find(node=>node.name==='Textarea');
   const text=flat(surface).find(node=>node.type==='TEXT'), actual=capture.fields[name];
   check(equal(actual.surface.fill,surface.colors[theme].fill.value),`${theme}/${name}: surface fill`);
   check(equal(type==='input'?actual.surface.border:actual.surface.shadow,surface.colors[theme].stroke.value),`${theme}/${name}: stroke`);
   check(equal(placeholder?actual.placeholder:actual.text.color,text.colors[theme].fill.value),`${theme}/${name}: text`);
   check(actual.surface.height===surface.size.y,`${theme}/${name}: height`);
   if(type==='input')check(equal(actual.prefix.color,flat(surface).find(node=>node.type==='VECTOR').colors[theme].stroke.value),`${theme}/${name}: prefix`);
  }
  const sourceNode=name=>flat(fieldSource.card).find(node=>node.name===name);
  check(equal(capture.card.shadow,fieldSource.card.colors[theme].stroke.value),`${theme}/card: divider`);
  check(equal(capture.avatar.fill,sourceNode('Icon/Round avatar').colors[theme].fill.value),`${theme}/card: avatar fill`);
  check(equal(capture.avatar.color,sourceNode('L').colors[theme].fill.value),`${theme}/card: avatar text`);
  check(equal(capture.description.color,sourceNode('small card subtitle').colors[theme].fill.value),`${theme}/card: description`);
  check(equal(capture.action.color,flat(fieldSource.card).find(node=>node.type==='VECTOR').colors[theme].stroke.value),`${theme}/card: action`);
  const disabled=fieldSource.actionVariants.find(node=>node.name==='state=disabled, size=24px, color=tertiary');
  check(equal(capture.disabledAction.color,flat(disabled).find(node=>node.type==='VECTOR').colors[theme].stroke.value),`${theme}/card: disabled action`);
 }
}
console.log(JSON.stringify({states:source.buttons.length*2,checks,failures},null,2));
if(failures.length)process.exitCode=1;
