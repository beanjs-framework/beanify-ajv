import { Beanify, PluginDoneCallback, PluginOptions } from 'beanify'
import { Options } from 'ajv'

export class AjvOptions extends PluginOptions {
  ajv?: Options
}

export interface AjvRouteOptions {
  body?: Record<string, unknown>
  attribute?: Record<string, unknown>
  response?: Record<string, unknown>
}

export type BeanifyAjv = (
  beanify: Beanify,
  opts: AjvOptions,
  done: PluginDoneCallback
) => Promise<void>
