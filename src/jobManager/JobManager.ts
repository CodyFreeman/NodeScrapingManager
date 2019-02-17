import JobManagerRepo from "./JobManagerRepo";
import ActivityRepo from "../activityLogger/ActivityRepo";
import JobInterface from "../interfaces/JobInterface";
import ActivityLogEntry from "../activityLogger/ActivityLogEntry";
import JobRunnerFactory from "../factories/JobRunnerFactory";

class JobManager {

    private repo: JobManagerRepo;
    private logger: ActivityRepo;
    private jobRunnerFactory: JobRunnerFactory;

    public constructor(jobManagerRepo: JobManagerRepo, activityRepo: ActivityRepo, jobRunnerFactory: JobRunnerFactory) {

        this.repo = jobManagerRepo;
        this.logger = activityRepo;
        this.jobRunnerFactory = jobRunnerFactory;
    }

    public async proccessJobs(jobFolderPath: string) {

        try {

            const jobList = this.repo.getJobs(jobFolderPath);
            const jobQue = this.filterJobs(jobList);

            await this.proccessQue(jobQue);

        } catch (error) {
            console.error(error.message || `Could not generate job que`); // TODO: notify of critical fail
        }
    }

    private filterJobs(jobList: JobInterface[]): JobInterface[] {

        const now = Math.floor(new Date().getTime() / 1000);

        const jobQue = jobList.filter((job) => {
            const jobHistory = this.logger.getLogs(job.uuid);

            // Adds job to que if never run
            if (!jobHistory || Array.isArray(jobHistory) && jobHistory.length < 1) {
                return true;
            }

            // Adds job to que if past delta time larger than job config interval
            const lastSuccess = this.findLast(jobHistory, 'success', true);

            if (!lastSuccess || !lastSuccess.timestamp) {
                const lastError = this.findLast(jobHistory, 'success', false);

                // Does not add job to que if within error timeout
                if (!lastError || !lastError.timestamp || lastError.timestamp + job.config.retryDelay > now) {
                    return false;
                }
                return true;
            }
            return lastSuccess.timestamp + job.config.interval < now;
        });

        return jobQue;
    }

    private async proccessQue(jobQue) {

        for (const job of jobQue) {
            try {
                const success = await this.runJob(job);
                if (success) {
                    this.logger.log(job.uuid, new ActivityLogEntry(Math.floor(new Date().getTime() / 1000), true, `job ${job.uuid} successfully executed`));
                }
            } catch (error) {
                this.logger.log(job.uuid, new ActivityLogEntry(Math.floor(new Date().getTime() / 1000), false, `error proccessing job: ${job.uuid || 'no job uuid detected'}. ${error.message || 'no error message detected'}`));
                continue;
            }
        }
    }

    private async runJob(job: JobInterface): Promise<boolean> {

        const runner = await this.jobRunnerFactory.create(job);

        try {
            const result = await runner.run();

            return !!result;

        } catch (error) {
            runner.kill();
            this.logger.log(job.uuid, new ActivityLogEntry(Math.floor(new Date().getTime() / 1000), false, error.message || `unknown error executing: ${job.uuid || 'unknown job'}`));

            return false;
        }
    }

    private findLast(activityLog: ActivityLogEntry[], property: string, expected: any): ActivityLogEntry | null {
        if (!Array.isArray(activityLog) || activityLog.length < 1) {
            return null;
        }

        return activityLog.reduce((previous, current) => {
            if (!previous) {
                return current || null;
            }
            
            if (current[property] !== expected) {
                return previous;
            }

            return current.timestamp > previous.timestamp ? current : previous;
        }) || null;
    }
}

export default JobManager;