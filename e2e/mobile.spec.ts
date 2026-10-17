import {test,expect} from '@playwright/test';
test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true,video:'off'});
test('Celular: navegação e configuração sem overflow',async({page})=>{
 await page.goto('/');await expect(page.getByText('API disponível',{exact:true})).toBeVisible();
 await page.locator('#payload').fill('{"status":"base"}');await page.getByRole('button',{name:'Detectar Campos e Configurar Regras'}).click();await page.getByLabel('Estratégia para status',{exact:true}).selectOption('FIXED_VALUES');await page.getByLabel('Valores fixos para status',{exact:true}).fill('A, B');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'POST /api/generate',exact:true}).click();await expect(page.getByTestId('generated-result')).toContainText('"status": "A"');
});
