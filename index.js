const beanifyPlugin = require('beanify-plugin')
const AJV = require('ajv')

module.exports = beanifyPlugin((beanify, opts, done) => {
  opts.ajv = opts.ajv || {}
  opts.ajv.useDefaults = true
  const ajv = new AJV(opts.ajv)

  beanify.addHook('onRoute', ({ route, log }, next) => {
    const { schema } = route.$options

    route.$ajv = {}

    if (schema) {
      route.$ajv = {}

      if (schema.body) {
        route.$ajv.bodyCheck = ajv.compile(bodySchema)
      }

      if (schema.response) {
        if (Array.isArray(schema.response)) {
          route.$ajv.resCheckMap = {}
          schema.response.forEach((item, idx) => {
            route.$ajv.resCheckMap[idx] = ajv.compile(item)
          });
        } else {
          route.$ajv.resCheck = ajv.compile(schema.response)
        }
      }
    }

    next()
  })

  beanify.addHook('onHandler', ({ context, req, log }, next) => {
    const { $ajv } = context

    if ($ajv.bodyCheck && typeof $ajv.bodyCheck === 'function' && $ajv.bodyCheck(req.body) === false) {
      const err = new Error(JSON.stringify({
        err: ajv.errorsText($ajv.body.errors),
        body: req.body
      }))

      context.error(err)
      throw err
    }

    next()
  })

  beanify.addHook('onAfterHandler', ({ context, res, log }, next) => {
    const { $ajv } = context

    let isError = false;
    let err;
    if ($ajv.resCheck && typeof $ajv.resCheck === 'function' && res !== undefined && res !== null && $ajv.resCheck(res) === false) {
      isError = true
      err = new Error(JSON.stringify({
        err: ajv.errorsText($ajv.resCheck.errors),
        res: res
      }))
    }

    if ($ajv.resCheckMap && Array.isArray(res) && Object.keys($ajv.resCheckMap).length >= res.length) {
      res.forEach((val, idx) => {
        if (!isError && val !== undefined && val !== null) {
          const resCheck = $ajv.resCheckMap[idx]
          if (resCheck(val) === false) {
            isError = true
            err = new Error(JSON.stringify({
              err: ajv.errorsText(resCheck.errors),
              resPos: idx
            }))
          }
        }
      })
    } else {
      isError = true
      err = new Error('return values length too large')
    }

    if (isError) {
      context.error(err)
      throw err
    }
    
    next()
  })

  done()
}, {
  name: 'beanify-ajv'
})
