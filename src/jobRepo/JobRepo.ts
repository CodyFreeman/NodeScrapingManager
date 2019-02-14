import JsonDB from "node-json-db/dist/JsonDB";

class JobRepo {
    private db: JsonDB; // TODO: typehint DB connection

    constructor(db: JsonDB) {
        this.db = db;
    }

    public save(path: string, dataObj: {[key:string]: any}): void {
        if (!dataObj.hasOwnProperty('timestamp')) {
            dataObj.timestamp = Math.floor(new Date().getTime() / 1000);
        }
        this.db.push(path, dataObj);
    }

    public load(path: string): any | null { //NB! MAY THROW!
        if (!this.exists(path)) {
            return null;
        }

        return this.db.getData(path);
    }

    public exists(path): boolean {

        return this.db.exists(path);
    }
}
export default JobRepo;