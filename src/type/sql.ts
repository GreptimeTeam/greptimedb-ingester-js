import { TowsType, SchemaColumnState } from './common'

export interface QueryResultState {
  schema: Array<SchemaColumnState>
  rows: TowsType
  sql: string
}
