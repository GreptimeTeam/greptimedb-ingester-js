import { FormatResultState, QueryResData, ResDataState, FormatResultType, OutputState } from './type/common'

export const formatResult = function (res: QueryResData, type = 'all'): FormatResultType {
  if (res.data.code) {
    throw new Error(res.data.error) as Error
  }

  if (res.data.output) {
    switch (type) {
      case 'all':
        return <FormatResultState>{
          schema: res.data.output[0].records.schema && res.data.output[0].records.schema.column_schemas,
          rows: res.data.output[0].records.rows,
        }
      case 'one':
        return <number>res.data.output[0].records.rows[0][0]
      default:
        return <OutputState>res.data.output[0]
    }
  } else {
    return <ResDataState>res.data
  }
}

export function getInsertTime(maxQueueTime: number) {
  const nowTimestamp = new Date().getTime()
  const newTimestamp = nowTimestamp + maxQueueTime
  const newDate = new Date(newTimestamp)
  return newDate
}
