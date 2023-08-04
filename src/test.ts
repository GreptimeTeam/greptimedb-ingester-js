// const Greptime = require("greptime");
import Greptime from './index'
;(async () => {
  let { sql, promQL } = Greptime({})
  const sqlDemo = async () => {
    try {
      let res = await sql.select('*').from('cpu_metrics').query()
      console.log(
        '====================\n',
        res.sql,
        '\n-------------------\n',
        res.schema,
        '\n-------------------\n',
        res.rows.length,
        '\n====================\n'
      )
    } catch (error) {
      console.log(`show error:`, error)
    }
  }

  const promQLDemo = async () => {
    try {
      let res = await promQL.query('apm').duration('1m').run()
      console.log(`res:`, res.data)
    } catch (error) {
      console.log(`error:`, error)
    }
  }

  const getDesc = async (table) => {
    const res = await sql.tableDesc(table)
    console.log(`res111:`, res)
  }

  const getTimeIndex = async (table) => {
    const res = await sql.getTimeIndex(table)
    console.log(`res222:`, res)
  }

  const createTable = async (name, schema) => {
    const res = await sql.createTable(name, schema)

    // console.log(`res:`, res.data.output[0])
  }

  // createTable('demo', {
  //   timeIndex: 'ts',
  //   tags: ['test'],
  //   fileds: ['data', { startTime: 'date' }],
  // })
  getDesc('cpu_metrics')
  getTimeIndex('cpu_metrics')
  // runPromQL()
  // sqlDemo()
  // promQLDemo()

  //
})()
