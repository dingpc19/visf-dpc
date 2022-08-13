import { FiledPropsDefine, WidgetComponentDefineNames } from '../types'
import { defineComponent } from 'vue'
import { getWidget } from '../theme'
export default defineComponent({
  name: 'NumberField',
  props: FiledPropsDefine,
  setup(props) {
    const NumberWidgetRef = getWidget(WidgetComponentDefineNames.NumberWidget)
    return () => {
      const { rootSchema, errorSchema, ...rest } = props
      const NumberWidget = NumberWidgetRef.value
      return (
        <NumberWidget {...rest} errors={errorSchema.__errors}></NumberWidget>
      )
    }
  },
})
