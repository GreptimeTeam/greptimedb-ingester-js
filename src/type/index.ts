import { SqlConfigState } from './sql'

export interface GreptimeOptions {
  host?: string
  dbName?: string
  username?: string
  password?: string
  sqlConfig?: SqlConfigState
}
