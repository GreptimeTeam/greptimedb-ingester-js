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
  tags: string[]
  fileds: string[]
  timeIndex: string
}

export type SqlInsertValuesState = Array<Array<number | string>>
