# beanify-ajv

[![Greenkeeper badge](https://badges.greenkeeper.io/beanjs-framework/beanify-ajv.svg)](https://greenkeeper.io/)

## install

```
npm i beanify-ajv
```

## usage 

```
const Beanify=require("beanify")
const beanifyPlugin=require("beanify-plugin")

const b=new Beanify({})

b
    .register(require("beanify-ajv"))
    .register(beanifyPlugin((beanify,opts,done)=>{
        beanify.route({
            url:'math.add',
            schema:{
                body:{
                    type:'object',
                    properties: {
                        a: { type: 'number' },
                        b: { type: 'number', default: 10 }
                    }
                },
                response:{
                    type:'number'
                }
            }
        },function ({body},res){
            res(null,body.a+body.b)
        })
        done()
    })).ready((err)=>{
        b.inject({
            url:'math.add',
            body:{
                a:1,
            }
        },function (err,res){
            console.log(res==11)

            b.close()
        })
    })


```