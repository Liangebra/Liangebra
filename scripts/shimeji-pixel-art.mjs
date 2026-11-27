// Unofficial fan skin. Original Monkey Civilization landscape and art helpers
// are imported from a pinned Apache-2.0 upstream checkout; new art is drawn here.
// The original code is at https://github.com/jihoo12/monkeys.
import { paletteFor, shade } from '../.monkeys-source/src/render/palette.ts';
import { rect, ellipse, circle, escapeXml } from '../.monkeys-source/src/render/svg.ts';
import { pixelWindow, pixelDoor, brickPattern, shingleRoof, lampPost, tree, bush, pottedPlant, groundShadow, smallFence, crate, grassTuft, flowers, rockCluster, antenna } from '../.monkeys-source/src/render/art.ts';
import { createRng } from '../.monkeys-source/src/util/rng.ts';
import { renderSkyBands, renderSun, renderClouds, renderBirds, renderMountains, renderTreeLine, renderBackdrop, renderGround, renderForeground, renderStars, renderMoon, renderFireflies, renderLights } from '../.monkeys-source/src/render/scene.ts';
import { BASE_CSS } from '../.monkeys-source/src/render/render.ts';
export function renderPixelTown({state,t,locale,slot,event,place,locations,present,castNames}) {
  const p={...paletteFor({id:'modern'}),skyTop:'#73a9ce',skyBottom:'#d5e6df',haze:'#d0e0d8',grass:'#79ab7c',grassDark:'#4f815f',grassLight:'#b0ce91',roof:'#7b859c',roofDark:'#4d576d',plaster:'#e3d9c7',plasterShade:'#b8b4b4',accent:'#e3b873',accent2:'#8dc3ba',hudAccent:'#ebca89',hudAccent2:'#a8d2ca',hudBorder:'#7f9ea5',hudPanel:'#223342',hudPanelLight:'#314657',hudBg:'#15242f',hudInset:'#182934',hudText:'#f0eee3',hudDim:'#b0bfcb',nightOpacity:.63};
  const rng=createRng('shimeji-art:'+state.seed+':'+slot), visual={age:{id:'modern'}};
  const title=(v)=>escapeXml(String(v));
  const text=(x,y,v,size=13,color=p.hudText,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${title(v)}</text>`;
  const group=(x,y,body)=>`<g transform="translate(${x} ${y})">${body}</g>`;
  const R=(x,y,w,h,c,e='')=>rect(x,y,w,h,c,e);
  const lights=[];
  function school(x,base,w=200){
    const h=108, wx=x-w/2;
    let a=groundShadow(x,base,w*.85,p);
    a+=R(wx-3,base-h-4,w+6,h+4,p.outline)+R(wx,base-h,w,h,p.plasterShade)+R(wx+3,base-h+2,w-7,h-5,p.plaster);
    a+=R(wx,base-h-5,w,6,p.roofDark)+R(wx+2,base-h-7,w-4,3,p.roof)+R(wx+5,base-h+33,w-10,3,p.stoneDark)+R(wx+5,base-h+67,w-10,3,p.stoneDark);
    for(let i=0;i<3;i++)for(let xx=wx+12;xx<wx+w-25;xx+=25){
      a+=pixelWindow(xx,base-h+12+i*32,16,13,p,{lit:(i+xx)%3!==0,sill:true,cross:true});
      if(i===0)lights.push({x:xx+8,y:base-h+17,radius:20,color:p.windowGlow});
    }
    a+=R(x-18,base-34,36,34,p.plasterShade)+pixelDoor(x-11,base-28,22,27,p,p.woodDark)+R(x-23,base-3,46,3,p.stoneDark)+R(x-25,base-4,50,2,p.stoneLight);
    a+=R(x-18,base-h-32,36,25,p.plasterShade)+R(x-15,base-h-29,30,23,p.plaster)+R(x-20,base-h-35,40,5,p.roofDark)+R(x-8,base-h-23,16,16,p.outline)+R(x-6,base-h-21,12,12,'#eee9dd')+R(x-1,base-h-20,2,6,p.metalDark)+R(x,base-h-15,4,2,p.metalDark);
    a+=antenna(wx+w-26,base-h-8,20,p)+pottedPlant(x-31,base,0.8,p)+pottedPlant(x+31,base,0.8,p);
    return a;
  }
  function house(x,base,w=92,h=65,roof=p.roof){
    let a=groundShadow(x,base,w*.9,p)+R(x-w/2-2,base-h,w+4,h,p.outline)+R(x-w/2,base-h+2,w,h-2,p.plasterShade)+R(x-w/2+3,base-h+3,w-7,h-6,p.plaster);
    a+=group(x,base,shingleRoof(-h-28,-h+3,w/2+8,p,roof,shade(roof,-.32),5));
    a+=R(x-w/2,base-8,w,7,p.stoneDark)+R(x-w/2,base-8,w,2,p.stoneLight);
    a+=brickPattern(x-w/2+4,base-h+6,w-9,h-15,p,10);
    a+=pixelWindow(x-w/2+9,base-h+16,15,16,p,{shutters:true,sill:true,flowerBox:true});
    a+=pixelWindow(x+w/2-25,base-h+16,15,16,p,{shutters:true,sill:true});
    a+=pixelDoor(x-8,base-25,16,24,p,p.woodDark);
    a+=pottedPlant(x+22,base,.75,p)+bush(x-w/2-6,base,.65,p);
    lights.push({x:x+w/2-17,y:base-h+24,radius:23,color:p.windowGlow});
    return a;
  }
  function shop(x,base){
    const w=94,h=74;
    let a=groundShadow(x,base,82,p)+R(x-49,base-h-2,98,h+2,p.outline)+R(x-47,base-h,94,h,p.brickLight)+brickPattern(x-46,base-h+3,91,h-4,p,7);
    a+=R(x-52,base-h-7,104,9,p.roofDark)+R(x-50,base-h-9,100,4,p.roof)+R(x-37,base-h+8,74,13,p.woodDark)+R(x-35,base-h+10,70,9,p.plaster);
    for(let j=0;j<7;j++)a+=R(x-47+j*14,base-h+24,14,9,j%2?'#e4d4ad':'#8ca7a3');
    a+=pixelWindow(x-35,base-h+38,28,24,p,{lit:true,sill:true})+pixelDoor(x+13,base-31,21,30,p,p.roofDark)+crate(x-32,base,p,.8)+flowers(x+34,base,p,.9);
    lights.push({x:x-21,y:base-h+48,radius:33,color:p.windowGlow});
    return a;
  }
  function apartment(x,base,w=114,h=112){
    let a=groundShadow(x,base,w*.85,p)+R(x-w/2-2,base-h,w+4,h,p.outline)+R(x-w/2,base-h,w,h,p.plasterShade)+R(x-w/2+3,base-h+2,w-6,h-4,p.plaster)+R(x-w/2-4,base-h-5,w+8,6,p.roofDark);
    for(let row=0;row<3;row++)for(let xx=x-w/2+11;xx<x+w/2-17;xx+=28){let yy=base-h+13+row*30;a+=pixelWindow(xx,yy,15,15,p,{lit:(row+xx)%3!==0,sill:true})+R(xx-3,yy+15,21,5,p.metalDark)+R(xx-2,yy+15,19,1,p.metalLight);}
    return a+pixelDoor(x-9,base-26,18,25,p)+antenna(x+35,base-h-5,18,p);
  }
  const fence=(x,b,w)=>smallFence(x,b,w,p);
  // The landscape and palette vocabulary are imported from the pinned original
  // Monkey Civilization source. Modern is the visual age, not a claim about the simulation.
  let bg=R(0,0,960,500,'url(#skyGradient)')+R(0,0,960,500,'url(#skyGlow)')+renderSkyBands(p)+renderSun(p,visual)+renderClouds(rng,p,visual)+renderBirds(p,visual)+renderMountains(rng,p,visual)+renderTreeLine(rng,p,visual)+renderBackdrop(rng,p,visual);
  let ground=renderGround(rng,p,visual);
  let town='';
  // Full-width town: distinct neighborhoods, textured facades, layered vegetation.
  if(place===0){
    town+=house(76,452,102,69,'#8e7f8c')+tree(148,458,1.17,p,'round',true)+school(300,464,202)+fence(192,470,230)+tree(445,461,1.1,p)+shop(533,465)+house(654,462,101,75,'#7c8f92')+apartment(797,462,128,104)+tree(899,460,1.24,p);
  }else if(place===1){
    town+=house(81,460,103,83,'#8f7e8b')+house(211,462,111,74,'#718b8b')+tree(283,458,1.3,p)+shop(363,467)+apartment(506,461,138,124)+house(650,464,106,67,'#8593a8')+tree(723,459,1.14,p)+house(820,463,135,87,'#958b80')+tree(924,459,1.1,p);
  }else{
    town+=school(190,460,240)+fence(56,467,285)+tree(375,460,1.15,p)+R(430,435,266,30,p.dirt)+R(430,435,266,3,p.grassDark)+fence(435,446,252)+ellipse(562,456,47,12,p.dirtDark)+ellipse(562,455,34,8,p.outline)+ellipse(562,454,23,4,p.shadow)+rockCluster(612,461,1.15,p)+shop(770,465)+tree(893,461,1.3,p);
  }
  for(const x of [27,418,718,938]){town+=group(x,479,lampPost(0,0,p,53));lights.push({x,y:426,radius:39,color:p.windowGlow});}
  for(const x of [118,323,589,855])town+=grassTuft(x,476,8,p)+flowers(x+10,474,p,.8);
  town+=bush(12,480,1.05,p)+bush(944,479,1.1,p);
  // Power lines sit behind the sprites. Integer steps give a fine pixel silhouette.
  for(const x of [45,915])town+=R(x,315,4,156,p.metalDark)+R(x-14,325,32,3,p.metalDark)+R(x-9,321,3,8,p.outline)+R(x+10,321,3,8,p.outline);
  for(let i=0;i<58;i++){const x=47+i*15,y=Math.round(328+23*Math.sin(Math.PI*i/58));town+=R(x,y,15,1,p.metalDark)+R(x,y+7,15,1,p.metalDark);}
  // New character sprites are integer-grid pixel art, at the original scene's
  // character scale. All characters have a distinct head silhouette and accessory.
  const designs={
    shijima:{hair:'#3b3c46',high:'#676b78',shade:'#282a34',coat:'#657e98',trim:'#a6bdcb',long:true,cap:'mushroom'},
    majime:{hair:'#be9f67',high:'#edc98b',shade:'#98794b',coat:'#768ba0',trim:'#e2b68e',cap:'egg',glasses:true},
    sis:{hair:'#35363e',high:'#676977',shade:'#252630',coat:'#d3cbbd',trim:'#929da4',long:true,cap:'none'},
    sumida:{hair:'#688a70',high:'#a4bf97',shade:'#4d6e58',coat:'#617b95',trim:'#cbd8c4',pigtails:true,cap:'none'},
    yomikawa:{hair:'#c1a96d',high:'#e4c989',shade:'#92794e',coat:'#72859e',trim:'#adcad4',long:true,cap:'books'},
    mogawa:{hair:'#bc8e9f',high:'#e0b2bd',shade:'#947082',coat:'#9d818e',trim:'#d6b6b8',long:true,cap:'none'},
    gardener:{hair:'#819189',high:'#b3c1ae',shade:'#61766b',coat:'#6c8b78',trim:'#c9d5b1',long:true,cap:'ears'},
    chito:{hair:'#353843',high:'#666b78',shade:'#252831',coat:'#697e70',trim:'#b6c4ae',long:true,cap:'helmet'},
    yuuri:{hair:'#c8b17e',high:'#e4cc92',shade:'#9b8154',coat:'#8a9380',trim:'#c6c9a7',cap:'helmet'}
  };
  const outline='#292d36', skin='#f3d6b6', faceShadow='#d9a98f';
  // Every row is an actual 16-pixel grid, not a scaled smooth path.
  function sprite(kind,x,base,dir=1,phase=0){
    const d=designs[kind], map={O:outline,H:d.hair,L:d.high,D:d.shade,S:skin,F:faceShadow,C:d.coat,T:d.trim,W:'#f0eadf',P:'#465263',B:'#3a4450',K:'#705a58',G:'#b86e7c'};
    const grid=Array.from({length:27},()=>Array(18).fill('.'));
    const put=(x,y,w,h,k)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(yy>=0&&yy<27&&xx>=0&&xx<18)grid[yy][xx]=k;};
    // hair, shaded face, coat, skirt, legs and two different shoe positions
    if(d.long){put(2,7,14,12,'O');put(3,7,12,11,'D');put(3,8,2,10,'H');put(13,8,2,10,'H');}
    if(d.pigtails){put(0,10,4,9,'O');put(1,11,2,7,'H');put(14,10,4,9,'O');put(15,11,2,7,'H');}
    put(4,5,10,1,'O');put(2,6,14,8,'O');put(3,7,12,7,'H');put(5,6,8,2,'L');put(4,10,10,6,'S');put(5,16,8,1,'F');put(4,10,3,2,'H');put(7,9,2,2,'H');put(10,9,4,3,'H');put(13,10,1,4,'D');put(6,12,1,2,'O');put(11,12,1,2,'O');put(8,15,2,1,'F');put(5,14,1,1,'F');put(12,14,1,1,'F');
    if(d.glasses){put(4,11,5,1,'G');put(10,11,5,1,'G');put(4,12,1,2,'G');put(8,12,1,2,'G');put(10,12,1,2,'G');put(14,12,1,2,'G');put(8,12,3,1,'G');put(5,14,3,1,'G');put(11,14,3,1,'G');}
    put(7,17,4,1,'F');put(4,18,10,5,'O');put(5,18,8,4,'C');put(5,18,2,3,'T');put(8,18,2,2,'W');put(8,20,2,1,'T');put(3,19,2,3,'C');put(13,19,2,3,'C');put(3,22,2,1,'S');put(13,22,2,1,'S');put(5,22,8,2,'P');put(5,23,2,2,'B');put(8,23,2,1,'B');put(11,23,2,2,'B');
    put(6,24,2,2,'S');put(10,24,2,2,'S');put(5,26,3,1,'O');put(10,26,3,1,'O');
    if(kind==='sis'||kind==='mogawa'||kind==='gardener'){put(5,21,8,3,'C');put(6,24,2,2,'P');put(10,24,2,2,'P');}
    if(d.cap==='mushroom'){put(5,2,2,4,'W');put(2,1,6,2,'K');put(3,0,4,1,'K');put(12,3,2,3,'W');put(10,1,6,2,'K');put(11,0,4,1,'K');}
    if(d.cap==='egg'){put(6,3,6,2,'W');put(5,4,8,2,'W');put(4,5,10,1,'W');put(8,4,3,2,'T');}
    if(d.cap==='books'){put(3,3,12,2,'O');put(4,3,10,1,'T');put(5,1,10,2,'P');put(6,2,8,1,'W');}
    if(d.cap==='ears'){put(2,1,3,6,'C');put(13,1,3,6,'C');put(5,4,8,2,'C');put(2,6,14,2,'C');}
    if(d.cap==='helmet'){put(4,3,10,2,'C');put(2,5,14,4,'C');put(3,5,12,1,'T');put(3,8,12,1,'B');}
    if(kind==='sumida'){put(12,19,5,5,'O');put(13,19,3,4,'W');put(14,19,1,4,'T');}
    if(kind==='sis'){put(14,20,3,4,'T');put(15,19,1,1,'W');}
    if(kind==='gardener'){put(16,15,1,11,'K');put(15,14,3,2,'T');}
    if(kind==='mogawa'){put(13,19,4,4,'K');put(14,19,2,1,'W');}
    const body=grid.map((row,y)=>row.map((k,x)=>k==='.'?'':R(x,y,1,1,map[k])).join('')).join('');
    // 1.9–2.25 source pixels: comparable to the stock monkey sprite.
    const scale=kind==='sis'||kind==='mogawa'?2.25:2;
    return `<g data-character="${kind}" transform="translate(${x} ${base})">${ellipse(0,0,15,3,p.shadow)}<g transform="scale(${dir*scale} ${scale}) translate(-9 -27)" shape-rendering="crispEdges"><g class="town-person" style="animation-delay:-${phase}s">${body}</g></g></g>`;
  }
  // Physical event objects use pixel grids, texture, original props and animation.
  const icon=(rows,colors,x,y,scale,cls='')=>group(x,y,`<g class="${cls}" transform="scale(${scale})" shape-rendering="crispEdges">${rows.map((row,yy)=>Array.from(row,(k,xx)=>k==='.'?'':R(xx,yy,1,1,colors[k])).join('')).join('')}</g>`);
  let effect='',groundEffect='';
  const fishGrid=['......OOOO......','...OOOBBBOO.....','O.OBBBBBBBBOO...','OOOBLLLBBBOBOO..','OOOBBBBBBBBOBO..','O.OBBBBBBBOOO...','...OOOOOOO......','.......OO.......'];
  const fish=(x,y,s)=>icon(fishGrid,{O:'#4c687f',B:'#82b0bf',L:'#c6e1de'},x,y,s,'town-fish');
  if(event===1||event===6)effect+=fish(240,158,event===6?5:3)+fish(570,210,2);
  if(event===2||event===15||event===18)groundEffect+=crate(600,478,p,.8,false)+R(590,445,3,28,p.woodDark)+R(585,441,12,7,p.metalDark);
  if(event===3||event===5)for(let i=0;i<86;i++){const x=Math.floor(rng()*960),y=70+Math.floor(rng()*415);effect+=`<g class="${event===3?'town-rain':'town-snow'}" style="animation-delay:-${(rng()*5).toFixed(2)}s">${R(x,y,event===3?1:3,event===3?8:3,event===3?'#c2e4ed':'#f4f7e9','opacity=".8"')}</g>`}
  if(event===4)groundEffect+=`<g class="sparkle">${rockCluster(606,478,1.05,p)}${R(602,468,5,4,'#ede1a7')}${R(608,465,2,10,'#ece3b1')}</g>`;
  if(event===7)groundEffect+=`<g class="town-pulse">${R(714,426,12,8,'#f6dda2','opacity=".9"')}${R(711,423,18,14,'#f1d8a1','opacity=".28"')}</g>`;
  if(event===8)groundEffect+=`<g class="town-shadow">${ellipse(403,495,30,4,p.outline,'opacity=".45"')}${ellipse(506,495,28,4,p.outline,'opacity=".45"')}</g>`;
  if(event===9)effect+=icon(['........OO','.....OOOOW','..OOOWWWW.','OOWWWWOO..','..WWOO....','..OO......'],{O:'#75818d',W:'#f4eee1'},410,150,4,'town-fish');
  if(event===10)effect+=`<g opacity=".85">${circle(786,180,37,'#f0e9cc')}${R(771,171,9,7,'#b7c6c5')}${R(800,182,10,8,'#c2d1cc')}</g>`;
  if(event===11||event===14)groundEffect+=icon(['OOOOOOOO','OWWWWWWO','OWWOWWWO','OWWOWWWO','OOOOOOOO'],{O:'#6b7189',W:'#ece0c9'},539,480,2);
  if(event===12)groundEffect+=R(633,456,33,22,p.metalDark)+R(637,459,25,14,p.glass)+R(641,455,3,7,p.metalLight)+`<g class="town-pulse">${R(647,463,4,6,'#d8e7a9')}</g>`;
  if(event===13)groundEffect+=icon(['OOOOOOOOO','OWWWWWWWO','OWOOOWWWO','OWWWWOWWO','OOOOOOOOO'],{O:'#7d867e',W:'#f4ead4'},672,434,2);
  if(event===16){for(let i=0;i<40;i++){const x=665+Math.floor(Math.sin(i*.62)*17),y=100+i*6;effect+=R(x,y,4,7,'#eff1c7')+R(x+1,y,1,7,'#8996b5');}}
  if(event===17)groundEffect+=R(714,486,25,2,p.pathLight);
  if(event===18)groundEffect+=fence(460,477,80);
  const guestsX=present.length===3?[228,620,780]:present.length===2?[225,650]:[660];
  let people=sprite('shijima',411,496,1,0)+sprite('majime',503,494,-1,1.1);
  present.forEach((kind,i)=>{people+=sprite(kind,guestsX[i],492+i*2,i%2?-1:1,(i+1)*.8);});
  let fore=renderForeground(rng,p,visual);
  const night=`<rect class="night" width="960" height="500" fill="${p.night}" opacity="0" style="--night-opacity:${p.nightOpacity}"/>`;
  const stars=renderStars(rng,p,visual),moon=renderMoon(p,visual),fireflies=renderFireflies(rng,p,visual),light=renderLights(lights,p);
  const num=(n)=>n.toLocaleString(locale);
  const hud=R(0,500,960,160,p.hudBg)+R(12,512,936,135,p.hudPanel,'stroke="'+p.hudBorder+'" stroke-width="2"')+R(15,515,930,130,'url(#hudPanelGradient)')+R(24,552,912,1,p.hudBorder,'opacity=".7"');
  const stats=[state.contributions,state.activeDays,locations].map((v,i)=>{const x=26+i*304;return R(x,561,292,53,p.hudInset,'stroke="'+p.hudBorder+'" stroke-width="1"')+R(x+2,563,288,2,p.hudPanelLight)+text(x+13,578,t.stats[i],12,p.hudDim)+text(x+13,603,num(v),21,i===0?p.hudAccent:p.hudAccent2,'font-weight="700"');}).join('');
  const titleBar=R(12,12,936,52,p.hudBg,'stroke="'+p.hudBorder+'" stroke-width="2" opacity=".94"')+R(15,15,930,2,p.hudPanelLight)+text(26,36,t.title,19,p.hudAccent,'font-weight="700"')+text(26,53,t.sub+' / '+t.places[place],11,p.hudDim)+text(934,36,'@'+state.username,13,p.hudText,'text-anchor="end"')+text(934,52,slot.slice(0,10),11,p.hudDim,'text-anchor="end"');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="660" viewBox="0 0 960 660" role="img" aria-label="${title(t.title+' — '+t.events[event])}"><title>${title(t.title)}</title><desc>${title(t.events[event]+' | '+castNames.join(' / '))}</desc><defs><linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${p.skyTop}"/><stop offset="58%" stop-color="${p.skyTop}"/><stop offset="88%" stop-color="${p.skyBottom}"/><stop offset="100%" stop-color="${p.haze}"/></linearGradient><radialGradient id="skyGlow" cx=".74" cy=".2" r=".72"><stop offset="0%" stop-color="${p.sunGlow}" stop-opacity=".24"/><stop offset="100%" stop-color="${p.sunGlow}" stop-opacity="0"/></radialGradient><linearGradient id="hudPanelGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${p.hudPanelLight}"/><stop offset="100%" stop-color="${p.hudBg}"/></linearGradient><clipPath id="scene"><rect width="960" height="500"/></clipPath><style>${BASE_CSS}
  text{font-family:'Noto Sans CJK SC','Noto Sans CJK JP','Yu Gothic','Microsoft YaHei',system-ui,sans-serif}
  .town-person{animation:town-bob 3.1s steps(2,end) infinite}.town-fish{animation:town-drift 20s steps(40,end) infinite alternate}.town-rain{animation:town-up 4s steps(30,end) infinite}.town-snow{animation:town-down 6s steps(30,end) infinite}.town-shadow{animation:town-shade 7s steps(16,end) infinite alternate}.town-pulse{animation:blink-pulse 2.8s steps(3,end) infinite}
  @keyframes town-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}@keyframes town-drift{to{transform:translateX(30px)}}@keyframes town-up{to{transform:translate(12px,-130px)}}@keyframes town-down{to{transform:translate(12px,100px)}}@keyframes town-shade{to{transform:translateX(-70px)}}
  @media(prefers-reduced-motion:reduce){*{animation:none!important}}</style></defs><g clip-path="url(#scene)" shape-rendering="geometricPrecision">${bg}${ground}${town}${effect}${groundEffect}${people}${fore}${night}${stars}${moon}${fireflies}${light}</g>${titleBar}${hud}${text(26,536,t.events[event],17,p.hudText,'font-weight="600"')}${stats}${text(26,631,castNames.join(' / '),12,p.hudDim)}${text(934,641,t.credit,10,p.hudDim,'text-anchor="end"')}<rect x="2" y="2" width="956" height="656" fill="none" stroke="${p.outline}" stroke-width="3"/></svg>`;
}
