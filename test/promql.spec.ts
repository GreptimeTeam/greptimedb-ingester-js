import { expect } from 'chai'
import Greptime from '../src'

describe('Greptime PromQL testing', function () {
  const greptime = Greptime({})
  const promQL = greptime.promQL

  it('PromQL testing', async function () {
    const { schema, rows } = await promQL.query('avg(cpu_metrics)').start(1680276000).end(1680576000).step('1s').run()

    for (let key of Object.keys(schema[0])) {
      expect(key).to.be.oneOf(['name', 'data_type'])
    }

    for (let i = 1680308000, j = 0; i <= 1680576000; i = i + 1000, j++) {
      expect(rows[j][0].toString()).to.be.equal(i.toString())
    }
  })
})
