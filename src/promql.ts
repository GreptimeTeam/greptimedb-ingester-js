import { formatResult } from './utils'
import axios, { AxiosRequestConfig } from 'axios'
import { PromQLArgs, PromQLParams, PromQLResultState } from './type/promql'
import { FormatResultState, QueryResData } from './type/common'

const dayjs = require('dayjs')
class PromQL {
  url: string
  args: PromQLArgs
  params: PromQLParams

  constructor(db: string) {
    this.url = '/v1/promql'
    this.params = {
      metrics: '',
      selectors: [],
      range: '',
      field: '',
      functions: [],
    }
    this.args = {
      query: '',
      start: dayjs().subtract(5, 'm').unix(),
      end: dayjs().unix(),
      step: '1s',
      db,
    }
  }

  query = (query: string) => {
    this.args.query = query
    return this
  }

  start = (ts: number) => {
    this.args.start = dayjs(ts).unix()
    return this
  }

  end = (ts: number) => {
    this.args.end = dayjs(ts).unix()
    return this
  }

  step = (step: string) => {
    this.args.step = step
    return this
  }

  duration = (duration: string = '5m') => {
    const [time, unit] = duration.split(/(?<=\d)(?=[a-zA-Z])/)

    this.args.start = dayjs().subtract(time, unit).unix()
    this.args.end = dayjs().unix()

    return this
  }

  metrics = (metrics: string) => {
    this.params.metrics = metrics
    return this
  }

  selectors = (selectors: string | Object) => {
    this.params.selectors =
      typeof selectors === 'string'
        ? selectors.split(',')
        : Object.entries(selectors).map(([key, value]) => {
            let [_, k, operation] = key.match(/^(.*?)([!~=]*)$/)
            switch (operation) {
              case '!':
              case '!=':
                operation = '!='
                break
              case '~':
              case '=~':
                operation = '=~'
                break
              case '!~':
                operation = '!~'
                break
              case '=':
              default:
                operation = '='
                break
            }
            return `${k}${operation}'${value}'`
          })
    return this
  }
  field = (field: string) => {
    this.params.field = field
    return this
  }

  range = (range: string) => {
    this.params.range = range
    return this
  }

  functions = (functions: string | string[]) => {
    this.params.functions = Array.isArray(functions) ? functions : [functions]
    return this
  }

  run = async (): Promise<PromQLResultState> => {
    if (!this.args.query) {
      if (!this.params.metrics) {
        return Promise.reject('wrong promQL query')
      }

      let query = this.params.metrics

      if (this.params.selectors.length) {
        if (this.params.field) {
          this.params.selectors.push(`__field__='${this.params.field}'`)
        }
        query += `{${this.params.selectors.join()}}`
      }

      if (this.params.range) {
        query += `[${this.params.range}]`
      }

      if (this.params.functions.length) {
        this.params.functions.forEach((fn) => {
          query = `${fn}(${query})`
        })
      }
      console.log(`query:`, query)
      this.args.query = query
    }

    let res: QueryResData = await axios.post(this.url, {}, {
      params: this.args,
    } as AxiosRequestConfig)

    return {
      ...(formatResult(res) as FormatResultState),
      promQL: this.args,
    }
  }
}

export default PromQL
