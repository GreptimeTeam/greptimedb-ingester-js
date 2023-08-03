const greptime_v1 = require('./proto')
const grpc = require('@grpc/grpc-js')
const target = '127.0.0.1:4001'

function main() {
  console.log('client start!')
  var client = new greptime_v1.GreptimeDatabase(target, grpc.credentials.createInsecure())
  client.Handle(
    {
      header: {
        catalog: 'gan',
        schema: 'Time',
        authorization: {
          token: 'token',
        },
        dbname: '',
      },
      request: {
        query: {
          sql: '',
        },
      },
    },
    function (err, response) {
      if (err) {
        console.error('Error: ', err)
      } else {
        console.log(response.message)
      }
    }
  )
  console.log('client end!')
}

main()
