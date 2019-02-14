import JobInterface from "../interfaces/JobInterface";
import JobConfigInterface from "../interfaces/JobConfigInterface";
import beforeCallback from "../types/beforeCallback";
import mainCallback from "../types/mainCallback";
import afterCallback from "../types/afterCallback";

class JobFactory {

    public static createJob(uuid: string, name: string, config: JobConfigInterface, before: beforeCallback, main: mainCallback, after: afterCallback): JobInterface {

        return {
            uuid,
            name,
            config,
            before,
            main,
            after
        }
    }
}

export default JobFactory;