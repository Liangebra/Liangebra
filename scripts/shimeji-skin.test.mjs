import assert from 'node:assert/strict';
import {renderTown} from './shimeji-skin.mjs';
const base={username:'test',seed:'a1b2c3',contributions:394,activeDays:24,buildings:[{id:'a'},{id:'b'},{id:'c'},{id:'d'},{id:'e'}]};
for(const state of [base,{...base,contributions:0,activeDays:0,buildings:[]}]){
  for(const event of Array.from({length:12},(_,i)=>i)){
    for(const lang of ['en','zh-CN','ja']){
      const svg=renderTown(state,lang,'2026-11-27T06',event);
      assert.equal(svg,renderTown(state,lang,'2026-11-27T06',event));
      assert.match(svg,/^<svg [\s\S]*<\/svg>$/);
      assert.doesNotMatch(svg,/NaN|undefined|<script|foreignObject/);
      assert.ok(svg.includes('prefers-reduced-motion'));
    }
  }
}
assert.notEqual(renderTown(base,'en','2026-11-27T06',0),renderTown(base,'en','2026-11-27T06',1));
assert.notEqual(renderTown(base,'en','2026-11-27T06',1),renderTown(base,'zh-CN','2026-11-27T06',1));
assert.throws(()=>renderTown({...base,contributions:-1},'en','2026-11-27T06'));
console.log('72 deterministic locale/event renders, edge cases, and validation passed.');
