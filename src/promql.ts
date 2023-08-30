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

  //promQL builder
  builder = (options: PromQLParams) => {
    let { metrics, selectors, range, field, functions } = options
    if (!metrics) {
      return Promise.reject('wrong promQL query')
    }

    const functionsArr = Array.isArray(functions) ? functions : [functions]
    const selectorsArr =
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
              case '~=':
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

    let query = metrics

    if (selectorsArr.length) {
      if (field) {
        selectorsArr.push(`__field__='${field}'`)
      }
      query += `{${selectorsArr.join()}}`
    }

    if (range) {
      query += `[${range}]`
    }

    if (functionsArr.length) {
      functionsArr.forEach((fn) => {
        query = `${fn}(${query})`
      })
    }

    this.args.query = query
    return this
  }

  run = async (): Promise<PromQLResultState> => {
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
