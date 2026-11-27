// Unofficial Shimeji Simulation fan skin. Original pixel vectors; no manga scans or third-party sprites.
// The input is the unmodified Monkey Civilization simulation summary.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
export function renderTown(state, locale, slot, forcedEvent=null){
  const translations={
    en:{title:"Shimeji Simulation",sub:"West Yomogi · Town diary",places:["After school","Residential street","Behind the school"],characters:["Shijima","Majime"],stats:["Contributions","Active days","Town locations"],events:["A quiet walk home.","A fish swims across the sky.","The hole-digging club is at work.","Rain falls upward.","A mysterious stone starts to glow.","Snow falls out of season.","A cloud takes the shape of a fish.","The streetlight turns on in daylight.","Two shadows walk the wrong way.","A paper plane forgets to land.","The moon comes a little closer.","Majime brings Shijima a book."],credit:"Unofficial fan skin · Characters and setting by Tsukumizu"},
    "zh-CN":{title:"蘑菇的拟态日常",sub:"西蓬镇 · 小镇日记",places:["放学之后","住宅街","校舍后方"],characters:["月岛静寂","山下真面目"],stats:["贡献次数","活跃天数","已开放地点"],events:["一起走在放学路上。","一条鱼从天空游了过去。","挖洞社又开始工作了。","雨滴向天空落去。","路边的神秘石头发出了光。","不合时节的雪下了起来。","一朵云变成了鱼的形状。","路灯在白天亮了起来。","两个人的影子走反了方向。","纸飞机忘记了降落。","月亮又靠近了一点。","真面目给静寂带来一本书。"],credit:"非官方同人皮肤 · 人物与世界设定：つくみず"},
    ja:{title:"シメジ シミュレーション",sub:"西蓬町・町の日記",places:["放課後","住宅街","校舎の裏"],characters:["月島しじま","山下まじめ"],stats:["コントリビューション","活動日数","開放された場所"],events:["二人で帰り道を歩く。","空を魚が泳いでいく。","穴掘り部がまた活動を始めた。","雨粒が空へ落ちていく。","不思議な石が光り始めた。","季節外れの雪が降ってきた。","雲が魚の形になった。","昼なのに街灯がともった。","二人の影が逆の方へ歩いていく。","紙飛行機が降りるのを忘れた。","月が少し近づいてきた。","まじめがしじまに本を持ってきた。"],credit:"非公式ファンスキン・原作：つくみず"}
  };
  if(!translations[locale]) throw Error("Unknown locale");
  const t=translations[locale];
  if(!Number.isSafeInteger(state.contributions)||state.contributions<0||!Number.isSafeInteger(state.activeDays)||state.activeDays<0||!Array.isArray(state.buildings)||typeof state.seed!=="string")throw Error("Invalid upstream simulation summary");
  let hash=2166136261;
  for(const ch of state.seed+"|"+slot){hash=Math.imul(hash^ch.charCodeAt(0),16777619)>>>0}
  let seed=hash; const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  const locations=Math.min(3,Math.max(2,state.buildings.length-1));
  let place=[0,2,1][Math.floor(rnd()*locations)];
  const event=forcedEvent===null?Math.floor(rnd()*t.events.length):forcedEvent;
  if(!Number.isInteger(event)||event<0||event>=t.events.length)throw Error("Invalid event");
  if(event===2)place=2; // school grounds can always be visited for club activity
  const night=rnd()<0.20;
  const c=night?{sky:"#a7b5c5",far:"#a1aaa8",wall:"#b7b8ae",roof:"#656e81",street:"#9d9e9b",green:"#7f9991",ink:"#45505a",window:"#e9d5a0"}:{sky:"#dce5e5",far:"#c2cfca",wall:"#e9e6d9",roof:"#a0a8ac",street:"#c3c4bf",green:"#a9bbb0",ink:"#677178",window:"#c2d2d6"};
  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const rect=(x,y,w,h,fill,extra="")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const path=(d,fill,stroke="none",sw=1)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const line=(x1,y1,x2,y2,color,sw=1)=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${sw}"/>`;
  const label=(x,y,s,size=15,fill="#535d63",extra="")=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;
  const ellipse=(x,y,rx,ry,color)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${color}"/>`;
  function building(x,y,w,h,kind){
    let s=rect(x+4,y+7,w,h,"#78878b","opacity='.14'")+rect(x,y,w,h,c.wall)+rect(x,y,w,7,c.roof);
    if(kind==="house"){s+=path(`M${x-8} ${y+2}L${x+w/2} ${y-33}L${x+w+8} ${y+2}Z`,c.roof,c.ink)+rect(x+w*.68,y+h-31,19,31,"#a49b91")}
    else s+=rect(x-4,y-6,w+8,7,c.roof)+rect(x+8,y-16,38,10,c.wall);
    for(let row=0;row<Math.max(1,Math.floor((h-18)/36));row++)for(let xx=x+12;xx+22<x+w-7;xx+=35){const yy=y+16+row*36;s+=rect(xx,yy,23,19,c.ink)+rect(xx+2,yy+2,19,15,c.window)+line(xx+11,yy+1,xx+11,yy+18,c.ink,.8)}
    return s;
  }
  function tree(x,y,scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})">${rect(-3,-2,6,45,"#92938a")}${path("M-32 10L-32 -9L-23 -9L-23 -24L-9 -24L-9 -33L12 -33L12 -26L27 -26L27 -12L35 -12L35 12L19 12L19 20L-16 20L-16 13Z",c.green)}${rect(-20,-10,17,6,"#bdc9b6")}</g>`}
  function pole(x,y){return `<g>${rect(x,y,5,330-y,c.ink)}${rect(x-19,y+12,44,4,c.ink)}${rect(x-11,y+6,3,11,c.ink)}${rect(x+16,y+6,3,11,c.ink)}</g>`}
  function character(kind,x,y,mirror=false){
    const dark=kind==="shijima", hair=dark?"#373a44":"#c9ac72", hairHi=dark?"#555968":"#e2c999", skin="#f4e5d4", uniform="#697782", ink="#4b4b51";
    let s=rect(7,33,5,8,ink)+rect(16,33,5,8,ink)+rect(7,40,7,3,"#41454b")+rect(16,40,7,3,"#41454b");
    if(dark)s+=path("M3 13H25V31H23V35H4V28H2V17Z",hair);
    s+=path("M7 22H21L26 31H22L23 35H6L7 31H3Z",uniform,ink,.7)+rect(9,22,10,9,"#e3e4dd")+path("M10 22L14 26L18 22L15 30H13Z","#7f8f9f")+path("M8 31H21L24 35H5Z","#525d69");
    s+=path("M5 8H8V5H21V7H25V20H22V23H8V20H4V11Z",hair,ink,.7)+path("M7 11H22V18H20V21H9V18H7Z",skin)+path("M6 8H23V11H20V14H17V11H13V14H10V12H7Z",hair)+rect(8,7,10,2,hairHi);
    s+=rect(10,15,2,2,dark?"#6c92a9":"#a87949")+rect(18,15,2,2,dark?"#6c92a9":"#a87949")+rect(14,19,2,1,"#ad8883");
    if(dark){s+=path("M10 5V0H8V-3H14V0H13V5Z","#dbd4be")+path("M5 -3V-5H8V-7H14V-5H17V-2H5Z","#8c8176")+path("M19 5V1H17V-1H22V1H21V5Z","#dbd4be")+path("M15 -2V-4H18V-6H23V-4H26V-1H15Z","#a29487")+path("M14 5L16 0L18 2","none",hair,1)}
    else{s+=rect(7,14,7,4,"none",'stroke="#ad6664" stroke-width=".8"')+rect(16,14,7,4,"none",'stroke="#ad6664" stroke-width=".8"')+line(14,15,16,15,"#ad6664",.8)+path("M5 3V0H9V-2H19V-1H24V2H27V5H21V6H9V5H5Z","#f8f3e6","#b8b1a3",.6)+rect(13,0,7,4,"#e4b961")}
    return `<g transform="translate(${x} ${y})"><g transform="scale(${mirror?-2.3:2.3} 2.3) translate(${mirror?-28:0} 0)"><g class="bob ${dark?"shijima":"majime"}">${s}</g></g></g>`;
  }
  let sky=rect(0,0,1000,395,c.sky);
  sky+=ellipse(810,83,event===10?57:28,event===10?57:28,night?"#eae4d0":"#eee9d6");
  for(let j=0;j<8;j++){let x=30+j*141+Math.round(rnd()*35),y=70+Math.round(rnd()*45);sky+=`<g opacity=".68">${rect(x,y,70,9,"#f1f2e9")}${rect(x+14,y-7,36,8,"#f1f2e9")}${rect(x+30,y+8,55,6,"#f1f2e9")}</g>`}
  let background=path("M0 206L65 177L124 189L185 154L252 192L328 176L401 207L477 158L535 189L605 171L672 203L744 166L823 187L907 155L1000 194V330H0Z",c.far);
  for(let j=0;j<15;j++){let x=j*72-20,y=198+Math.floor(rnd()*31),w=50+Math.floor(rnd()*22),h=72+Math.floor(rnd()*35);background+=rect(x,y,w,h,"#b4c0bd")+rect(x+5,y+10,7,9,"#a3afae")}
  let street=rect(0,296,1000,99,c.street)+rect(0,296,1000,15,"#e1dfd4")+rect(0,376,1000,19,"#d7d8d0")+line(0,311,1000,311,c.ink,.9);
  for(let x=15;x<1000;x+=100)street+=rect(x,349,44,3,"#e8e6dc");
  let town="";
  if(place===0){town+=building(64,143,290,150,"school")+building(355,184,118,109,"school")+rect(56,286,429,10,c.roof)+rect(102,270,18,23,c.ink)+tree(535,240,1.1)+building(640,208,124,86,"house")+building(808,190,148,104,"house");town+=rect(138,270,110,24,"#c2c9c0")+rect(148,273,90,15,"#e8e7dd")+line(160,281,226,281,c.ink)}
  if(place===1){town+=building(65,207,150,86,"house")+building(238,179,132,114,"house")+tree(430,249)+building(493,199,148,94,"house")+building(706,149,230,144,"school")+rect(688,266,12,28,c.ink);town+=rect(391,265,33,26,"#9baca8")+rect(396,269,22,9,"#e0ddd2")}
  if(place===2){town+=building(45,158,305,128,"school")+tree(398,244,1.05)+tree(920,237,1.2)+rect(454,250,400,43,"#d1d1bc")+rect(454,246,400,5,"#a8afa2");for(let x=462;x<854;x+=22)town+=rect(x,236,3,54,c.ink);town+=ellipse(665,284,65,12,"#8e8a7b")+ellipse(665,284,46,8,"#666a69")+path("M601 280L625 259L649 277L682 266L717 284Z","#b7ac94")}
  town+=pole(32,121)+pole(968,113)+path("M34 134Q505 216 970 126","none",c.ink,1.3)+path("M34 147Q505 223 970 139","none",c.ink,1);
  let extra="", foreground="";
  const fish=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})"><g class="swim">${path("M0 16L14 4H45L58 16L46 28H14Z","#a6b6bd",c.ink)}${path("M0 16L-15 3V29Z","#9aaab3",c.ink)}${path("M25 4L35 -4L42 4Z","#bdc8c9",c.ink)}${rect(43,12,3,3,c.ink)}</g></g>`;
  if(event===1||event===6)extra+=fish(280,92,event===6?2:1.3)+fish(625,121,.75);
  if(event===2)foreground+=path("M701 315L735 284L739 288L710 320Z","#8a918e")+path("M731 282L742 277L748 283L739 293Z","#a2aaa9");
  if(event===3||event===5)for(let j=0;j<58;j++){let x=Math.floor(rnd()*1000),y=35+Math.floor(rnd()*345);extra+=`<g class="${event===3?"rain":"snow"}" style="animation-delay:-${(rnd()*4).toFixed(2)}s">${event===3?line(x,y,x-3,y+10,"#b0c3d1",1.5):rect(x,y,3,3,"#f9f8f2")}</g>`}
  if(event===4)foreground+=`<g class="glow">${ellipse(580,340,33,17,"#ddd9b2")}${path("M561 340L572 323L594 327L600 343L580 349Z","#9d9bb8",c.ink)}</g>`;
  if(event===7)foreground+=rect(924,229,4,89,c.ink)+path("M925 229H900V237H925Z",c.ink)+`<g class="glow">${ellipse(904,238,25,16,"#ebd9a2")}</g>`;
  if(event===8)foreground+=`<g class="drift" opacity=".38">${ellipse(385,370,48,7,c.ink)}${ellipse(470,372,48,7,c.ink)}</g>`;
  if(event===9)extra+=`<g class="swim">${path("M450 109L495 90L480 123L470 110Z","#f7f2e7",c.ink)}${line(470,110,495,90,c.ink,.8)}</g>`;
  if(event===11)foreground+=rect(517,340,18,12,"#ad9698")+rect(519,341,14,9,"#e4e1d4")+line(526,341,526,350,c.ink);
  const people=`${ellipse(411,376,31,6,"#9b9e98")}${ellipse(502,376,31,6,"#9b9e98")}${character("shijima",379,278)}${character("majime",471,278,true)}`;
  const date=slot.slice(0,10);
  const nums=[state.contributions,state.activeDays,locations];
  const stats=t.stats.map((v,i)=>{let x=30+i*325;return `${label(x,480,v,13,"#68757a")}${label(x,511,nums[i].toLocaleString(locale),25,"#48575f",'font-weight="600"')}`}).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 560" width="1000" height="560" role="img" aria-label="${esc(t.title+" — "+t.events[event])}"><title>${esc(t.title)}</title><desc>${esc(t.events[event]+" | "+t.characters.join(" / "))}</desc><style>text{font-family:'Noto Sans CJK SC','Noto Sans CJK JP','Yu Gothic','Microsoft YaHei',system-ui,sans-serif}.bob{animation:bob 2.8s steps(2,end) infinite}.majime{animation-delay:-1.4s}.swim{animation:swim 14s ease-in-out infinite alternate}.rain{animation:rain 3s linear infinite}.snow{animation:snow 5s linear infinite}.glow{animation:glow 2.5s ease-in-out infinite}.drift{animation:drift 3s ease-in-out infinite alternate}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}@keyframes swim{to{transform:translate(105px,-14px)}}@keyframes rain{to{transform:translate(20px,-100px)}}@keyframes snow{to{transform:translate(12px,60px)}}@keyframes glow{50%{opacity:.5}}@keyframes drift{to{transform:translate(-40px,0)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style><defs><clipPath id="frame"><rect width="1000" height="560" rx="12"/></clipPath><clipPath id="scene"><rect width="1000" height="395"/></clipPath></defs><g clip-path="url(#frame)"><g clip-path="url(#scene)" shape-rendering="crispEdges">${sky}${background}${street}${town}${extra}${foreground}${people}</g><rect width="1000" height="66" fill="#f0f0e7" opacity=".94"/>${label(28,30,t.title,23,"#48555d",'font-weight="600"')}${label(29,51,t.sub+" / "+t.places[place],13)}${label(970,31,date,14,"#647176",'text-anchor="end"')}${label(970,51,"@"+state.username,12,"#647176",'text-anchor="end"')}<rect y="395" width="1000" height="165" fill="#f0f0e7"/>${label(30,426,t.events[event],21,"#46565d")}${label(970,426,t.characters.join(" / "),13,"#647176",'text-anchor="end"')}<path d="M30 447H970" stroke="#c2cac6" stroke-dasharray="3 5"/>${stats}${label(30,543,t.credit,11,"#778080")}</g><rect x=".5" y=".5" width="999" height="559" rx="12" fill="none" stroke="#bac4c2"/></svg>`;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const summary=JSON.parse(readFileSync(process.argv[2],'utf8'));
  const out=process.argv[3]||'assets/civilization';
  const now=new Date();
  const slot=process.argv[4]||now.toISOString().slice(0,10)+'T'+String(Math.floor(now.getUTCHours()/6)*6).padStart(2,'0');
  mkdirSync(out,{recursive:true});
  for(const lang of ['en','zh-CN','ja']) writeFileSync(out+'/shimeji-'+lang+'.svg',renderTown(summary,lang,slot)+'\n');
}
