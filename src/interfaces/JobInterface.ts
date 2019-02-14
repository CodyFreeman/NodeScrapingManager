import beforeCallback from '../types/beforeCallback';
import mainCallback from '../types/mainCallback';
import afterCallback from '../types/afterCallback';
import JobConfigInterface from './JobConfigInterface';

interface JobInterface {
    name: string;
    uuid: string;
    config: JobConfigInterface;
    before: beforeCallback;
    main: mainCallback;
    after: afterCallback;
}

export default JobInterface;