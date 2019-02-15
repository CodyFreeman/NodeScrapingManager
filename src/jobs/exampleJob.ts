import JobConfigFactory from '../factories/JobConfigFactory';
import JobFactory from '../factories/JobFactory';
import JobRepo from '../jobRepo/JobRepo';
import { Browser } from 'puppeteer';

const RESULT_PATH = `/exampleResults`;

const uuid = `94a6ecfb-7d7c-4d12-9854-9cea3b940692`;
const name = `example job`;
const interval = 3600;
const puppeteerConfig = { headless: false};

async function before(repo: JobRepo) {
    return repo.load(RESULT_PATH);
}

async function main(repo: JobRepo, browser: Browser, beforeResult: any) {
    return { time: Math.floor(new Date().getTime() / 1000), success: true };
}

async function after(repo: JobRepo, mainResult: any) {

    if (!mainResult || !mainResult.success) {
        return false;
    }

    repo.save(`${RESULT_PATH}[]`, mainResult);

    return true;
}
const jobConfig = JobConfigFactory.createConfig(interval, puppeteerConfig, 60, 2);
const job = JobFactory.createJob(uuid, name, jobConfig, before, main, after);

export default job;