const Beanify = require('beanify')
const beanifyPlugin = require('beanify-plugin')

const tap = require('tap')

const beanifyOpts = {
  nats: {
    url: 'nats://natsd:4222',
    user: 'testuser',
    pass: 'testpass'
  }
}

tap.test('beanify-ajv test no schema', (t) => {
  t.plan(3)

  const b = new Beanify(beanifyOpts)

  b.register(require('../index'))
    .register(beanifyPlugin((beanify, opts, done) => {
      beanify.route({
        url: 'math.sub'
      }, ({ body }, res) => {
        res(null, body.a + body.b + '')
      })

      done()
    })).ready((err) => {
      t.error(err, 'check ready.err')
      b.inject({
        url: 'math.sub',
        body: {
          a: 20,
          b: 10
        }
      }, (err, res) => {
        t.error(err, 'check inject.err')
        t.equal(res, '30', 'check response')
        b.close()
      })
    })
})

tap.test('beanify-ajv test body', (t) => {
  t.plan(3)

  const b = new Beanify(beanifyOpts)

  b.register(require('../index'))
    .register(beanifyPlugin((beanify, opts, done) => {
      beanify.route({
        url: 'math.add',
        schema: {
          body: {
            type: 'object',
            properties: {
              a: { type: 'number' },
              b: { type: 'number', default: 10 }
            }
          }
        }
      }, ({ body }, res) => {
        res(null, body.a + body.b)
      })

      done()
    })).ready((err) => {
      t.error(err, 'check ready.err')
      b.inject({
        url: 'math.add',
        body: {
          a: 20
        }
      }, (err, res) => {
        t.error(err, 'check inject.err')
        t.equal(res, 30, 'check response')
        b.close()
      })
    })
})

tap.test('beanify-ajv test body valid error', (t) => {
  t.plan(2)

  const b = new Beanify(beanifyOpts)

  b.register(require('../index'))
    .register(beanifyPlugin((beanify, opts, done) => {
      beanify.route({
        url: 'math.add',
        schema: {
          body: {
            type: 'object',
            properties: {
              a: { type: 'number' },
              b: { type: 'number', default: 10 }
            }
          }
        }
      }, ({ body }, res) => {
        res(null, body.a + body.b)
      })

      beanify.addHook('onError', ({ err }, next) => {
        t.equal(err.message, 'data.a should be number', 'check error message')
        b.close()
        next()
      })

      done()
    })).ready((err) => {
      t.error(err, 'check ready.err')
      b.inject({
        url: 'math.add',
        body: {
          a: '20'
        }
      }, (err, res) => {
        throw err
      })
    })
})

tap.test('beanify-ajv test response', (t) => {
  t.plan(3)

  const b = new Beanify(beanifyOpts)

  b.register(require('../index'))
    .register(beanifyPlugin((beanify, opts, done) => {
      beanify.route({
        url: 'math.add',
        schema: {
          response: {
            type: 'number'
          }
        }
      }, ({ body }, res) => {
        res(null, body.a + body.b)
      })

      done()
    })).ready((err) => {
      t.error(err, 'check ready.err')
      b.inject({
        url: 'math.add',
        body: {
          a: 20,
          b: 10
        }
      }, (err, res) => {
        t.error(err, 'check inject.err')
        t.equal(res, 30, 'check response')
        b.close()
      })
    })
})

tap.test('beanify-ajv test response valid error', (t) => {
  t.plan(2)

  const b = new Beanify(beanifyOpts)

  b.register(require('../index'))
    .register(beanifyPlugin((beanify, opts, done) => {
      beanify.route({
        url: 'math.add',
        schema: {
          response: {
            type: 'number'
          }
        }
      }, ({ body }, res) => {
        res(null, body.a + body.b + '')
      })

      beanify.addHook('onError', ({ err }, next) => {
        t.equal(err.message, 'data should be number', 'check error message')
        b.close()
        next()
      })

      done()
    })).ready((err) => {
      t.error(err, 'check ready.err')
      b.inject({
        url: 'math.add',
        body: {
          a: 20,
          b: 10
        }
      }, (err, res) => {
        throw err
      })
    })
})
