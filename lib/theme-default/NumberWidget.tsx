/*
 * @author: dingpengcheng
 * @since: 2022-08-10
 * NumberWidget.tsx
 */

import { CommonWidgetPropsDefine } from '../types'
import { defineComponent } from 'vue'
import { withFormItem } from './FormItem'
export default withFormItem(
  defineComponent({
    name: 'NumberWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      function handleChange(e: any) {
        const value = e.target.value
        const num = Number(value)
        e.target.value = props.value
        if (Number.isNaN(num)) {
          props.change(undefined)
        } else {
          props.change(num)
        }
      }
      return () => {
        return (
          <input type="number" onInput={handleChange} value={props.value} />
        )
      }
    },
  }),
)
