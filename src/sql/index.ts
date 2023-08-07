import read from './read'
import info from './info'
import write from './write'

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

  Object.entries({
    ...read,
    ...info,
    ...write,
  }).forEach(([key, value]) => {
    this[key] = value
  })
}

export default sql
