import fs from "node:fs";
import puppeteer from "puppeteer-core";

const BASE = "http://127.0.0.1:3012";
const OUT = "/opt/cursor/artifacts";
const query =
  "g=m&cal=s&d=2001-03-23&tk=a&t=13:00&ta=about_1h&co=" +
  encodeURIComponent("대한민국") +
  "&ci=" +
  encodeURIComponent("안산");

const checks = {
  ko: ["사주는 태어난 해", "이 사람의 핵심 구조", "인생 흐름 요약", "전체 보기", "지금", "인사담당자"],
  es: ["cuatro pilares", "Estructura central", "curso de vida", "Ver todos", "ahora"],
  pl: ["czterech filarach", "Główna struktura", "biegu życia", "Pokaż wszystkie", "teraz"],
};

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900", "--disable-features=WebContentsForceDark"],
});

const report = [];

async function runLocale(locale) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  page.setDefaultTimeout(25000);
  await page.goto(`${BASE}/${locale}/result?${query}`, { waitUntil: "networkidle0" });
  await page.waitForFunction(() => !document.body.innerText.includes("...") && document.body.innerText.length > 80);
  const text = await page.evaluate(() => document.body.innerText);
  const missing = (checks[locale] ?? []).filter((item) => !text.includes(item));
  await page.screenshot({ path: `${OUT}/e2e_${locale}_desktop.png`, fullPage: false });
  const pillars = await page.$$("section .theme-flip");
  if (pillars[0]) {
    await pillars[0].click();
    await new Promise((r) => setTimeout(r, 900));
  }
  await page.screenshot({ path: `${OUT}/e2e_${locale}_pillar.png` });
  const core = await page.evaluateHandle(() => {
    const nodes = [...document.querySelectorAll("h2")];
    return nodes.find((n) => /핵심 구조|Estructura central|Główna struktura/.test(n.textContent ?? ""))?.closest("[role=button]");
  });
  if (core) {
    await core.asElement()?.click();
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: `${OUT}/e2e_${locale}_core.png` });
  }
  await page.setViewport({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 700));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `${OUT}/e2e_${locale}_mobile.png` });
  await page.close();
  report.push({ locale, missing, textLen: text.length, hasHour: /오시|13:00|Hora|Godzina/.test(text) });
  fs.writeFileSync(`${OUT}/e2e_${locale}_text.txt`, text.slice(0, 8000));
}

for (const locale of ["ko", "es", "pl"]) {
  await runLocale(locale);
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
if (report.some((item) => item.missing.length)) process.exit(1);
