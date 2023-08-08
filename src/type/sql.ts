import { RowsType, SchemaColumnState } from './common'

export interface SqlResultState {
  schema: Array<SchemaColumnState>
  rows: RowsType
  sql: string
}
