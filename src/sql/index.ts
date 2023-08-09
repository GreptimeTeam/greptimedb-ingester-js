import SqlOperation from './operation'
import { SqlState } from '../type/sql'

import axios from 'axios'

const qs = require('qs')

class Sql extends SqlOperation {
  url: string
  sql: SqlState

  constructor(dbName: string) {
    super()
    this.url = `/v1/sql?db=${dbName}`
    this.sql = {} as SqlState
  }

  runSQL = async function (sql) {
    let res: any = await axios.post(
      this.url,
      qs.stringify({
        sql,
      })
    )
    return await res
  }
}

export default Sql
