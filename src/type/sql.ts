import { RowsType, SchemaColumnState } from './common'

export interface SqlResultState {
  schema: Array<SchemaColumnState>
  rows: RowsType
  sql: string
}

export interface SqlState {
  select: string
  from: string
  where: string
  groupBy: string
  orderBy: string
  limit: string
}

export interface DeleteState {
  primary: PrimaryState
  timestamp: number
}

export interface PrimaryState {
  [key: string]: string
}

export interface SqlConfigState {
  insertQueueConfig: InsertQueueConfigState
}

export interface InsertQueueConfigState {
  maxQueueSize: number
  maxQueueTime: number
}

export interface CreateTableQueryState {
  timeIndex: string
  tags: string[]
  fields: Array<string | FiledItemState>
}

export type SqlInsertValuesState = Array<Array<number | string>> | Array<number | string>

export interface FiledItemState {
  [key: string]: string
}
