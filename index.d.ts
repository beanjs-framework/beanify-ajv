import { Beanify } from 'beanify'

import { BeanifyAjv, AjvOptions, AjvRouteOptions } from './types/options'

declare const ajv: BeanifyAjv

export = ajv
export { AjvRouteOptions } from './types/options'

declare module 'beanify' {
  interface BeanifyPlugin {
    (plugin: BeanifyAjv, opts: AjvOptions): Beanify
  }

  interface Route {
    schema?: AjvRouteOptions
  }
}
