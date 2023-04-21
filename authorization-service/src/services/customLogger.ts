export class CustomLogger {
    public static logError(message: string): void {
        console.error(message)
    }

    public static warn(message: string): void {
        console.warn(message)
    }

    public static log(message: string, obj?: any): void {
        const buildedMessage = obj ? message + ' ' + JSON.stringify(obj) : message;
        console.info(buildedMessage);
    }
}