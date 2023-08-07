const dayjs = require('dayjs')
import { formatResult } from '../utils'

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

  query: async function () {
    const sql = `SELECT ${this.sql.select} 
      FROM ${this.sql.from} 
      ${this.sql.where ? `WHERE ${this.sql.where}` : ''} 
      ${this.sql.groupBy ? `GROUP BY ${this.sql.groupBy}` : ''} 
      ${this.sql.orderBy ? `ORDER BY ${this.sql.orderBy}` : ''} 
      ${this.sql.limit ? `LIMIT ${this.sql.limit}` : ''}`.replace(/\s+/g, ' ')

    let res: any = await this.runSQL(sql)

    return {
      ...formatResult(res),
      sql,
    }
  },

  count: async function () {
    const sql = `SELECT COUNT(1) 
      FROM ${this.sql.from} 
      ${this.sql.where ? `WHERE ${this.sql.where}` : ''} 
      ${this.sql.groupBy ? `GROUP BY ${this.sql.groupBy}` : ''} 
      ${this.sql.orderBy ? `ORDER BY ${this.sql.orderBy}` : ''} 
      ${this.sql.limit ? `LIMIT ${this.sql.limit}` : ''}`.replace(/\s+/g, ' ')

    let res: any = await this.runSQL(sql)

    return formatResult(res, 'one')
  },
}

export default read
