import axios, { AxiosRequestConfig } from 'axios'
const dayjs = require('dayjs')

const promQL = function (db) {
  this.url = '/v1/promql'
  this.args = {
    query: '',
    start: dayjs().subtract(5, 'm').unix(),
    end: dayjs().unix(),
    step: 1,
    db,
  }

  this.query = (query) => {
    this.args.query = query
    return this
  }

  this.start = (ts) => {
    this.args.start = dayjs(ts).unix()
    return this
  }

  this.end = (ts) => {
    this.args.end = dayjs(ts).unix()
    return this
  }

  this.step = (step) => {
    this.args.step = step
    return this
  }

  this.duration = (duration = '5m') => {
    const [time, unit] = duration.split(/(?<=\d)(?=[a-zA-Z])/)

    this.args.start = dayjs().subtract(time, unit).unix()
    this.args.end = dayjs().unix()

    return this
  }

  this.run = async () => {
    let res: any = await axios.post(this.url, {}, {
      params: this.args,
    } as AxiosRequestConfig)

    return {
      ...this.formatResult(res),

      promQL: this.args,
    }
  }
}

export default promQL
