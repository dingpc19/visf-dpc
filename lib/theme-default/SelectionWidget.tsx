/*
 * @author: dingpengcheng
 * @since: 2022-08-08
 * Selection.tsx
 */
import { SelectionWidgetPropsDefine } from '../types'
import { defineComponent, PropType, ref, toRef, toRefs, watch } from 'vue'
import { withFormItem } from './FormItem'
export default withFormItem(
  defineComponent({
    name: 'SelectionWidget',
    props: SelectionWidgetPropsDefine,
    setup(props) {
      const currentValueRef = ref(props.value)
      watch(currentValueRef, (newVal, oldValue) => {
        if (newVal !== props.value) {
          props.change(newVal)
        }
      })
      watch(
        () => props.value,
        (v) => {
          if (v !== currentValueRef.value) {
            currentValueRef.value = v
          }
        },
      )

      return () => {
        return (
          <select multiple={true} v-model={currentValueRef.value}>
            {props.options.map((op) => {
              return <option value={op.value}>{op.key}</option>
            })}
          </select>
        )
      }
    },
  }),
)
