const { default: AJV } = require('ajv')
const kBeanifyAjv = Symbol('beanify.ajv')

const kAjvParams = Symbol('ajv.params')
const kAjvBody = Symbol('ajv.body')
const kAjvAttribute = Symbol('ajv.attribute')
const kAjvResponse = Symbol('ajv.response')

function buildAjvErrorsMsg (name, errs) {
  return errs
    .map(e => {
      return `position: [${name}] schema path: [${e.schemaPath}] message: ${e.message}`
    })
    .join('\n')
}

function verification (name, verifyCall, val) {
  if (!verifyCall(val)) {
    throw new Error(buildAjvErrorsMsg(name, verifyCall.errors))
  }
}

module.exports = async function (beanify, opts) {
  beanify[kBeanifyAjv] = new AJV(opts.ajv)

  beanify.addHook('onRoute', function (route) {
    const ajv = route.$beanify[kBeanifyAjv]
    const schema = route.schema || {}
    if (schema.params) {
      route[kAjvParams] = ajv.compile(schema.params)
    }
    if (schema.body) {
      route[kAjvBody] = ajv.compile(schema.body)
    }
    if (schema.attribute) {
      route[kAjvAttribute] = ajv.compile(schema.attribute)
    }
    if (schema.response) {
      route[kAjvResponse] = ajv.compile(schema.response)
    }
  })

  beanify.addHook('onBeforeHandler', async function (req, rep) {
    if (this[kAjvParams]) {
      verification('params', this[kAjvParams], req.params)
    }

    if (this[kAjvBody]) {
      verification('body', this[kAjvBody], req.body)
    }

    if (this[kAjvAttribute]) {
      verification('attribute', this[kAjvAttribute], this.$attribute)
    }
  })
  beanify.addHook('onAfterHandler', function (req, rep) {
    if (this[kAjvResponse] && rep.$data) {
      verification('response', this[kAjvResponse], rep.$data)
    }
  })
}
