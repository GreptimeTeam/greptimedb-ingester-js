import { expect } from 'chai'
import Greptime from '../src'
import { SchemaColumnState } from '../src/type/common'
import setup from './setup'

const tableName = 'cpu_metrics'
const tableSchemaName = ['hostname', 'environment', 'usage_user', 'usage_system', 'usage_idle', 'ts']
const tableRows = ['test', 'staging']
const descTableSchemaName = ['Column', 'Type', 'Key', 'Null', 'Default', 'Semantic Type']
const descTableRows = tableSchemaName
let rowNum = 15

describe('Greptime SQL testing', function () {
  const greptime = Greptime({})
  const sql = greptime.sql

  before(async function() {
    await setup()
  })

  it('Schema testing of query', async function () {
    let { schema } = await sql.select().from(tableName).query()
    for (let item of schema) {
      expect(item.name).to.be.oneOf(tableSchemaName)
    }
  })

  it('Rows testing of query', async function () {
    let { rows } = await sql.select().from(tableName).query()
    expect(rows.length).to.greaterThan(0)
  })

  it('Count testing of rows', async function () {
    let count = await sql.select().from(tableName).count()
    expect(count).to.greaterThan(0)
  })

  it('Schema testing of descTable', async function () {
    let { schema } = await sql.descTable(tableName)
    for (let item of schema as SchemaColumnState[]) {
      expect(item.name).to.be.oneOf(descTableSchemaName)
    }
  })

  it('Rows testing of descTable', async function () {
    let { rows } = await sql.descTable(tableName)
    for (let item of rows) {
      expect(item[0]).to.be.oneOf(descTableRows)
    }
  })

  it('Time index testing of sql', async function () {
    let timeIndex = await sql.getTimeIndex(tableName)
    expect(timeIndex).to.be.equal('ts')
  })

  it('CreateTable testing of sql', async function () {
    let res = await sql.createTable('test1', {
      tags: ['hostname', 'environment'],
      fields: ['usage_user', 'usage_system', 'usage_idle'],
      timeIndex: 'ts',
    })
    expect(Object.keys(res)[0]).to.be.equal('affectedrows')
  })


  it('Delete testing of sql', async function () {
    let res = await sql.delete('cpu_metrics', { primary: { hostname: 'host_1' }, timestamp: 1680307200 })
    expect(res.affectedrows).to.be.oneOf([0, 1])
    rowNum--
  })

})
