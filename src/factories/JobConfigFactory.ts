import JobConfigInterface from "../interfaces/JobConfigInterface";

class JobConfigFactory {

    public static createConfig(interval: number = 3600, puppeteerConfig: {} = {}, retryDelay: number = 300, retryMax: number = 3): JobConfigInterface {

        return { interval, puppeteerConfig, retryDelay, retryMax };
    }
}

export default JobConfigFactory;