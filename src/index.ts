import SQL from './sql'
import PromQL from './promql'
import { GreptimeOptions } from './type'

const Greptime = ({
  host = 'http://127.0.0.1:4000',
  dbname = 'public',
  username = '',
  password = '',
  sqlConfig = {
    insertQueueConfig: {
      maxQueueSize: 100,
      maxQueueTime: 1000,
    },
  },
}: GreptimeOptions): { sql: SQL; promQL: PromQL } => {
  const fetchConfig = {
    baseURL: /^https?:\/\//.test(host) ? host : `https://${host}`,
    authorization: `Basic ${btoa(`${username}:${password}`)}`,
  }

  return {
    sql: new SQL(dbname, sqlConfig, fetchConfig),
    promQL: new PromQL(dbname, fetchConfig),
  }
}

export default Greptime
