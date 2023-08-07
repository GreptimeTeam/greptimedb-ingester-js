import { expect } from 'chai'
import Greptime from '../src'

const tableName = 'cpu_metrics'
const tableSchemaName = ['hostname', 'environment', 'usage_user', 'usage_system', 'usage_idle', 'ts']
const tableRows = ['test', 'staging']
const tableDescSchemaName = ['Field', 'Type', 'Null', 'Default', 'Semantic Type']
const tableDescRows = tableSchemaName

describe('Greptime SQL testing', function () {
  const greptime = Greptime({})
  const sql = greptime.sql

  it('Schema testing of query', async function () {
    let { schema } = await sql.select().from(tableName).query()
    for (let item of schema) {
      expect(item.name).to.be.oneOf(tableSchemaName)
    }
  })

  it('Rows testing of query', async function () {
    let { rows } = await sql.select().from(tableName).query()
    for (let item of rows) {
      expect(item[1]).to.be.oneOf(tableRows)
    }
  })

  it('Count testing of rows', async function () {
    let count = await sql.select().from(tableName).count()
    expect(count).to.be.equal(18)
  })

  it('Schema testing of tableDesc', async function () {
    let { schema } = await sql.tableDesc(tableName)
    for (let item of schema) {
      expect(item.name).to.be.oneOf(tableDescSchemaName)
    }
  })

  it('Rows testing of tableDesc', async function () {
    let { rows } = await sql.tableDesc(tableName)
    for (let item of rows) {
      expect(item[0]).to.be.oneOf(tableDescRows)
    }
  })

  it('Time index testing of sql', async function () {
    let timeIndex = await sql.getTimeIndex(tableName)
    expect(timeIndex).to.be.equal('ts')
  })

  it('CreateTable testing of sql', async function () {
    let res = await sql.createTable('test1', {
      tags: ['hostname', 'environment'],
      fileds: ['usage_user', 'usage_system', 'usage_idle'],
      timeIndex: 'ts',
    })
    expect(res.data.code).to.be.equal(0)
  })
})
