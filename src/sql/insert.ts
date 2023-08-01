const insert = {
  createTable: async function (name, { tags, fileds, timeIndex }) {
    const sql = `CREATE TABLE IF NOT EXISTS ${name} (
      ${timeIndex} TIMESTAMP TIME INDEX,
      ${tags.map((tag) => `"${tag}" String,`)}
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

    let res: any = await this.runSQL(sql)

    return res
  },
}

export default insert
