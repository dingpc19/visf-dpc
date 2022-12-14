/*
 * @author: dingpengcheng
 * @since: 2022-08-12
 * FormItem.tsx
 */

import { defineComponent } from 'vue'
import { createUseStyles } from 'vue-jss'
import { CommonWidgetPropsDefine } from '../types'

const useStyles = createUseStyles({
  container: {},
  label: {
    display: 'block',
    color: '#777',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    margin: '5px',
    padding: 0,
    paddingLeft: 20,
  },
})
const FormItem = defineComponent({
  name: 'FormItem',
  props: CommonWidgetPropsDefine,
  setup(props, { slots }) {
    const classesRef = useStyles()
    return () => {
      const classes = classesRef.value
      return (
        <div class={classes.container}>
          <label class={classes.label}>{props.schema.title}</label>
          {slots.default && slots.default()}
          <ul class={classes.errorText}>
            {props.errors?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )
    }
  },
})
export default FormItem

export function withFormItem(Widget: any) {
  return defineComponent({
    name: `Wrapped${Widget.name}`,
    props: CommonWidgetPropsDefine,
    setup(props, { attrs }) {
      return () => {
        return (
          <FormItem {...props}>
            <Widget {...props} {...attrs}></Widget>
          </FormItem>
        )
      }
    },
  }) as any
}
