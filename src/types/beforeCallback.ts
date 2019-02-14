import JobRepo from '../jobRepo/JobRepo';

declare type beforeCallback = (repo: JobRepo) => any;

export default beforeCallback;