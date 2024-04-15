import { FormatResultState,ResDataState, FormatResultType, OutputState } from './type/common'

export const formatResult = function (res: ResDataState, type = 'all'): FormatResultType {
  if (res.output) {
    switch (type) {
      case 'all':
        return <FormatResultState>{
          schema: res.output[0].records.schema && res.output[0].records.schema.column_schemas,
          rows: res.output[0].records.rows,
        }
      case 'one':
        return <number>res.output[0].records.rows[0][0]
      default:
        return <OutputState>res.output[0]
    }
  } else {
    return <ResDataState>res
  }
}

export function getInsertTime(maxQueueTime: number) {
  const nowTimestamp = new Date().getTime()
  const newTimestamp = nowTimestamp + maxQueueTime
  const newDate = new Date(newTimestamp)
  return newDate
}
