export const formatResult = function (res: any, type = 'all') {
  if (res.data.code) {
    throw new Error(res.data.error)
  }

  if (res.data.output) {
    switch (type) {
      case 'all':
        return {
          schema: res.data.output[0].records.schema.column_schemas,
          rows: res.data.output[0].records.rows,
        }
      case 'one':
        return res.data.output[0].records.rows[0][0]
      default:
        break
    }
  } else {
    return res.data
  }
}
