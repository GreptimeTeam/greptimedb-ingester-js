const dayjs = require('dayjs')
import { formatResult } from '../utils'
import { FormatResultState, QueryResData } from '../type/common'
import { SqlResultState } from '../type/sql'

const read = {
  select: function (column = '*') {
    this.sql.select = column
    return this
  },

  from: function (table) {
    this.sql.from = table
    return this
  },

  limit: function (_limit) {
    this.sql.limit = _limit
    return this
  },

  where: function (condition = '') {
    this.sql.where = condition
    return this
  },

  groupBy: function (condition = '') {
    this.sql.groupBy = condition
    return this
  },

  orderBy: function (condition = '', order = 'ASC') {
    this.sql.orderBy = condition ? `${condition} ${order}` : ''
    return this
  },

  duration: function (timeIndex = '', t = '5m') {
    const [time, unit] = t.split(/(?<=\d)(?=[a-zA-Z])/)
    this.sql.where += `${this.sql.where ? 'AND' : ''} ${timeIndex} > ${dayjs()
      .subtract(time, unit)
      .valueOf()}000000::Timestamp`
    return this
  },

  today: function (timeIndex) {
    this.sql.where += `${this.sql.where ? 'AND' : ''} ${timeIndex} > ${dayjs().startOf('d').valueOf()}000000::Timestamp`
    return this
  },

  query: async function (): Promise<SqlResultState> {
    const sql = `SELECT ${this.sql.select} 
      FROM ${this.sql.from} 
      ${this.sql.where ? `WHERE ${this.sql.where}` : ''} 
      ${this.sql.groupBy ? `GROUP BY ${this.sql.groupBy}` : ''} 
      ${this.sql.orderBy ? `ORDER BY ${this.sql.orderBy}` : ''} 
      ${this.sql.limit ? `LIMIT ${this.sql.limit}` : ''}`.replace(/\s+/g, ' ')

    let res: QueryResData = await this.runSQL(sql)

    return {
      ...(<FormatResultState>formatResult(res)),
      sql,
    }
  },

  count: async function (): Promise<number> {
    const sql = `SELECT COUNT(1) 
      FROM ${this.sql.from} 
      ${this.sql.where ? `WHERE ${this.sql.where}` : ''} 
      ${this.sql.groupBy ? `GROUP BY ${this.sql.groupBy}` : ''} 
      ${this.sql.orderBy ? `ORDER BY ${this.sql.orderBy}` : ''} 
      ${this.sql.limit ? `LIMIT ${this.sql.limit}` : ''}`.replace(/\s+/g, ' ')

    let res: QueryResData = await this.runSQL(sql)

    return <number>formatResult(res, 'one')
  },
}

export default read
