import { TowsType, SchemaColumnState } from './common'

export interface PromQLResultState {
  schema: Array<SchemaColumnState>
  rows: TowsType
  promQL: PromQLArgs
}

export interface PromQLArgs {
  query: string
  start: string
  end: string
  step: number
  db: string
}
