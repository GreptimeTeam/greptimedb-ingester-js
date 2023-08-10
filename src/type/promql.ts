import { RowsType, SchemaColumnState } from './common'

export interface PromQLResultState {
  schema: Array<SchemaColumnState>
  rows: RowsType
  promQL: PromQLArgs
}

export interface PromQLArgs {
  query: string
  start: number
  end: number
  step: string
  db: string
}
