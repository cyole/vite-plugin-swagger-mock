import type { Plugin } from 'vite'
import type { Options } from './types'

export function viteMockServe(opt: Options = {
  openapi: 'src/openapi.yml',
}): Plugin {
  return {
    name: 'vite:mock',
    enforce: 'pre' as const,
  }
}

export * from './types'
