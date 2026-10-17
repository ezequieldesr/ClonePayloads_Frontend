import { defineConfig } from '@playwright/test';
const baseURL=process.env.E2E_BASE_URL||'http://127.0.0.1:8080';
if(!['localhost','127.0.0.1','[::1]'].includes(new URL(baseURL).hostname))throw Error('Use somente ambiente local de demonstração.');
export default defineConfig({testDir:'./e2e',workers:1,retries:0,forbidOnly:!!process.env.CI,timeout:120_000,
expect:{timeout:12_000},reporter:[['list'],['html',{open:'never'}],['json',{outputFile:'test-results/results.json'}]],
use:{baseURL,browserName:'chromium',viewport:{width:1440,height:1000},locale:'pt-BR',actionTimeout:15_000,
video:process.env.DEMO==='1'?{mode:'on',size:{width:1440,height:1000}}:'retain-on-failure',trace:'retain-on-failure',screenshot:'only-on-failure'}});
