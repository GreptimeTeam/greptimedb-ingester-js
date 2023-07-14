interface GreptimeOptions {
    host: string;
    dbName?: string;
    username?: string;
    password?: string;
}
declare const Greptime: ({ host, dbName, username, password, }: GreptimeOptions) => any;
export default Greptime;
