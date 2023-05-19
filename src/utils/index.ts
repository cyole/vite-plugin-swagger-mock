import { get } from 'lodash-es'
import type { OpenAPIV3 } from 'openapi-types'

type SchemaObject = OpenAPIV3.SchemaObject

export function transformSchemaRef(swagger: OpenAPIV3.Document, ref: string) {
  const propRoute = ref.slice(2).replace(/\//g, '.')
  const schema = get(swagger, propRoute) as SchemaObject
  switch (schema.type) {
    case 'object':
      for (const key in schema.properties) {
        const propItem = schema.properties[key]
        if ('$ref' in propItem)
          schema.properties[key] = transformSchemaRef(swagger, propItem.$ref)
        else if (propItem.type === 'array' && '$ref' in propItem.items)
          propItem.items = transformSchemaRef(swagger, propItem.items.$ref)
      }
      break
  }
  return schema as SchemaObject
}

// 递归schema，处理每个字段
export function schemaDeepMap(schema: SchemaObject,
  fn: (schemaItem: SchemaObject) => SchemaObject): SchemaObject {
  if (schema.type === 'object' && schema.properties) {
    const { properties } = schema || {}
    for (const key in properties) {
      const item = properties[key]
      schema.properties[key] = schemaDeepMap(item, fn)
    }
  }
  else if (schema.type === 'array' && schema.items) {
    schema.items = schemaDeepMap(schema.items, fn)
  }
  return fn(schema)
}
