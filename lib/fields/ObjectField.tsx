import { defineComponent } from 'vue'
import { FiledPropsDefine } from '../types'
import { useVJSFContext } from '../context'
import { isObject } from '../utils'
export default defineComponent({
  name: 'ObjectField',
  props: FiledPropsDefine,
  setup(props) {
    const context = useVJSFContext()
    const handleObjextFieldChange = (key: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {}
      if (v === undefined) {
        delete value[key]
      } else {
        value[key] = v
      }
      props.change(value)
    }
    return () => {
      const { schema, rootSchema, value, errorSchema, uiSchema } = props
      const { SchemaItem } = context
      const properties = schema.properties || {}
      const currentValue: any = isObject(value) ? value : {}
      return Object.keys(properties).map((k: string, index: number) => (
        <SchemaItem
          change={(v: any) => handleObjextFieldChange(k, v)}
          schema={properties[k]}
          rootSchema={rootSchema}
          value={currentValue[k]}
          key={index}
          uiSchema={uiSchema.properties ? uiSchema.properties[k] || {} : {}}
          errorSchema={errorSchema[k] || {}}
        ></SchemaItem>
      ))
    }
  },
})
