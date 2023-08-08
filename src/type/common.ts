export interface SQLResData {
  data: ResDataState
}

export interface ResDataState {
  error?: string
  code: number
  output?: Array<OutputState>
  execution_time_ms: number
}

export interface OutputState {
  records?: RecordsState
  affectedrows?: number
}

export interface RecordsState {
  schema: SchemaState
  rows: TowsType
}

export interface SchemaState {
  column_schemas: Array<SchemaColumnState>
}

export interface SchemaColumnState {
  name: string
  data_type: string
}

export interface FormatResultState {
  schema: Array<SchemaColumnState>
  rows: TowsType
}

export interface createTableState {}

export type TowsType = Array<Array<string | number>>
export type FormatResultType = FormatResultState | ResDataState | number
