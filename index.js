const AJV = require('ajv').default
const kBeanifyAjv = Symbol.for('beanify.ajv')

function buildAjvErrorsMsg (name, errs) {
  return errs
    .map(e => {
      return `position: [${name}] schema path: [${e.schemaPath}] message: ${e.message}`
    })
    .join('\n')
}

function verification (name, schema, val) {
  const ajv = this.$beanify[kBeanifyAjv]
  const verification = ajv.compile(schema)
  if (!verification(val)) {
    throw new Error(buildAjvErrorsMsg(name, verification.errors))
  }
}

module.exports = async function (beanify, opts) {
  beanify[kBeanifyAjv] = new AJV(opts.ajv)
  beanify.addHook('onBeforeHandler', async function (req, rep) {
    const schema = this.schema || {}

    if (schema.body) {
      verification.call(this, 'body', schema.body, req.body)
    }

    if (schema.attribute) {
      verification.call(this, 'attribute', schema.attribute, this.$attribute)
    }
  })
  beanify.addHook('onAfterHandler', function (req, rep) {
    const schema = this.schema || {}

    if (schema.response && !rep.$sent) {
      verification.call(this, 'response', schema.response, rep.$data)
    }
  })
}
