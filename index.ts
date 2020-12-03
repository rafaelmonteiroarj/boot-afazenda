import { launch, Page } from "puppeteer";
import config from 'config';

(async () => {
  const browser = await launch({
    headless: false,
    defaultViewport: null,
    args: ["--window-size=1600,1100"]
  });

  const click = async (pg: Page, x: string) => {
    await pg.waitForSelector(x);
    await pg.click(x);
    await pg.waitForTimeout(1400);
  };

  const vote = async (page: Page, count: number) => {
    const elements = await page.$x(
      "/html/body/div[6]/div[1]/div/div/div/div[1]/ul/li[3]"
    );
    await elements[0]?.click();

    await click(page, ".voting-button");
    await click(page, ".voting-button");
    console.log("Voto computado com sucesso, #ficaJojo ==>", count);
  };

  const votes = 5000;
  const page = await browser.newPage();
  await page.goto(config.get("App.uri"));

  await click(
    page,
    "figure.voting-card:nth-child(3) > div:nth-child(2) > img:nth-child(1)"
  );

  await click(page, ".voting-button");
  await click(page, ".voting-button");

  for (let i = 0; i < votes; i++) {
    await vote(page, i);
  }

  page.on("console", async consoleObj => {
    console.log(consoleObj.text());
  });

  await browser.close();
})();
