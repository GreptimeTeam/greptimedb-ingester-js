import Greptime from '../src'

async function setup() {
  const greptime = Greptime({})
  const sql = greptime.sql

  // Create cpu_metrics table if not exists
  await sql.createCpuMetricsTable()

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