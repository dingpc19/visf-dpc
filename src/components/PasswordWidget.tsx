/*
 * @author: dingpengcheng
 * @since: 2022-08-10
 * PasswordWidget.tsx
 */

import { CommonWidgetPropsDefine } from '../../lib/types'
import { defineComponent } from 'vue'
import { withFormItem } from '../../lib/theme-default/FormItem'
export default withFormItem(
  defineComponent({
    name: 'PasswordWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      function handleChange(e: any) {
        const inputVal = e.target.value
        e.target.value = props.value
        props.change(inputVal)
      }
      return () => {
        return (
          <input type="password" onInput={handleChange} value={props.value} />
        )
      }
    },
  }),
)
