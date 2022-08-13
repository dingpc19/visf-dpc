/*
 * @author: dingpengcheng
 * @since: 2022-08-10
 * TextWidget.tsx
 */

import { CommonWidgetPropsDefine } from '../../lib/types'
import { computed, defineComponent } from 'vue'
import { withFormItem } from './FormItem'
export default withFormItem(
  defineComponent({
    name: 'TextWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      function handleChange(e: any) {
        const inputVal = e.target.value
        e.target.value = props.value
        props.change(inputVal)
      }
      const styleRef = computed(() => {
        return {
          color: props.options?.color || '#ccc',
        }
      })
      return () => {
        return (
          <input
            type="text"
            style={styleRef.value}
            onInput={handleChange}
            value={props.value}
          />
        )
      }
    },
  }),
)
