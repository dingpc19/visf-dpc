import { CommonWidgetPropsDefine, CustomFormat } from '../../lib/types'
import { defineComponent } from 'vue'
import { createUseStyles } from 'vue-jss'
import { withFormItem } from '../../lib/theme-default/FormItem'
const useStyles = createUseStyles({
  input: {
    padding: 20,
    color: 'blue',
    fontSize: 30,
  },
})

const Renderer = withFormItem(
  defineComponent({
    name: 'ColorWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      function handleChange(e: any) {
        const inputVal = e.target.value
        e.target.value = props.value
        props.change(inputVal)
      }
      return () => {
        return (
          <>
            <input type="color" onInput={handleChange} value={props.value} />
            <div>color</div>
          </>
        )
      }
    },
  }),
)

const FormatPlugin: CustomFormat = {
  name: 'color',
  definition: { type: 'string', validate: /^#[0-9A-f]{6}$/ },
  component: Renderer,
}

export default FormatPlugin
