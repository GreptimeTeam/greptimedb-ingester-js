import { FormatResultState, SQLResData, ResDataState, FormatResultType } from './type/common'

export const formatResult = function (res: SQLResData, type = 'all'): FormatResultType {
  if (res.data.code) {
    throw new Error(res.data.error) as Error
  }

  if (res.data.output) {
    switch (type) {
      case 'all':
        return <FormatResultState>{
          schema: res.data.output[0].records.schema.column_schemas,
          rows: res.data.output[0].records.rows,
        }
      case 'one':
        return <number>res.data.output[0].records.rows[0][0]
      default:
        break
    }
  } else {
    return <ResDataState>res.data
  }
}
