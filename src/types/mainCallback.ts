import JobRepo from '../jobRepo/JobRepo';

declare type mainCallback = (repo: JobRepo, browser: any, beforeResult: any) => any; //TODO: better typehints

export default mainCallback;