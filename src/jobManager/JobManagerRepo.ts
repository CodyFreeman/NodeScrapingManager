import JobInterface from "../interfaces/JobInterface";
const fs = require('fs');
const path = require('path');

class JobManagerRepo {

    public getJobs(jobFolderPath: string): JobInterface[] {

        const fileList = this.getFileList(jobFolderPath);
        const jobList = this.getFiles(fileList, jobFolderPath);

        return jobList;
    }

    public getFileList(dir: string): string[] {

        return fs.readdirSync(`${dir}`); // TODO: has implicit dependency, fix
    }

    //TODO: Potential error handling?
    public getFiles(fileList: string[], jobFolderPath: string): JobInterface[] {

        const jobList: JobInterface[] = fileList.map((fileName) => {
            return `${jobFolderPath + path.parse(fileName).name}`;

        }).map((filePath) => {
            return require(filePath).default;
        });

        return jobList;
    }
}

export default JobManagerRepo;