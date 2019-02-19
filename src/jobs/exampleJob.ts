import JobConfigFactory from '../factories/JobConfigFactory';
import JobFactory from '../factories/JobFactory';
import JobRepo from '../jobRepo/JobRepo';
import { Browser } from 'puppeteer';

const RESULT_PATH = `/exampleResults`;

const uuid = `94a6ecfb-7d7c-4d12-9854-9cea3b940692`;
const name = `example job`;
const interval = 3;
const puppeteerConfig = {
    headless: false,
    args: ['--window-size=1600,900'],
    defaultViewport: { width: 1600, height: 900 }
};

async function before(repo: JobRepo) {
    return repo.load(RESULT_PATH);
}

async function main(repo: JobRepo, browser: Browser, beforeResult: any) {

    const page = await browser.newPage();
    await page.goto(`https://duckduckgo.com`);
    await page.type(`#search_form_input_homepage`, `what is the answer to life the universe and everything`);

    await Promise.all([
        page.click(`#search_button_homepage`, {}),
        page.waitForNavigation()
    ]);

    const urls = await page.$$eval(`.result__url`, (elements) => {
        return elements.map((element) => {

            const domain = element.querySelector(`.result__url__domain`);
            const path = element.querySelector(`.result__url__full`);

            if (domain && path && `innerHTML` in domain && `innerHTML` in path) {
                return domain.innerHTML + path.innerHTML;
            }

        });
    });
    await page.screenshot({ path: `exampleJob.png` });
    await page.goto(`https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be&t=42`);
    await new Promise((resolve) => {
        setTimeout(resolve, 10000);
    });
    return await urls;
}

async function after(repo: JobRepo, mainResult: any) {
    repo.save(`${RESULT_PATH}[]`, mainResult);
    return true;
}

const jobConfig = JobConfigFactory.createConfig(interval, puppeteerConfig, 60, 2);
const job = JobFactory.createJob(uuid, name, jobConfig, before, main, after);

export default job;