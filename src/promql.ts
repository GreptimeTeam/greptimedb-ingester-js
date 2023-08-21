import { formatResult } from './utils'
import axios, { AxiosRequestConfig } from 'axios'
import { PromQLArgs, PromQLResultState } from './type/promql'
import { FormatResultState, QueryResData } from './type/common'

const dayjs = require('dayjs')
class PromQL {
  url: string
  args: PromQLArgs

  constructor(db: string) {
    this.url = '/v1/promql'
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
