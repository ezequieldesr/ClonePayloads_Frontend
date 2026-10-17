import {test,expect} from '@playwright/test';
test.use({video:'off'});
test('API: limites de quantidade, campos, bytes e regras',async({request})=>{
 const call=(data:unknown)=>request.post('/api/generate',{data});
 for(const quantidade of [1,101])expect((await call({quantidade,payload:{id:'base'},fieldRoles:[]})).status()).toBe(400);
 expect((await call({quantidade:2,payload:Object.fromEntries(Array.from({length:101},(_,i)=>['f'+i,0])),fieldRoles:[]})).status()).toBe(400);
 expect((await call({quantidade:2,payload:{id:'x'.repeat(66000)},fieldRoles:[]})).status()).toBe(413);
 expect((await call({quantidade:2,payload:{id:'base'},fieldRoles:[null]})).status()).toBe(400);
 const result=await call({quantidade:100,payload:{id:'base'},fieldRoles:[]});expect(result.status()).toBe(200);expect(await result.json()).toHaveLength(100);
});
