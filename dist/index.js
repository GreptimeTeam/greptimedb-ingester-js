/*!
 * greptime 0.1.0 (https://github.com/alili/greptime-js-sdk)
 * API https://github.com/alili/greptime-js-sdk/blob/master/doc/api.md
 * Copyright 2017-2023 alili. All Rights Reserved
 * Licensed under MIT (https://github.com/alili/greptime-js-sdk/blob/master/LICENSE)
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));

const dayjs = require('dayjs');
const qs = require('qs');
const select = {
    select: function (column = '*') {
        this.sql.select = column;
        return this;
    },
    from: function (table) {
        this.sql.from = table;
        return this;
    },
    limit: function (_limit) {
        this.sql.limit = _limit;
        return this;
    },
    where: function (condition = '') {
        this.sql.where = condition;
        return this;
    },
    groupBy: function (condition = '') {
        this.sql.groupBy = condition;
        return this;
    },
    orderBy: function (condition = '', order = 'ASC') {
        this.sql.orderBy = condition ? `${condition} ${order}` : '';
        return this;
    },
    duration: function (timeIndex = '', t = '5m') {
        const [time, unit] = t.split(/(?<=\d)(?=[a-zA-Z])/);
        this.sql.where += `${this.sql.where ? 'AND' : ''} ${timeIndex} > ${dayjs()
            .subtract(time, unit)
            .valueOf()}000000::Timestamp`;
        return this;
    },
    today: function (timeIndex) {
        this.sql.where += `${this.sql.where ? 'AND' : ''} ${timeIndex} > ${dayjs().startOf('d').valueOf()}000000::Timestamp`;
        return this;
    },
    query: async function () {
        const sql = `SELECT ${this.sql.select} 
      FROM ${this.sql.from} 
      ${this.sql.where ? `WHERE ${this.sql.where}` : ''} 
      ${this.sql.groupBy ? `GROUP BY ${this.sql.groupBy}` : ''} 
      ${this.sql.orderBy ? `ORDER BY ${this.sql.orderBy}` : ''} 
      ${this.sql.limit ? `LIMIT ${this.sql.limit}` : ''}`.replace(/\s+/g, ' ');
        let res = await this.runSQL(sql);
        return Object.assign({}, this.formatResult(res), { sql });
    },
    count: async function () {
        const sql = `SELECT COUNT(1) 
      FROM ${this.sql.from} 
      ${this.sql.where ? `WHERE ${this.sql.where}` : ''} 
      ${this.sql.groupBy ? `GROUP BY ${this.sql.groupBy}` : ''} 
      ${this.sql.orderBy ? `ORDER BY ${this.sql.orderBy}` : ''} 
      ${this.sql.limit ? `LIMIT ${this.sql.limit}` : ''}`.replace(/\s+/g, ' ');
        let res = await this.runSQL(sql);
        return this.formatResult(res, 'one');
    },
};

const qs$1 = require('qs');
function sql(dbName) {
    this.url = `/v1/sql?db=${dbName}`;
    this.sql = {
        where: '',
    };
    this.runSQL = async function (sql) {
        let res = await axios.post(this.url, qs$1.stringify({
            sql,
        }));
        return await res;
    };
    this.formatResult = function (res, type = 'all') {
        if (res.data.code) {
            throw new Error(res.data.error);
        }
        if (res.data.output) {
            switch (type) {
                case 'all':
                    return {
                        schema: res.data.output[0].records.schema.column_schemas,
                        rows: res.data.output[0].records.rows,
                    };
                case 'one':
                    return res.data.output[0].records.rows[0][0];
                default:
                    break;
            }
        }
        else {
            return res.data;
        }
    };
    Object.entries(select).forEach(([key, value]) => {
        this[key] = value;
    });
    this.tableDesc = async (table) => {
        let res = await this.runSQL(`DESC TABLE ${table}`);
        return this.formatResult(res);
    };
    this.getTimeIndex = async (table) => {
        let res = await this.tableDesc(table);
        return res.rows.find((row) => row[4] === 'TIME INDEX')[0];
    };
}

const dayjs$1 = require('dayjs');
const promQL = function (db) {
    this.url = '/v1/promql';
    this.args = {
        query: '',
        start: dayjs$1().subtract(5, 'm').unix(),
        end: dayjs$1().unix(),
        step: 1,
        db,
    };
    this.query = (query) => {
        this.args.query = query;
        return this;
    };
    this.start = (ts) => {
        this.args.start = dayjs$1(ts).unix();
        return this;
    };
    this.end = (ts) => {
        this.args.end = dayjs$1(ts).unix();
        return this;
    };
    this.step = (step) => {
        this.args.step = step;
        return this;
    };
    this.duration = (duration = '5m') => {
        const [time, unit] = duration.split(/(?<=\d)(?=[a-zA-Z])/);
        this.args.start = dayjs$1().subtract(time, unit).unix();
        this.args.end = dayjs$1().unix();
        return this;
    };
    this.run = async () => {
        let res = await axios.post(this.url, {}, {
            params: this.args,
        });
        return Object.assign({}, this.formatResult(res), { promQL: this.args });
    };
};

const Greptime = ({ host = 'http://localhost:4000', dbName = 'public', username = '', password = '', }) => {
    axios.defaults.baseURL = host;
    axios.defaults.headers.authorization = `Basic ${btoa(`${username}:${password}`)}`;
    return {
        sql: new sql(dbName),
        promQL: new promQL(dbName),
        grpc: () => { },
    };
};

module.exports = Greptime;
