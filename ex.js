const Beanify = require('beanify')
const Ajv = require('./index')
const beanify = Beanify({})

beanify
  .register(Ajv, {
    ajv: {
      useDefaults: true
    }
  })
  .route({
    url: 'math.add',
    schema: {
      body: {
        type: 'object',
        properties: {
          aaa: {
            type: 'string'
          }
        },
        required: ['aaa']
      },
      attribute: {
        type: 'object',
        properties: {
          bbb: { type: 'number' }
        }
      },
      response: {
        type: 'string'
      }
    },
    handler (req, rep) {
      // const e = new Error('message test')
      // rep.error(e)
      rep.send(req.body)
    }
  })
  .ready(async e => {
    e && beanify.$log.error(e.message)
    beanify.print()
    beanify.inject({
      body: { aaa: 'abc' },
      attribute: { bbb: 12345 },
      url: 'math.add',
      handler (e, data) {
        console.log({ e, data })
      }
    })
  })
