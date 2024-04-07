import * as _dayjs from 'dayjs'
import {ManipulateType} from 'dayjs'
import { formatResult, getInsertTime } from '../utils'
import { FormatResultState, OutputState, QueryResData, RecordsState } from '../type/common'
import { DeleteState, SqlResultState, SqlInsertValuesState, CreateTableQueryState } from '../type/sql'
import Sql from '.'

const dayjs= _dayjs
class SqlOperation {
  // Read
  select = function (column = '*'): Sql {
    this.sql.select = column
    return this
  }

  from = function (table: string): Sql {
    this.sql.from = table
    return this
  }

  limit = function (_limit: string): Sql {
    this.sql.limit = _limit
    return this
  }

  where = function (condition = ''): Sql {
    this.sql.where = condition
    return this
  }

  groupBy = function (condition = ''): Sql {
    this.sql.groupBy = condition
    return this
  }

  orderBy = function (condition = '', order = 'ASC'): Sql {
    this.sql.orderBy = condition ? `${condition} ${order}` : ''
    return this
  }

  duration = function (timeIndex = '', t = '5m'): Sql {
    const [time, unit] = t.split(/(?<=\d)(?=[a-zA-Z])/)
    this.sql.where += `${this.sql.where ? 'AND' : ''} ${timeIndex} > ${dayjs()
      .subtract(+time, unit as ManipulateType)
      .valueOf()}000000::Timestamp`
    return this
  }

  today = function (timeIndex: number): Sql {
    this.sql.where += `${this.sql.where ? 'AND' : ''} ${timeIndex} > ${dayjs().startOf('d').valueOf()}000000::Timestamp`
    return this
  }

  query = async function (sql: string): Promise<SqlResultState> {
    if (!sql) {
      sql = `SELECT ${this.sql.select} 
        FROM ${this.sql.from} 
        ${this.sql.where ? `WHERE ${this.sql.where}` : ''} 
        ${this.sql.groupBy ? `GROUP BY ${this.sql.groupBy}` : ''} 
        ${this.sql.orderBy ? `ORDER BY ${this.sql.orderBy}` : ''} 
        ${this.sql.limit ? `LIMIT ${this.sql.limit}` : ''}`.replace(/\s+/g, ' ')
    }
  
    let res: QueryResData = await this.runSQL(sql)

    return {
      ...(<FormatResultState>formatResult(res)),
      sql,
    }
  }

  count = async function (): Promise<number> {
    const sql = `SELECT COUNT(1) 
      FROM ${this.sql.from} 
      ${this.sql.where ? `WHERE ${this.sql.where}` : ''} 
      ${this.sql.groupBy ? `GROUP BY ${this.sql.groupBy}` : ''} 
      ${this.sql.orderBy ? `ORDER BY ${this.sql.orderBy}` : ''} 
      ${this.sql.limit ? `LIMIT ${this.sql.limit}` : ''}`.replace(/\s+/g, ' ')

    let res: QueryResData = await this.runSQL(sql)

    return <number>formatResult(res, 'one')
  }

  // Info
  showTables = async function (): Promise<FormatResultState> {
    let res: QueryResData = await this.runSQL(`SHOW TABLES`)

    return <FormatResultState>formatResult(res)
  }

  descTable = async function (table: string): Promise<FormatResultState> {
    let res: QueryResData = await this.runSQL(`DESC TABLE ${table}`)

    return <FormatResultState>formatResult(res)
  }

  getTimeIndex = async function (table: string): Promise<number> {
    let res: RecordsState = await this.descTable(table)
    return <number>res.rows.find((row) => row[4] === 'TIME INDEX')[0]
  }

  // Write
  createTable = async function (
    name: string,
    { timeIndex, tags, fields }: CreateTableQueryState
  ): Promise<OutputState> {
    const sql = `CREATE TABLE IF NOT EXISTS ${name} (
      ${timeIndex} TIMESTAMP TIME INDEX,
      ${tags.map((tag) => `"${tag}" String`)},
      PRIMARY KEY (${tags.join(',\n')}),
      ${fields
        .map((field) => {
          if (typeof field === 'string') {
            return `"${field}" DOUBLE`
          } else {
            return Object.entries(field)
              .map(([key, value]) => `"${key}" ${value}`)
              .join(',\n')
          }
        })
        .join(',\n')}
    )`

    let res: QueryResData = await this.runSQL(sql)

    return <OutputState>formatResult(res, '')
  }

  insert = async function (table: string, values: SqlInsertValuesState) {
    let res: string
    const isDArray = Array.isArray(values[0])
    if (this.insertValues.get(table) && this.insertValues.get(table).length < 100)
      clearTimeout(this.timeoutId.get(table))
    values = isDArray ? values : [values as Array<number | string>]
    this.insertValues.set(table, this.insertValues.get(table) ? this.insertValues.get(table).concat(values) : values)

    this.timeoutId.set(
      table,
      setTimeout(async () => {
        const valuesStr = `${this.insertValues
          .get(table)
          .map((value) => {
            return `(${value.map((item) => (typeof item === 'string' ? `"${item}"` : item)).join(',')})`
          })
          .join(',\n')};`
        const sql = `INSERT INTO ${table} VALUES ${valuesStr}`
        await this.runSQL(sql)
        this.insertValues.set(table, [])
      }, 1000)
    )
    res = `The insert queue has ${
      this.insertValues && this.insertValues.get(table).length
    } statements. If no new data is available, the request will be sent at ${getInsertTime(
      this.insertQueueConfig.maxQueueTime
    )}`
    return res
  }

  delete = async function (table: string, condition: DeleteState): Promise<OutputState> {
    const sql = `DELETE FROM ${table} WHERE ${Object.entries(condition.primary)
      .map(([key, value]) => `${key}='${value}'`)
      .join(' and ')} and ts=${condition.timestamp};`

    const res = await this.runSQL(sql)

    return <OutputState>formatResult(res, '')
  }
}

export default SqlOperation
