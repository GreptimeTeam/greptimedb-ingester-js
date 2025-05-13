import { expect } from 'chai'
import Greptime from '../src'
import setup from './setup'

describe('Greptime PromQL testing', function () {
  const greptime = Greptime({})
  const promQL = greptime.promQL

  before(async function() {
    await setup()
  })

  it('PromQL testing', async function () {
    const { schema, rows } = await promQL.query('avg(cpu_metrics)').step('1s').run()

    for (let key of Object.keys(schema[0])) {
      expect(key).to.be.oneOf(['name', 'data_type'])
    }

    // Test that timestamps are in 1-second intervals
    for (let i = 1; i < rows.length; i++) {
      const currentTimestamp = parseInt(rows[i][0].toString())
      const previousTimestamp = parseInt(rows[i-1][0].toString())
      expect(currentTimestamp - previousTimestamp).to.equal(1000) // 1000ms = 1s
    }
  })
})
