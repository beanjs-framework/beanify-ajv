import { Beanify, PluginDoneCallback, PluginOptions } from 'beanify'
import { Options, JSONSchemaType } from 'ajv'

export class AjvOptions extends PluginOptions {
  ajv?: Options
}

export interface AjvRouteOptions {
  attribute?: JSONSchemaType<Record<string, any>, true>

  body?: JSONSchemaType<
    | Record<string, any>
    | [Known, ...Known[]]
    | Known[]
    | number
    | string
    | boolean
    | null,
    true
  >

  response?: JSONSchemaType<
    | Record<string, any>
    | [Known, ...Known[]]
    | Known[]
    | number
    | string
    | boolean
    | null,
    true
  >
}

export type BeanifyAjv = (
  beanify: Beanify,
  opts: AjvOptions,
  done: PluginDoneCallback
) => Promise<void>
