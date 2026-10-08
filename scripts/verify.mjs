import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

await mkdir('.qa', { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
async function revealFullPage() {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 450) {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(120);
  }
  await page.waitForFunction(() => Array.from(document.images).every(img => img.complete));
  await page.waitForTimeout(800);
}
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto('http://127.0.0.1:3001', { waitUntil: 'networkidle' });
await page.locator('.photo-fan-card').first().waitFor();
await page.waitForTimeout(2200);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);
await page.screenshot({ path: '.qa/desktop.png' });
assert.equal(await page.locator('.photo-fan-card').count(), 5);
assert.equal(await page.locator('.hero h1').innerText(), 'Your day.\nAs it felt.');
await page.getByRole('button', { name: 'Open A little closer to forever', exact: true }).focus();
await page.keyboard.press('Enter');
assert.equal(await page.getByRole('dialog').isVisible(), true);
await page.keyboard.press('Escape');
assert.equal(await page.getByRole('link', { name: 'View our work', exact: true }).getAttribute('href'), '#work');
assert.equal(await page.locator('#work').evaluate(el => el.previousElementSibling.id), 'experience');
assert.equal(await page.locator('.parallax-photo-card').count() >= 17, true);
await page.locator('.parallax-photo-card').nth(1).dispatchEvent('click');
assert.equal(await page.getByRole('dialog').isVisible(), true);
await page.getByRole('button', { name: 'Next photograph' }).click();
await page.keyboard.press('Escape');
assert.equal(await page.getByRole('dialog').isVisible(), false);
await page.getByLabel('Your name').fill('Test Couple');
await page.getByLabel('Location', { exact: true }).fill('Kochi');
await page.getByLabel('Wedding date').fill('2027-02-14');
await page.evaluate(() => { window.__openedUrl = ''; window.open = (url) => { window.__openedUrl = String(url); return null; }; });
await page.getByRole('button', { name: 'Enquire on WhatsApp' }).click();
const openedUrl = new URL(await page.evaluate(() => window.__openedUrl));
assert.equal(openedUrl.origin + openedUrl.pathname, 'https://wa.me/919037867720');
assert.match(openedUrl.searchParams.get('text'), /Test Couple/);
assert.match(openedUrl.searchParams.get('text'), /2027-02-14/);
assert.match(openedUrl.searchParams.get('text'), /Kochi/);
assert.match(await page.getByRole('link', { name: 'Chat on WhatsApp' }).getAttribute('href'), /wa.me\/919037867720/);
await page.getByText('Do you travel for weddings?', { exact: true }).click();
assert.equal(await page.locator('.faq-list details').first().getAttribute('open'), '');
await page.getByText('Do you travel for weddings?', { exact: true }).click();
for (const id of ['story', 'experience', 'work', 'process', 'questions', 'contact']) { await page.locator(`#${id}`).scrollIntoViewIfNeeded(); await page.waitForTimeout(800); }
await page.waitForTimeout(1100);
await revealFullPage();
assert.equal(await page.locator('#work img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0)), true);
await page.screenshot({ path: '.qa/desktop-full.png', fullPage: true });
for (const width of [320, 390, 768, 1440]) {
  await page.setViewportSize({ width, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Overflow at ${width}`);
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:3001', { waitUntil: 'networkidle' });
await page.locator('.photo-fan-card').first().waitFor();
await page.waitForTimeout(2200);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(1200);
await page.screenshot({ path: '.qa/mobile.png' });
await page.getByRole('button', { name: 'Open menu' }).click();
await page.getByRole('link', { name: 'Work', exact: true }).click();
assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
for (const id of ['story', 'experience', 'work', 'process', 'questions', 'contact']) { await page.locator(`#${id}`).scrollIntoViewIfNeeded(); await page.waitForTimeout(800); }
await page.waitForTimeout(1100);
await revealFullPage();
await page.screenshot({ path: '.qa/mobile-full.png', fullPage: true });
assert.deepEqual(errors, []);
console.log('PASS: 3D parallax unfurling gallery in Selected Work; all images load; lightbox wraparound/Escape, FAQs, WhatsApp destination and prefilled enquiry (no message sent), mobile menu, no overflow at 320/390/768/1440, no page errors.');
await browser.close();
