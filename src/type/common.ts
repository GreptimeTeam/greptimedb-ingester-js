export interface QueryResData {
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
  rows: RowsType
}

export interface SchemaState {
  column_schemas: Array<SchemaColumnState>
}

export interface SchemaColumnState {
  name: string
  data_type: string
}

export interface FormatResultState {
  // schema may be null when running a function with a wrong arguments
  schema: Array<SchemaColumnState> | null
  rows: RowsType
}

export interface createTableState {}

export type RowsType = Array<Array<string | number>>
export type FormatResultType = FormatResultState | ResDataState | OutputState | number
