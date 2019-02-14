import JsonDB from "node-json-db/dist/JsonDB";
import ActivityLogEntry from "./ActivityLogEntry";

class ActivityRepo {
    private db: JsonDB;

    public constructor(db: JsonDB) {
        this.db = db;
    }

    public log(jobUuid: string, data: ActivityLogEntry) {

        if (!this.db.exists(`/${jobUuid}/log`)) {
            this.createField(`/${jobUuid}/log[]`)
        }
        this.db.push(`/${jobUuid}/log[]`, data);
    }

    public getLogs(jobUuid: string): ActivityLogEntry[] | null {
        
        if (!this.db.exists(`/${jobUuid}/log`)) {
            return null;
        }
        return this.db.getData(`/${jobUuid}/log`);
    }

    private createField(path) {
        this.db.push(path);
    }
}

export default ActivityRepo;