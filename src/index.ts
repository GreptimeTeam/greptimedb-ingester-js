import axios from 'axios'
import SQL from './sql'
import PromQL from './promql'

interface GreptimeOptions {
  host: string
  dbName?: string
  username?: string
  password?: string
}

const Greptime = ({
  host = 'http://localhost:4000',
  dbName = 'public',
  username = '',
  password = '',
}: GreptimeOptions): any => {
  axios.defaults.baseURL = host
  axios.defaults.headers.authorization = `Basic ${btoa(`${username}:${password}`)}`

  return {
    sql: new SQL(dbName),
    promQL: new PromQL(dbName),
    grpc: () => {},
  }
}

export default Greptime
