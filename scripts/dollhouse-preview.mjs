import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { heroSvg, diarySvg, defaultCatName } from '../.template-source/src/templates/dollhouse/art.js';
const profile=JSON.parse(readFileSync(process.argv[2],'utf8'));
const opts={speech:'Mathematics, Lean and a little curiosity.',catName:defaultCatName(profile)};
const dir='assets/dollhouse-preview';
mkdirSync(dir,{recursive:true});
for (const theme of ['dark','light']) {
  for(const [name,svg] of Object.entries({hero:heroSvg(profile,theme,opts),diary:diarySvg(profile,theme,opts)})){
    if(!svg.includes('<svg')||!svg.includes('</svg>')||/NaN|undefined|Infinity/.test(svg))throw Error('Invalid '+name+' '+theme);
    writeFileSync(dir+'/'+name+'-'+theme+'.svg',svg);
  }
}
let s=readFileSync('README.zh-CN.md','utf8');
const swap=(oldName,newName,oldLabel,newLabel)=>{
  const marker='./assets/singularity/'+oldName+'-';
  if(s.split(marker).length!==3)throw Error('Unexpected '+oldName+' references');
  s=s.replaceAll(marker,'./'+dir+'/'+newName+'-').replace(oldLabel,newLabel);
};
swap('hero','hero','Singularity — Liangebra','Dollhouse — Liangebra');
swap('telemetry','diary','过去一年的贡献记录','Dollhouse：过去一年的贡献日记');
s=s.replace('<!-- singularity-art -->','<!-- dollhouse-art-preview -->');
s=s.replace('## 研究兴趣','## 书房 · 研究兴趣')
   .replace('## 项目与研究','## 工作室 · 项目与研究')
   .replace('## 开源活动','## 日记 · 开源活动')
   .replace('## 盆景与猫','## 庭院 · 盆景与猫');
s=s.replace('主题来自 README Templates 的 Singularity','预览主题来自 README Templates 的 Dollhouse');
s=s.replaceAll(/<p align="center"><a href="https:\/\/github\.com\/TheMysteriousGhost\/pixel-profile"><img src="\.\/assets\/pixel-profile\/divider\.svg" width="100%" alt=""><\/a><\/p>/g,'---');
s=s.replace(/^<p align="center">[^\n]*<\/p>/,'<p align="center"><a href="./README.zh-CN.md">返回当前主页（Singularity）</a> · <strong>Dollhouse 主题试用</strong></p>');
s=s.replace(/<p align="center"><a href="https:\/\/github\.com\/Liangebra">English<\/a>[^\n]*<\/p>\s*$/,'<p align="center"><a href="./README.zh-CN.md">返回当前主页</a></p>\n');
writeFileSync('README.dollhouse.md',s);
