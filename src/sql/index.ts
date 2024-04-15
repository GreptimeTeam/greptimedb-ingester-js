import SqlOperation from './operation'
import { SqlState, SqlInsertValuesState, SqlConfigState, InsertQueueConfigState } from '../type/sql'
import { fetchConfigType } from '../type/common'

import * as _qs from 'qs'

const qs = _qs

class Sql extends SqlOperation {
  url: string
  authorization: string
  sql: SqlState
  insertQueueConfig: InsertQueueConfigState
  insertValues: Map<string, SqlInsertValuesState>
  timeoutId: Map<string, ReturnType<typeof setTimeout>>

  constructor(dbname: string, sqlConfig: SqlConfigState, fetchConfig: fetchConfigType) {
    super()
    this.url = fetchConfig.baseURL + `/v1/sql?db=${dbname}`
    this.sql = {} as SqlState
    this.insertQueueConfig = sqlConfig.insertQueueConfig
    this.insertValues = new Map()
    this.timeoutId = new Map()
    this.authorization = fetchConfig.authorization
  }

  runSQL = async function (sql) {
    let res: any = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': this.authorization,
      },
      body: qs.stringify({ sql, }),
    })
    if (res.status !== 200) throw new Error(await res.text())
    
    return await res.json()
  }
}

export default Sql
