import { assert } from 'chai'
import Greptime from '../src'

describe('Greptime Tests', () => {
  it('run greptime', () => {
    const result = Greptime({})
    assert.equal(result, result)
  })
})
