import { formatResult } from '../utils'
import { SQLResData, RecordsState, FormatResultState } from '../type/common'

const info = {
  tableDesc: async function (table: string): Promise<FormatResultState> {
    let res: SQLResData = await this.runSQL(`DESC TABLE ${table}`)

    return <FormatResultState>formatResult(res)
  },

  getTimeIndex: async function (table: string): Promise<number> {
    let res: RecordsState = await this.tableDesc(table)
    return <number>res.rows.find((row) => row[4] === 'TIME INDEX')[0]
  },
}

export default info
