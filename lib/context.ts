import { inject, Ref } from 'vue'
import { CommonFieldType, Schema, WidgetComponentDefine } from './types'

export const SchemaFormContextKey = Symbol()

export function useVJSFContext() {
  const context:
    | {
        SchemaItem: CommonFieldType
        formatMapRef: Ref<{ [key: string]: WidgetComponentDefine }>
        transformSchemaRef: Ref<(schema: Schema) => Schema>
      }
    | undefined = inject(SchemaFormContextKey)
  if (!context) {
    throw Error('SchemaForm should be used')
  }
  return context
}
