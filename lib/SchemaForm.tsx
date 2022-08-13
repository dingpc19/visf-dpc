import {
  computed,
  defineComponent,
  PropType,
  provide,
  reactive,
  ref,
  Ref,
  shallowRef,
  watch,
  watchEffect,
} from 'vue'
import SchemaItem from './SchemaItem'
import {
  CustomFormat,
  CustomKeyword,
  Schema,
  Theme,
  UISchema,
  WidgetComponentDefine,
} from './types'
import { SchemaFormContextKey } from './context'
import Ajv, { Options } from 'ajv'
import { validateFormData, ErrorSchema } from './validator'
interface ContextRef {
  doValidate: () => Promise<{
    errors: any[]
    isValid: boolean
  }>
}
const defaultAjvOptions: Options = {
  allErrors: true,
  jsonPointers: false,
}
export default defineComponent({
  name: 'SchemaForm',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    change: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    value: {
      required: true,
    },
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>,
    },
    ajvOPtions: {
      type: Object as PropType<Options>,
    },
    locale: {
      type: String,
      default: 'zh',
    },
    customValidata: {
      type: Function as PropType<(data: any, errors: any) => void> | undefined,
    },
    uiSchema: {
      type: Object as PropType<UISchema>,
    },
    customFormats: {
      type: [Array, Object] as PropType<CustomFormat[] | CustomFormat>,
    },
    customKeywords: {
      type: [Array, Object] as PropType<CustomKeyword[] | CustomKeyword>,
    },
    // theme: {
    //   type: Object as PropType<Theme>,
    //   required: true,
    // },
  },
  setup(props) {
    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})
    const validateResolveRef = ref()
    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) {
          doValidate()
        }
      },
      { deep: true },
    )
    const validateIndex = ref(0)
    async function doValidate() {
      const index = (validateIndex.value += 0)
      const result = await validateFormData(
        validatorRef.value,
        props.value,
        props.schema,
        props.locale,
        props.customValidata,
      )
      if (index !== validateIndex.value) {
        return
      }
      errorSchemaRef.value = result.errorSchema
      validateResolveRef.value(result)
      validateResolveRef.value = undefined
    }
    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOPtions,
      })
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        customFormats.forEach((format) => {
          validatorRef.value.addFormat(format.name, format.definition)
        })
      }
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]
        customKeywords.forEach((keyword) => {
          validatorRef.value.addKeyword(keyword.name, keyword.definition)
        })
      }
    })
    watch(
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              return new Promise((resolve) => {
                validateResolveRef.value = resolve
                doValidate()
              })
            },
          }
        }
      },
      { immediate: true },
    )

    const handleChange = (v: any) => {
      props.change(v)
    }
    const formatMapRef = computed(() => {
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        return customFormats.reduce((result, format) => {
          result[format.name] = format.component
          return result
        }, {} as { [key: string]: WidgetComponentDefine })
      }
      return {}
    })

    const transformSchemaRef = computed(() => {
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]

        return (schema: Schema) => {
          let newSchema = schema
          customKeywords.forEach((keyword) => {
            if (schema[keyword.name]) {
              newSchema = keyword.transformSchema(newSchema)
            }
          })
          return newSchema
        }
      } else {
        return (schema: Schema) => schema
      }
    })

    const context = { SchemaItem, formatMapRef, transformSchemaRef }
    provide(SchemaFormContextKey, context)
    return () => {
      const { schema, value, customValidata, uiSchema } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          change={handleChange}
          uiSchema={uiSchema || {}}
          errorSchema={errorSchemaRef.value || {}}
          customValidata={customValidata}
        ></SchemaItem>
      )
    }
  },
})
