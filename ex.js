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
    url: 'math.:action',
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
      },
      params: {
        type: 'object',
        properties: {
          action: {
            type: 'string'
          }
        }
      }
    },
    handler (req, rep) {
      // const e = new Error('message test')
      // rep.error(e)
      console.log(req.params)
      rep.send('req.body')
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
