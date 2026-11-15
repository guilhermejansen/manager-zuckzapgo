/* Isolated public landing verification: no production services or authenticated state. */
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
const { chromium, expect } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE + '/index.mjs').href)
const brand = JSON.parse(fs.readFileSync('package.json', 'utf8')).name.includes('dinastiapi') ? 'DinastiAPI' : 'ZuckZapGo'
;(async () => {
  const browser = await chromium.launch({ headless: true })
  const checks = []
  try {
    for (const width of [320, 390, 1024, 1440]) {
      for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' })
        const page = await context.newPage()
        const errors = [], requests = [], badResponses = [], consoleErrors = []
        page.on('pageerror', e => errors.push(e.name))
        page.on('console', e => { if (e.type() === 'error') consoleErrors.push('console_error') })
        page.on('response', r => { if (r.status() >= 400) badResponses.push({ path: new URL(r.url()).pathname, status: r.status() }) })
        page.on('requestfailed', r => { if (!r.failure()?.errorText.includes('ERR_ABORTED')) requests.push(new URL(r.url()).pathname) })
        const response = await page.goto('http://127.0.0.1:18080/', { waitUntil: 'networkidle' })
        expect(response.status()).toBe(200)
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Operação WhatsApp sem atrito')
        expect(await page.locator('a button, button a').count()).toBe(0)
        expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(false)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        const pricingLink = page.locator('a[href="#pricing"]').first()
        await expect(pricingLink).toBeVisible()
        await pricingLink.click()
        await expect(page.locator('#pricing')).toBeInViewport()
        const offers = page.locator('#pricing a[href^="https://"]')
        await expect(offers).toHaveCount(4)
        const destinations = await offers.evaluateAll(nodes => nodes.map(a => a.href))
        expect(new Set(destinations).size).toBe(4)
        expect(destinations.every(url => new URL(url).hostname === (brand === 'DinastiAPI' ? 'clkdmg.site' : 'go.hotmart.com'))).toBe(true)
        const themeToggle = page.getByRole('button', { name: /tema|theme/i }).first()
        await themeToggle.scrollIntoViewIfNeeded()
        const beforeDark = await page.locator('html').evaluate(e => e.classList.contains('dark'))
        await themeToggle.click()
        await expect.poll(() => page.locator('html').evaluate(e => e.classList.contains('dark'))).toBe(!beforeDark)
        await themeToggle.click()
        await expect.poll(() => page.locator('html').evaluate(e => e.classList.contains('dark'))).toBe(beforeDark)
        await page.keyboard.press('Tab')
        expect(await page.evaluate(() => document.activeElement !== document.body)).toBe(true)
        await page.locator('#pricing').scrollIntoViewIfNeeded()
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await expect.poll(() => page.evaluate(() => [...document.images].filter(image => {
          const box = image.getBoundingClientRect()
          return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth && (!image.complete || image.naturalWidth === 0)
        }).length)).toBe(0)
        expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running' && animation.effect?.getTiming().iterations === Infinity).length)).toBe(0)
        expect(badResponses).toEqual([])
        expect(consoleErrors).toEqual([])
        await page.screenshot({ path: `qualification/landing-${width}-${theme}.png`, fullPage: true })
        expect(errors).toEqual([])
        expect(requests).toEqual([])
        checks.push({ width, theme, pricingOffers: 4, overflow: false, runtimeErrors: 0, failedRequests: 0 })
        await context.close()
      }
    }
    fs.writeFileSync('qualification/landing-results.json', JSON.stringify({ status: 'PASS', brand, checks, data: 'public_surface_only', financial_actions: 0 }, null, 2))
    console.log(JSON.stringify({ status: 'PASS', brand, cases: checks.length, financial_actions: 0 }))
  } finally { await browser.close() }
})().catch(error => { console.error('Landing qualification failed:', error.message); process.exitCode = 1 })
