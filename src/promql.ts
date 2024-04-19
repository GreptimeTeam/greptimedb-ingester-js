import * as dayjs from 'dayjs'
import { stringify } from 'qs'
import { ManipulateType } from 'dayjs'
import { formatResult } from './utils'
import { PromQLArgs, PromQLParams, PromQLResultState } from './type/promql'
import { FormatResultState, fetchConfigType } from './type/common'

class PromQL {
  url: string
  authorization: string
  args: PromQLArgs
  params: PromQLParams

  constructor(db: string, fetchConfig: fetchConfigType) {
    this.url = fetchConfig.baseURL + '/v1/promql?'
    this.authorization = fetchConfig.authorization
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

    this.args.start = dayjs()
      .subtract(+time, unit as ManipulateType)
      .unix()
    this.args.end = dayjs().unix()

    return this
  }

  //promQL builder
  builder = (options: PromQLParams) => {
    let { metrics = '', selectors = [], range = '', field = '', functions = [] } = options
    if (!metrics) {
      return Promise.reject('metrics is necessary!')
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

    if (field) {
      selectorsArr.push(`__field__='${field}'`)
    }

    if (selectorsArr.length) {
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
    let result = await fetch(this.url + stringify(this.args), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': this.authorization,
      },
    })

    const res = await result.json()
    return {
      ...(formatResult(res) as FormatResultState),
      promQL: this.args,
    }
  }
}

export default PromQL
