/*
 * @author: dingpengcheng
 * @since: 2022-08-10
 * theme.tsx
 */

import {
  computed,
  ComputedRef,
  defineComponent,
  ExtractPropTypes,
  inject,
  PropType,
  provide,
  ref,
  Ref,
} from 'vue'
import {
  Theme,
  SelectionWidgetNames,
  WidgetComponentDefineNames,
  UISchema,
  WidgetComponentType,
  WidgetComponentDefine,
  SelectionWidgetDefine,
  FiledPropsDefine,
} from './types'
import { isObject } from './utils'
import { useVJSFContext } from './context'
const THEME_PROVIDE_KEY = Symbol()
const ThemeProvider = defineComponent({
  name: 'VJSFThemeProvider',
  props: {
    theme: {
      type: Object as PropType<Theme>,
    },
  },
  setup(props, { slots }) {
    const context = computed(() => props.theme)
    provide(THEME_PROVIDE_KEY, context)
    return () => {
      return <div>{slots.default && slots.default()}</div>
    }
  },
})
export function getWidget<
  T extends SelectionWidgetNames | WidgetComponentDefineNames,
>(name: T, props?: ExtractPropTypes<typeof FiledPropsDefine>) {
  const formContext = useVJSFContext()
  if (props) {
    const { uiSchema, schema } = props
    if (uiSchema?.widget && isObject(uiSchema.widget)) {
      return ref(uiSchema.widget as WidgetComponentDefine)
    }
    debugger
    if (schema.format) {
      if (formContext.formatMapRef.value[schema.format]) {
        return ref(formContext.formatMapRef.value[schema.format])
      }
    }
  }

  const context: Ref<Theme> | undefined =
    inject<ComputedRef<Theme>>(THEME_PROVIDE_KEY)
  if (!context) {
    throw new Error('vjsf theme required')
  }
  const widgetRef = computed(() => {
    return context.value.widgets[name]
  })
  return widgetRef as any
}
export default ThemeProvider
