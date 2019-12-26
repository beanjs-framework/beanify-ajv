const Beanify = require('beanify')
const beanifyPlugin = require('beanify-plugin')

const b = new Beanify({
  nats: {
    url: 'nats://localhost:4244'
  }
})

b
  .register(require('./index'))
  .register(beanifyPlugin((beanify, opts, done) => {
    beanify.route({
      url: 'math.add',
      schema: {
        response: [{
          type: 'number'
        }, {
          type: 'number'
        }]
      }
    }, ({ body }, res) => {
      res(null, body.a + body.b, 123)
    })

    beanify.addHook('onError', ({ err }, next) => {
      console.log({
        onError: err
      })
      // t.equal(err.message, 'data should be number', 'check error message')

      next()
    })

    done()
  })).ready((err) => {
    b.inject({
      url: 'math.add',
      body: {
        a: 20,
        b: 10
      }
    }, (err, res,res1) => {
      console.log({
        err, res,res1
      })
      // t.equal(err.message, 'data should be number', 'check error message')
      b.close()
      // throw err
    })
  })
