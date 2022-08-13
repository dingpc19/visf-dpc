/*
 * @author: dingpengcheng
 * @since: 2022-08-10
 * StringFeild.tsx
 */

import { FiledPropsDefine } from '../../lib/types'
import { computed, defineComponent } from 'vue'
import { getWidget } from '../theme'
import { WidgetComponentDefineNames } from '../types'
export default defineComponent({
  name: 'StringFeild',
  props: FiledPropsDefine,
  setup(props) {
    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(WidgetComponentDefineNames.TextWidget, props)
      return widgetRef.value
    })

    const widgetOptionsRef = computed(() => {
      const { widget, properties, items, ...rest } = props.uiSchema
      return rest
    })

    return () => {
      const { rootSchema, errorSchema, ...rest } = props
      const TextWidget = TextWidgetRef.value
      return (
        <TextWidget
          {...rest}
          errors={errorSchema.__errors || []}
          options={widgetOptionsRef.value}
        ></TextWidget>
      )
    }
  },
})
