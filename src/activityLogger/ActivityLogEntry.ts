class ActivityLogEntry {
    public timestamp: number;
    public success: boolean;
    public message: string;

    public constructor(timestamp: number = 0, success: boolean = false, message: string = '') {
        this.timestamp = timestamp;
        this.success = success;
        this.message = message;
    }
}
export default ActivityLogEntry;