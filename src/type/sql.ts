import { RowsType, SchemaColumnState } from './common'

export interface SqlResultState {
  schema: Array<SchemaColumnState>
  rows: RowsType
  sql: string
}

export interface SqlInsertValuesState {
  values: Array<{}>
}

export interface SqlState {
  select: string
  from: string
  where: string
  groupBy: string
  orderBy: string
  limit: string
}
