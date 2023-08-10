import { SqlConfigState } from './sql'

export interface GreptimeOptions {
  host?: string
  dbname?: string
  username?: string
  password?: string
  sqlConfig?: SqlConfigState
}
