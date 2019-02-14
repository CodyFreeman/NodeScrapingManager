import JobRepo from '../jobRepo/JobRepo';

declare type afterCallback = (repo: JobRepo, mainResult: any) => any;

export default afterCallback;