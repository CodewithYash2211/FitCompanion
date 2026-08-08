import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BRAIN_DIR = 'C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\ca3f15d5-5626-4d0c-a014-977d99cf61d7';

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const consoleLogs = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', error => {
    consoleLogs.push(`[PAGE_ERROR] ${error.message}`);
  });

  // Desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.screenshot({ path: path.join(BRAIN_DIR, 'real_dashboard_desktop.png'), fullPage: true });

  // Tablet
  await page.setViewport({ width: 768, height: 1024 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: path.join(BRAIN_DIR, 'real_dashboard_tablet.png'), fullPage: true });

  // Mobile
  await page.setViewport({ width: 375, height: 812 });
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.screenshot({ path: path.join(BRAIN_DIR, 'real_dashboard_mobile.png'), fullPage: true });

  await browser.close();
  
  fs.writeFileSync('console_logs.txt', consoleLogs.join('\n'), 'utf-8');
  console.log('Screenshots captured successfully. Console logs saved.');
}

capture().catch(console.error);
