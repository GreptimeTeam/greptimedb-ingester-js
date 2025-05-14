import Greptime from '../src'
import { OutputState, ResDataState } from '../src/type/common'
import { formatResult } from '../src/utils'

async function createCpuMetricsTable(sql: any): Promise<OutputState> {
  const createTableSql = `CREATE TABLE IF NOT EXISTS cpu_metrics (
    ts TIMESTAMP TIME INDEX,
    hostname String,
    environment String,
    usage_user Double,
    usage_system Double,
    usage_idle Double,
    PRIMARY KEY (hostname, environment)
  )`

  let res: ResDataState = await sql.runSQL(createTableSql)
  return <OutputState>formatResult(res, '')
}

async function setup() {
  const greptime = Greptime({})
  const sql = greptime.sql

  // Create cpu_metrics table if not exists
  await createCpuMetricsTable(sql)

  // Insert initial test data
  await sql.insert('cpu_metrics', [
    [new Date().toISOString(), 'server01', 'production', 75.2, 15.8, 9.0],
    [new Date().toISOString(), 'server02', 'staging', 60.5, 20.1, 19.4],
    [new Date().toISOString(), 'server01', 'production', 78.1, 14.5, 7.4],
    [new Date().toISOString(), 'server03', 'development', 45.9, 10.2, 43.9],
    [new Date().toISOString(), 'server02', 'staging', 62.3, 19.5, 18.2],
  ])
}

export default setup 