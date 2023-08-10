import axios from 'axios'
import SQL from './sql'
import PromQL from './promql'
import { GreptimeOptions } from './type'

const Greptime = ({
  host = 'http://127.0.0.1:4000',
  dbName = 'public',
  username = '',
  password = '',
  sqlConfig = {
    insertQueueConfig: {
      maxQueueSize: 100,
      maxQueueTime: 1000,
    },
  },
}: GreptimeOptions) => {
  axios.defaults.baseURL = host
  axios.defaults.headers.authorization = `Basic ${btoa(`${username}:${password}`)}`

  return {
    sql: new SQL(dbName, sqlConfig),
    promQL: new PromQL(dbName),
  }
}

export default Greptime
