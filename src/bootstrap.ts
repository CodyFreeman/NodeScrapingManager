import JobManagerRepo from "./jobManager/JobManagerRepo";
import JobManager from "./jobManager/JobManager";
import ActivityRepo from "./activityLogger/ActivityRepo";
import JobRunnerFactory from "./factories/JobRunnerFactory";

const JsonDB = require('node-json-db');
let fs = require('fs');

const config = JSON.parse(fs.readFileSync(`./config.json`));

const activityDB = new JsonDB(config.logDB || "activityLog");
const activityLogger = new ActivityRepo(activityDB);
const jobManagerRepo = new JobManagerRepo();
const jobRunnerFactory = new JobRunnerFactory();
const jobManager = new JobManager(jobManagerRepo, activityLogger, jobRunnerFactory);

const JOBS_FOLDER = `${__dirname}/${config.jobDir}`;

jobManager.proccessJobs(JOBS_FOLDER);