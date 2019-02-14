import Job from "../interfaces/JobInterface";
import JobRepo from "../jobRepo/JobRepo";
import { Browser } from "puppeteer";

class JobRunner {
    private job: Job;
    private repo: JobRepo;
    private browser: Browser;

    public constructor(job: Job, repo: JobRepo, browser: Browser) {
        this.job = job;
        this.repo = repo;
        this.browser = browser;
    }

    public async kill(): Promise<void> {
        try {
            await this.browser.close();
        } catch {
            /* NB! code smell! TODO: Better!
            This method is called when trying to close browser. 
            If browser has already crashed this catches and suppresses the error.
            It is unclear to me how I would derive meaningful information from the error and recover.
            */
        }
    }

    public async run(): Promise<boolean> {
        const beforeResult = await this.runBefore();
        const mainResult = await this.runMain(beforeResult);
        const afterResult = await this.runAfter(mainResult);
        await this.kill();

        return afterResult;
    }

    // TODO: refactor run methods into executeCallback?
    private async runBefore(): Promise<any> {
        let callback = this.job.before;
        if (!callback) {
            return null;
        }
        return await callback(this.repo);
    }

    private async runMain(beforeResult: any): Promise<any> {
        let callback = this.job.main;
        if (!callback) {
            return null;
        }
        return await callback(this.repo, this.browser, beforeResult);
    }

    private async runAfter(mainResult: any): Promise<any> {
        let callback = this.job.after;
        if (!callback) {
            return mainResult;
        }
        return await callback(this.repo, mainResult);
    }
}

export default JobRunner;