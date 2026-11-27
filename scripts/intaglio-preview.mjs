import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { heroSvg, couponsSvg } from '../.template-source/src/templates/intaglio/art.js';
const profile=JSON.parse(readFileSync(process.argv[2],'utf8'));
const opts={heading:'Research & Open Source',title:'Mathematics and Applied Mathematics',organisation:'',signoff:'See you around'};
const dir='assets/intaglio-preview';
mkdirSync(dir,{recursive:true});
for(const theme of ['dark','light']){
  for(const [name,svg] of Object.entries({hero:heroSvg(profile,theme,opts),coupons:couponsSvg(profile,theme)})){
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
swap('hero','hero','Singularity — Liangebra','Intaglio — Liangebra');
swap('telemetry','coupons','过去一年的贡献记录','Intaglio：过去十二个月的贡献记录');
s=s.replace('<!-- singularity-art -->','<!-- intaglio-art-preview -->');
s=s.replace('主题来自 README Templates 的 Singularity','预览主题来自 README Templates 的 Intaglio');
s=s.replaceAll(/<p align="center"><a href="https:\/\/github\.com\/TheMysteriousGhost\/pixel-profile"><img src="\.\/assets\/pixel-profile\/divider\.svg" width="100%" alt=""><\/a><\/p>/g,'---');
s=s.replace(/^<p align="center">[^\n]*<\/p>/,'<p align="center"><a href="./README.zh-CN.md">返回当前主页（Singularity）</a> · <strong>Intaglio 主题试用</strong></p>');
s=s.replace(/<p align="center"><a href="https:\/\/github\.com\/Liangebra">English<\/a>[^\n]*<\/p>\s*$/,'<p align="center"><a href="./README.zh-CN.md">返回当前主页</a></p>\n');
writeFileSync('README.intaglio.md',s);
