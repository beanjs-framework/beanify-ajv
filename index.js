const beanifyPlugin = require("beanify-plugin")
const AJV = require("ajv")

module.exports = beanifyPlugin((beanify, opts, done) => {
    opts.ajv = opts.ajv || {}
    opts.ajv.useDefaults = true
    const ajv = new AJV(opts.ajv)

    beanify.addHook('onRoute', ({ route, log }, next) => {
        const { schema } = route.$options

        if (schema) {

            const bodySchema = schema.body
            const responseSchema = schema.response
            route.$validation = {
            }

            if (bodySchema) {
                route.$validation.body = ajv.compile(bodySchema)
            }

            if (responseSchema) {
                route.$validation.response = ajv.compile(responseSchema)
            }

        }

        next()
    })

    beanify.addHook('onHandler', ({ context, req, log }, next) => {

        const { $validation } = context

        if ($validation && $validation.body && typeof $validation.body === 'function' && $validation.body(req.body) === false) {
            const err = new Error(ajv.errorsText($validation.body.errors), {
                body: req.body
            })
            err.validation = $validation.body.errors

            throw err;
        }

        next()
    })

    beanify.addHook('onAfterHandler', ({ context, res, log }, next) => {

        const { $validation } = context

        if ($validation && $validation.response && typeof $validation.response === 'function' && $validation.response(res) === false) {
            const err = new Error(ajv.errorsText($validation.response.errors), {
                response: res
            })
            err.validation = $validation.response.errors

            throw err;
        }


        next()
    })

    done()
}, {
    name: 'beanify-ajv'
})