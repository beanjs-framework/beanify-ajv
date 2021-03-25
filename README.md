# beanify-ajv

Used to verify `req.body`, `route.$attribute` parameter structure and `rep.$data` return results

## Install

```bash
npm i beanify-ajv --save
```

with yarn

```bash
yarn add beanify-ajv
```

## Usage

```javascript
const Beanify = require('beanify')
const Ajv = require('beanify-ajv')
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
```

## Options

- `ajv`: used to configure `AJV` instance.check [here](https://github.com/ajv-validator/ajv/blob/master/docs/api.md#options)

## Route Decorators

- `schema`:
  - `params`: to check `req.params` field.check [here](https://json-schema.org/)
  - `body`: to check `req.body` field.check [here](https://json-schema.org/)
  - `attribute`: to check `route.$attribute` field.check [here](https://json-schema.org/)
  - `response`: to check `rep.$data` field.check [here](https://json-schema.org/)
