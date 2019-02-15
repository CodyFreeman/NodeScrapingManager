# Node Scraping Manager

## Jobs

### Adding a job:

Add a new javascript file to the jobs folder following this template:

```javascript
const JobConfigFactory = require(`JobConfigFactory`);

const uuid = `3b2254e5-0ece-440f-9062-61ec005945bf`; // Add UUID manually
const name = ``; // Add own name of job
const interval = 3600;  // Set how often the job runs (seconds)
const puppeteerConfig = {}; // Set Puppeteer config needed here

async function before(repo) {
    // Code here, return anything to main
}

async function main(repo, browser, beforeResult) {
    // Code here, return anything to after
}

async function after(repo, mainResult) {
    // Code here
}

const job = JobFactory.createJob(uuid, name, JobConfigFactory.createConfig(interval, puppeteerConfig), before, main, after);

export default job;
```

### Before callback
The before callback is meant to allow you to stage anything you might need before the main task is run. For example you might want to grab and manipulate the previous database results to pass in to the main callback.

Signature: `async callback(JobRepo)`

The before callback has access to the `JobRepo`, which is magically provided for you. You can return a value from your callback, which will be injected into the `main callback`.

### Main callback
The main callback provides a database and a Puppeteer headless browser. 

Signature: `async callback(this.repo, this.browser, beforeResult)`

The main callback has access to the `JobRepo` a Puppeteer headless browser and the result you (the user) returned from the `before callback`

### After callback
The after callback provides an opportunity to process data. It still has access to the JobRepo as well whatever value you returned from the main callback.

You should return a truthy value from this function to signify the job was successfully executed. Returning a falsy value from this function will log it's execution as failed.

Signature: `async callback(this.repo, mainResult)`

The after callback has access to the `JobRepo` and the result you returned from `main callback`
