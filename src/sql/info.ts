import { formatResult } from '../utils'

const info = {
  tableDesc: async function (table) {
    let res: any = await this.runSQL(`DESC TABLE ${table}`)

    return formatResult(res)
  },

  getTimeIndex: async function (table) {
    let res: any = await this.tableDesc(table)
    return res.rows.find((row) => row[4] === 'TIME INDEX')[0]
  },
}

export default info
