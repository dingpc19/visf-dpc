import { computed, defineComponent, PropType, toRefs } from 'vue'
import { FiledPropsDefine, SchemaTypes } from './types'
import StringField from './fields/StringField'
import NumberField from './fields/NumberField'
import { retrieveSchema } from './utils'
import ObjectField from './fields/ObjectField'
import ArrayField from './fields/ArrayField'
import { useVJSFContext } from './context'
export default defineComponent({
  props: FiledPropsDefine,
  name: 'SchemaForm',
  setup(props) {
    const formContext = useVJSFContext()
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      return formContext.transformSchemaRef.value(
        retrieveSchema(schema, rootSchema, value),
      )
    })

    return () => {
      const { schema } = props
      const type = schema.type
      let Component: any
      switch (type) {
        case SchemaTypes.STRING:
          Component = StringField
          break
        case SchemaTypes.NUMBER:
          Component = NumberField
          break
        case SchemaTypes.OBJECT:
          Component = ObjectField
          break
        case SchemaTypes.ARRAY:
          Component = ArrayField
          break
        default:
          break
      }
      const retrievedSchema = retrievedSchemaRef.value
      return <Component {...props} schema={retrievedSchema}></Component>
    }
  },
})
