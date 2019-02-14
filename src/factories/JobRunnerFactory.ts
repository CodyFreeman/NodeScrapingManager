import JobRunner from "../jobManager/JobRunner";
import JobRepo from "../jobRepo/JobRepo";
import JobInterface from "../interfaces/JobInterface";
const JsonDB = require('node-json-db');
const puppeteer = require(`puppeteer`);

class JobRunnerFactory {

    public async create(job: JobInterface): Promise<JobRunner>{

        const repo = new JobRepo(new JsonDB(`jobDatabases/${job.uuid}`)); 
        const browser = await puppeteer.launch(job.config.puppeteerConfig);

        return new JobRunner(job, repo, browser);
    }
}

export default JobRunnerFactory;