import assert from 'node:assert/strict';
import {renderTown} from './shimeji-skin.mjs';
const base={username:'test',seed:'a1b2c3',contributions:394,activeDays:24,buildings:[{id:'a'},{id:'b'},{id:'c'},{id:'d'},{id:'e'}]};
for(const state of [base,{...base,contributions:0,activeDays:0,buildings:[]}]){
  for(const event of Array.from({length:19},(_,i)=>i)){
    for(const lang of ['en','zh-CN','ja']){
      const svg=renderTown(state,lang,'2026-11-27T06',event);
      assert.equal(svg,renderTown(state,lang,'2026-11-27T06',event));
      assert.match(svg,/^<svg [\s\S]*<\/svg>$/);
      const invalid=svg.match(/NaN|undefined|<script|foreignObject/);
      if(invalid) throw Error('Invalid SVG token: '+svg.slice(Math.max(0,invalid.index-100),invalid.index+100));
      assert.ok(svg.includes('prefers-reduced-motion'));
      assert.ok(svg.includes('viewBox="0 0 960 660"'));
      assert.ok(svg.includes('data-character="shijima"'));
      assert.ok(svg.includes('data-character="majime"'));
      assert.ok(svg.includes('class="cloud'));
      assert.ok(svg.length>30000);
    }
  }
}
assert.notEqual(renderTown(base,'en','2026-11-27T06',0),renderTown(base,'en','2026-11-27T06',1));
assert.notEqual(renderTown(base,'en','2026-11-27T06',1),renderTown(base,'zh-CN','2026-11-27T06',1));
assert.throws(()=>renderTown({...base,contributions:-1},'en','2026-11-27T06'));
const guests={2:['sumida','yomikawa'],12:['sis'],13:['sumida'],14:['yomikawa'],15:['mogawa'],16:['gardener'],17:['chito','yuuri'],18:['sumida','yomikawa','mogawa']};
for(const [event,cast] of Object.entries(guests)){
  const svgs=['en','zh-CN','ja'].map(lang=>renderTown(base,lang,'2026-11-27T06',Number(event)));
  for(const svg of svgs) for(const k of cast) assert.ok(svg.includes('data-character="'+k+'"'));
  const geometry=svg=>svg.slice(svg.indexOf('<g clip-path="url(#scene)"'),svg.indexOf('<rect x="12" y="12"',svg.indexOf('<g clip-path="url(#scene)"')));
  assert.ok(geometry(svgs[0]));
  assert.equal(geometry(svgs[0]),geometry(svgs[1]));
  assert.equal(geometry(svgs[0]),geometry(svgs[2]));
}
console.log('114 deterministic locale/event renders, edge cases, and validation passed.');
