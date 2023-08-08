import { SQLResData } from '../type/common'

const write = {
  createTable: async function (name, { tags, fileds, timeIndex }): Promise<SQLResData> {
    const sql = `CREATE TABLE IF NOT EXISTS ${name} (
      ${timeIndex} TIMESTAMP TIME INDEX,
      ${tags.map((tag) => `"${tag}" String`)},
      PRIMARY KEY (${tags.join(',\n')}),
      ${fileds
        .map((filed) => {
          if (typeof filed === 'string') {
            return `"${filed}" DOUBLE`
          } else {
            return Object.entries(filed)
              .map(([key, value]) => `"${key}" ${value}`)
              .join(',\n')
          }
        })
        .join(',\n')}
    )`

    let res: SQLResData = await this.runSQL(sql)

    return res
  },

  //TODO insert and delete
  insert: async function () {},

  delete: async function () {},
}

export default write
