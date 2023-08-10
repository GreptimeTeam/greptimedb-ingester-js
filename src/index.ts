import axios from 'axios'
import SQL from './sql'
import PromQL from './promql'
import { GreptimeOptions } from './type'

const Greptime = ({
  host = 'http://127.0.0.1:4000',
  dbname = 'public',
  username = '',
  password = '',
}: GreptimeOptions) => {
  axios.defaults.baseURL = /^https?:\/\//.test(host) ? host : `https://${host}`
  axios.defaults.headers.authorization = `Basic ${btoa(`${username}:${password}`)}`

  return {
    sql: new SQL(dbname),
    promQL: new PromQL(dbname),
  }
}

export default Greptime
