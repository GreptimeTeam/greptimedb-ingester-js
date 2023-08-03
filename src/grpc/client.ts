const greptime_v1 = require('./proto')
const grpc = require('@grpc/grpc-js')
const target = '127.0.0.1:4001'

function main() {
  console.log('client start!')
  var client = new greptime_v1.PrometheusGateway(target, grpc.credentials.createInsecure())
  console.log('client start!')
  client.Handle(
    {
      header: {
        authorization: {
          basic: {
            username: '',
            password: '',
          },
        },
        dbname: 'public',
      },
      instant_query: {
        query: 'scripts',
        time: '10',
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
