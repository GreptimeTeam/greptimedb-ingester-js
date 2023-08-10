# Document

## Getting Started

### query by sql

```js
import Greptime from greptime
let { sql } = Greptime({})
try {
  let res = await sql.select('*').from('script').query()
  console.log(
    '====================\n',
    res.sql,
    '\n-------------------\n',
    res.schema,
    '\n-------------------\n',
    res.rows.length,
    '\n====================\n'
  )
} catch (error) {
  console.log(`show error:`, error)
}
```

### query by promQL

```js
import Greptime from greptime
let { promQL } = Greptime({})
try {
  let res = await promQL.query('demo').duration('1m').run()
  console.log(`res:`, res.data)
} catch (error) {
  console.log(`error:`, error)
}
```

## API

### common

#### init

```js
import Greptime from greptime
let { sql, promQL } = Greptime({
  host = 'http://127.0.0.1:4000',
  dbname = 'public',
  username = '',
  password = '',
})

```

The default parameter is to connect to the local client. The default database name is public and there is no user name or password. If you want to connect to the cloud service, the corresponding parameter initialization needs to be replicated in the cloud background.

### sql

#### createTable

```js
sql.createTable('demo', {
  timeIndex: 'ts',
  tags: ['test'],
  fields: ['data', { startTime: 'date' }],
})
```

This function will be converted to a 'CREATE TABLE IF NOT EXISTS' statement

#### tableDesc

```js
sql.tableDesc('demo')
```

This function will be converted to a 'DESC TABLE' statement

#### getTimeIndex

```js
sql.getTimeIndex('demo')
```

This function return the time index of the current table

#### query(select,from,limit,where,groupBy,orderBy)

```js
sql.select('*').from('demo').limit(100).orderBy('ts', 'ASC').query()
```

- Call by chain
- Finally, you need to call the query method to get the return value

#### count

```js
sql.select('*').from('demo').count()
```

Obtain the number of query results

### sql syntactic sugar

#### today

```js
sql.select('*').from('demo').today().count()
```

#### duration

```js
const timeIndex = await sql.getTimeIndex('demo')
sql.select('*').from('demo').duration(timeIndex, '5m').count()
```

Obtain the query result in the last five minutes

### promQL

#### query by duration

```
let res = await promQL.query('apm').duration('1m').run()
```

### query by time range

```
let res = await promQL.query('apm').start('2023-08-06 00:00').end('2023-08-07 00:00').run()
```

You can use any time format that dayjs can parse
