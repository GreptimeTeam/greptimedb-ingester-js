import SqlOperation from './operation'
import { SqlState, SqlInsertValuesState, SqlConfigState, InsertQueueConfigState } from '../type/sql'

import axios from 'axios'

const qs = require('qs')

class Sql extends SqlOperation {
  url: string
  sql: SqlState
  insertQueueConfig: InsertQueueConfigState
  insertValues: Map<string, SqlInsertValuesState>
  timeoutId: Map<string, ReturnType<typeof setTimeout>>

  constructor(dbName: string, sqlConfig: SqlConfigState) {
    super()
    this.url = `/v1/sql?db=${dbname}`
    this.sql = {} as SqlState
    this.insertQueueConfig = sqlConfig.insertQueueConfig
    this.insertValues = new Map()
    this.timeoutId = new Map()
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
