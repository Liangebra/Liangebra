import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { heroSvg as sky, telemetrySvg } from '../.template-source/src/templates/singularity/art.js';
import { heroSvg as engraving, couponsSvg, THEMES } from '../.template-source/src/templates/intaglio/art.js';
const profile=JSON.parse(readFileSync(process.argv[2],'utf8'));
if (!profile.contributions?.days?.length) throw Error('Missing actual contribution data');
const dir='assets/atlas-preview';
mkdirSync(dir,{recursive:true});
const opts={heading:'Research & Open Source',title:'Mathematics and Applied Mathematics',organisation:'',signoff:'See you around'};
Object.assign(THEMES.dark,{paper:'#101725',ink:'#dfd0a6',line:'#a9b7d6',muted:'#abb8cb',faint:'#28364c'});
Object.assign(THEMES.light,{paper:'#f7f3e9',ink:'#263c56',line:'#788da4',muted:'#536b81',faint:'#d8e0e7'});
const chapters=[
 ['01','research','RESEARCH','~/research','研究兴趣'],
 ['02','projects','PROJECTS','~/projects','项目与研究'],
 ['03','activity','OBSERVATORY','~/activity','开源活动'],
 ['04','garden','GARDEN','~/garden','盆景与猫']
];
function headerSvg(theme,num,label,path){
 const dark=theme==='dark', bg=dark?'#141c2a':'#f7f3e9', ink=dark?'#dbe4f2':'#263c56', muted=dark?'#a0b0c9':'#536b81', gold=dark?'#d9bd83':'#8d7449', line=dark?'#4c627e':'#a0afbd';
 let orbit='';
 for(let i=0;i<12;i++){orbit+='<ellipse cx="48" cy="40" rx="24" ry="10" transform="rotate('+i*15+' 48 40)" stroke="'+gold+'" stroke-width=".8" fill="none" opacity=".65"/>'}
 let wave='';for(let j=0;j<4;j++){let d='M 620 '+(59+j*2);for(let x=620;x<1160;x+=18)d+=' q9 '+(j%2===0?-8:8)+' 18 0';wave+='<path d="'+d+'" fill="none" stroke="'+line+'" stroke-width=".65" opacity=".6"/>'}
 return '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="80" viewBox="0 0 1200 80" role="img" aria-label="'+label+'"><rect x="1" y="1" width="1198" height="78" rx="7" fill="'+bg+'" stroke="'+line+'"/><path d="M8 9H1192M8 71H1192" stroke="'+line+'" stroke-width=".7"/>'+orbit+'<text x="48" y="45" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="'+ink+'">'+num+'</text><text x="94" y="36" font-family="Georgia,serif" font-size="24" letter-spacing="3" fill="'+ink+'">'+label+'</text><text x="96" y="57" font-family="monospace" font-size="15" fill="'+muted+'">'+path+'</text>'+wave+'<text x="1160" y="35" text-anchor="end" font-family="monospace" font-size="13" fill="'+gold+'">LIANGEBRA / ATLAS</text></svg>';
}
for(const theme of ['dark','light']){
 const panels={hero:sky(profile,theme,{missionName:'Mathematics',signoff:'See you around'}),telemetry:telemetrySvg(profile,theme,{missionName:'Mathematics',signoff:'See you around'}),certificate:engraving(profile,theme,opts),coupons:couponsSvg(profile,theme)};
 for(const [n,key,label,path] of chapters)panels['section-'+key]=headerSvg(theme,n,label,path);
 for(const [name,svg] of Object.entries(panels)){
   if(!svg.includes('<svg')||!svg.includes('</svg>')||/NaN|undefined|Infinity/.test(svg))throw Error('Invalid '+name+' '+theme);
   writeFileSync(dir+'/'+name+'-'+theme+'.svg',svg);
 }
}
const picture=(name,alt)=>'<picture><source media="(prefers-color-scheme: dark)" srcset="./'+dir+'/'+name+'-dark.svg"><img src="./'+dir+'/'+name+'-light.svg" width="100%" alt="'+alt+'"></picture>';
let s=readFileSync('README.zh-CN.md','utf8');
s=s.replaceAll('./assets/singularity/hero-','./'+dir+'/hero-').replaceAll('./assets/singularity/telemetry-','./'+dir+'/telemetry-');
s=s.replaceAll(/<p align="center"><a href="https:\/\/github\.com\/TheMysteriousGhost\/pixel-profile"><img src="\.\/assets\/pixel-profile\/divider\.svg" width="100%" alt=""><\/a><\/p>/g,'');
const sections=s.split(/^## /m);if(sections.length!==5)throw Error('Expected four chapters');
let top=sections.shift().replace(/^<p align="center">[^\n]*<\/p>/,'<p align="center"><a href="./README.zh-CN.md">返回正式主页</a> · <strong>ATLAS / 研究档案 · 组合预览</strong></p>');
function inline(x){
 return x.replace(/\x60([^\x60]+)\x60/g,'<code>$1</code>').replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
}
function htmlBody(x){
 return x.trim().split(/\n\s*\n/).filter(Boolean).map(p=>{
   if(p.startsWith('<!--')||p.startsWith('<'))return p;
   if(p.startsWith('### '))return '<h3>'+inline(p.slice(4))+'</h3>';
   return '<p>'+inline(p)+'</p>';
 }).join('\n');
}
let out=top.trim()+'\n\n<p align="center"><strong>档案索引</strong> · '+chapters.map(([n,key,label,path,zh])=>'<a href="#'+key+'">'+n+' '+zh+'</a>').join(' &nbsp; / &nbsp; ')+'</p>\n';
for(let i=0;i<4;i++){
 const [n,key,label,path,zh]=chapters[i];
 let body=sections[i].slice(sections[i].indexOf('\n')+1).trim();
 if(i===2){
   const block='<p align="center">'+picture('certificate','Intaglio 研究与开源档案')+'</p>\n\n<p align="center">'+picture('coupons','Intaglio 月度贡献票券')+'</p>\n\n<p><sub>星空轨道、雕版纹章与月度票券均使用同一份 GitHub 贡献快照。</sub></p>';
   body=body.replace('<!-- contribution-art -->',block+'\n\n<!-- contribution-art -->');
 }
 if(i===3)body=body.split('<p align="center"><sub>主题来自 README Templates')[0].trim();
 out+='\n<a name="'+key+'"></a>\n\n## '+n+' · '+zh+'\n\n<table width="100%">\n<tr><td width="100%">'+picture('section-'+key,label+' / '+path)+'</td></tr>\n<tr><td width="100%">\n'+htmlBody(body)+'\n</td></tr>\n<tr><td align="right"><sub><a href="#'+key+'">'+path+'</a> · <a href="./README.zh-CN.md">正式主页</a></sub></td></tr>\n</table>\n';
}
out+='\n<p align="center"><sub>星空与雕版艺术来自 <a href="https://github.com/Dr-At0mic/README-Templates">README Templates</a> · Termfolio 与其他组件保留原有署名。</sub></p>\n';
if(out.includes('dsh-agent-teams')||!out.includes('dsh-smart-compact')||!out.includes('vlln/whale-girl/pull/8')||!out.includes('monkey-civilization.svg')||!out.includes('assets/atlas-preview/coupons-dark.svg'))throw Error('Missing content');
writeFileSync('README.atlas.md',out);
