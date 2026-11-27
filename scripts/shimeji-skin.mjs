// Unofficial Shimeji Simulation fan skin. Original pixel vectors; no manga scans or third-party sprites.
// The input is the unmodified Monkey Civilization simulation summary.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {renderPixelTown} from './shimeji-pixel-art.mjs';
export function renderTown(state, locale, slot, forcedEvent=null){
  const translations={
    en:{title:"Shimeji Simulation",sub:"West Yomogi · Town diary",places:["After school","Residential street","Behind the school"],characters:["Shijima","Majime","Big Sis","Sumida","Yomikawa","Mogawa","Gardener","Chito-like neighbor","Yuuri-like neighbor"],stats:["Contributions","Active days","Town locations"],events:["A quiet walk home.","A fish swims across the sky.","The hole-digging club is at work.","Rain falls upward.","A mysterious stone starts to glow.","Snow falls out of season.","A cloud takes the shape of a fish.","The streetlight turns on in daylight.","Two shadows walk the wrong way.","A paper plane forgets to land.","The moon comes a little closer.","Majime brings Shijima a book.","Big Sis tries another experiment.","Sumida writes a message in her sketchbook.","Yomikawa stops to read.","Mogawa checks on the hole-digging club.","The Gardener repairs a crack in the world.","The two neighbors pass by.","Everyone meets at the hole-digging club."],credit:"Unofficial fan skin · Characters and setting by Tsukumizu"},
    "zh-CN":{title:"蘑菇的拟态日常",sub:"西蓬镇 · 小镇日记",places:["放学之后","住宅街","校舍后方"],characters:["月岛静寂","山下真面目","姐姐","墨田","读川","茂川老师","园丁","千户模样的邻居","尤莉模样的邻居"],stats:["贡献次数","活跃天数","已开放地点"],events:["一起走在放学路上。","一条鱼从天空游了过去。","挖洞社又开始工作了。","雨滴向天空落去。","路边的神秘石头发出了光。","不合时节的雪下了起来。","一朵云变成了鱼的形状。","路灯在白天亮了起来。","两个人的影子走反了方向。","纸飞机忘记了降落。","月亮又靠近了一点。","真面目给静寂带来一本书。","姐姐又开始做实验了。","墨田在素描本上写下了一句话。","读川学姐停下来看书。","茂川老师来看挖洞社的活动。","园丁正在修补世界的裂缝。","两位邻居从街上经过。","挖洞社的成员都来了。"],credit:"非官方同人皮肤 · 人物与世界设定：つくみず"},
    ja:{title:"シメジ シミュレーション",sub:"西蓬町・町の日記",places:["放課後","住宅街","校舎の裏"],characters:["月島しじま","山下まじめ","お姉ちゃん","すみだ","よみかわ","もがわ先生","庭師","チトに似たお隣さん","ユーリに似たお隣さん"],stats:["コントリビューション","活動日数","開放された場所"],events:["二人で帰り道を歩く。","空を魚が泳いでいく。","穴掘り部がまた活動を始めた。","雨粒が空へ落ちていく。","不思議な石が光り始めた。","季節外れの雪が降ってきた。","雲が魚の形になった。","昼なのに街灯がともった。","二人の影が逆の方へ歩いていく。","紙飛行機が降りるのを忘れた。","月が少し近づいてきた。","まじめがしじまに本を持ってきた。","お姉ちゃんがまた実験を始めた。","すみだがスケッチブックに一言書いた。","よみかわ先輩が立ち止まって本を読む。","もがわ先生が穴掘り部を見に来た。","庭師が世界のひび割れを直している。","お隣さんの二人が通りかかった。","穴掘り部のみんなが集まった。"],credit:"非公式ファンスキン・原作：つくみず"}
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
  if([2,15,18].includes(event))place=2;
  if([12,17].includes(event)&&locations===3)place=1;
  if([13,14].includes(event))place=0;
  // Event and cast selection is locale-independent.
  const guests={2:["sumida","yomikawa"],12:["sis"],13:["sumida"],14:["yomikawa"],15:["mogawa"],16:["gardener"],17:["chito","yuuri"],18:["sumida","yomikawa","mogawa"]};
  const guestPool=place===1?["sis","chito","yuuri","gardener"]:["sumida","yomikawa","mogawa","gardener"];
  const present=guests[event]|| ([0,11].includes(event)?[]:[guestPool[Math.floor(rnd()*guestPool.length)]]);
  const charIndex={sis:2,sumida:3,yomikawa:4,mogawa:5,gardener:6,chito:7,yuuri:8};
  const castNames=[...t.characters.slice(0,2),...present.map(k=>t.characters[charIndex[k]])];
  return renderPixelTown({state,t,locale,slot,event,place,locations,present,castNames});
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const summary=JSON.parse(readFileSync(process.argv[2],'utf8'));
  const out=process.argv[3]||'assets/civilization';
  const now=new Date();
  const slot=process.argv[4]||now.toISOString().slice(0,10)+'T'+String(Math.floor(now.getUTCHours()/6)*6).padStart(2,'0');
  mkdirSync(out,{recursive:true});
  for(const lang of ['en','zh-CN','ja']) writeFileSync(out+'/shimeji-'+lang+'.svg',renderTown(summary,lang,slot)+'\n');
}
