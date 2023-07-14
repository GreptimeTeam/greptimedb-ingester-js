import select from './select'
import axios from 'axios'

const qs = require('qs')

function sql(dbName) {
  this.url = `/v1/sql?db=${dbName}`
  this.sql = {
    where: '',
  }

  this.runSQL = async function (sql) {
    let res: any = await axios.post(
      this.url,
      qs.stringify({
        sql,
      })
    )
    return await res
  }

  this.formatResult = function (res, type = 'all') {
    if (res.data.code) {
      throw new Error(res.data.error)
    }

    if (res.data.output) {
      switch (type) {
        case 'all':
          return {
            schema: res.data.output[0].records.schema.column_schemas,
            rows: res.data.output[0].records.rows,
          }
        case 'one':
          return res.data.output[0].records.rows[0][0]
        default:
          break
      }
    } else {
      return res.data
    }
  }

  Object.entries(select).forEach(([key, value]) => {
    this[key] = value
  })

  this.tableDesc = async (table) => {
    let res: any = await this.runSQL(`DESC TABLE ${table}`)

    return this.formatResult(res)
  }

  this.getTimeIndex = async (table) => {
    let res: any = await this.tableDesc(table)
    return res.rows.find((row) => row[4] === 'TIME INDEX')[0]
  }
}

export default sql
