import {test,expect,type Page} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const demo=process.env.DEMO==='1';
async function scene(page:Page,text:string){if(!demo)return;await page.evaluate(text=>{let el=document.getElementById('demo-caption');if(!el){el=document.createElement('div');el.id='demo-caption';document.body.append(el);}el.textContent=text;el.style.cssText='position:fixed;bottom:20px;left:24px;z-index:9999;background:#0c1828ee;color:#dcfff3;border-left:4px solid #72efbd;border-radius:8px;padding:14px 20px;font:500 16px sans-serif;pointer-events:none';},text);await page.waitForTimeout(1400);}
async function pause(page:Page,ms=1000){if(demo)await page.waitForTimeout(ms);}
async function shot(page:Page,name:string){if(!demo)return;mkdirSync('docs/demo',{recursive:true});const target=/^0[3456]-/.test(name)?page.locator('#playground > div.grid'):page;await target.screenshot({path:`docs/demo/${name}.png`,animations:'disabled',style:'#demo-caption{visibility:hidden!important}'});}
test('Jornada: quatro estratégias e cópia de JSON real',async({page,context})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto('/');await expect(page.getByText('API disponível',{exact:true})).toBeVisible();await pause(page,1600);
 await scene(page,'01 / ClonePayloads — dados de teste sem copiar e colar');await shot(page,'01-home');
 await page.getByRole('link',{name:'Como funciona',exact:true}).click();await pause(page,1800);await shot(page,'02-como-funciona');
 await page.getByRole('link',{name:'Playground',exact:true}).click();await pause(page);
 const payload={timestamp:'2026-06-01T10:00:00.000Z',userId:'usuario-demo',score:10.25,status:'rascunho'};
 await scene(page,'02 / Um JSON de entrada, regras diferentes por campo');
 await page.locator('#payload').fill(JSON.stringify(payload,null,2));await page.locator('#quantidade').fill('3');await pause(page);
 await page.getByRole('button',{name:'Detectar Campos e Configurar Regras'}).click();
 await expect(page.getByLabel('Estratégia para timestamp',{exact:true})).toHaveValue('TIMESTAMP_INCREMENT');
 await page.getByLabel('Estratégia para userId',{exact:true}).selectOption('UUID');await pause(page,600);
 await page.getByLabel('Estratégia para score',{exact:true}).selectOption('NUMERIC_INCREMENT');await pause(page,600);
 await page.getByLabel('Estratégia para status',{exact:true}).selectOption('FIXED_VALUES');
 await page.getByLabel('Valores fixos para status',{exact:true}).fill('pendente, aprovado');
 await page.locator('#playground > div.grid').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await shot(page,'03-regras');await pause(page,1500);
 await scene(page,'03 / Timestamp, UUID, números decimais e valores alternados');
 const response=page.waitForResponse(r=>r.url().endsWith('/api/generate')&&r.request().method()==='POST');
 await page.getByRole('button',{name:'POST /api/generate',exact:true}).click();
 const res=await response;expect(res.status()).toBe(200);const data=await res.json();
 expect(data).toHaveLength(3);expect(data.map((p:{score:number})=>p.score)).toEqual([11.25,12.25,13.25]);
 expect(data.map((p:{status:string})=>p.status)).toEqual(['pendente','aprovado','pendente']);
 expect(data[0].timestamp).toBe('2026-06-01T10:00:00.001Z');expect(new Set(data.map((p:{userId:string})=>p.userId)).size).toBe(3);
 await expect(page.getByTestId('generated-result')).toContainText('11.25');await page.locator('#playground > div.grid').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await pause(page,2200);await shot(page,'04-resultado');
 await scene(page,'04 / Resultado validado pela API, pronto para reutilizar');
 await page.getByRole('button',{name:'copiar',exact:true}).click();
 await expect.poll(async()=>JSON.parse(await page.evaluate(()=>navigator.clipboard.readText()))).toEqual(data);
 await pause(page,1500);await shot(page,'05-copia');
 await scene(page,'05 / Controle explícito: campos sem regra permanecem iguais');
 await page.locator('#payload').fill(JSON.stringify({nome:'Marina',ambiente:'teste'},null,2));
 await expect(page.getByLabel('Estratégia para timestamp',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Detectar Campos e Configurar Regras'}).click();await page.locator('#quantidade').fill('2');
 await page.getByRole('button',{name:'POST /api/generate',exact:true}).click();
 await expect(page.getByTestId('generated-result')).toContainText('Marina');await shot(page,'06-sem-alteracao');
 await scene(page,'ClonePayloads / Ferramenta web integrada a uma API Java');await pause(page,2000);expect(errors).toEqual([]);
});
test('Validações visíveis: JSON, campos e regras inválidas',async({page})=>{
 await page.goto('/');await page.locator('#payload').fill('{invalido');await page.getByRole('button',{name:'Detectar Campos e Configurar Regras'}).click();await expect(page.getByText('JSON inválido — corrija o payload antes de continuar',{exact:true})).toBeVisible();
 await page.locator('#payload').fill('{"id":"base"}');await page.getByRole('button',{name:'Detectar Campos e Configurar Regras'}).click();
 await page.getByLabel('Estratégia para id',{exact:true}).selectOption('FIXED_VALUES');await page.getByRole('button',{name:'POST /api/generate',exact:true}).click();await expect(page.getByText('Campo "id": informe ao menos um valor para a lista',{exact:true})).toBeVisible();
 await page.getByLabel('Estratégia para id',{exact:true}).selectOption('NUMERIC_INCREMENT');
 await page.getByRole('button',{name:'POST /api/generate',exact:true}).click();await expect(page.getByText("O campo 'id' precisa ser numérico para usar NUMERIC_INCREMENT",{exact:true})).toBeVisible();
 await shot(page,'07-validacao');
});
