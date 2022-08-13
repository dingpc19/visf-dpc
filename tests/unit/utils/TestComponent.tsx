/*
 * @author: dingpengcheng
 * @since: 2022-08-10
 * TestComponent.tsx
 */

import { Schema } from '../../../lib/types'
import { defineComponent, PropType } from 'vue'
import JsonSchemaForm from '../../../lib'
import ThemeProvider from '../../../lib/theme'
import themeDefault from '../../../lib/theme-default'

export default defineComponent({
  name: 'TestComponent',
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
  },
  setup(props) {
    return () => {
      return (
        <ThemeProvider theme={themeDefault}>
          <JsonSchemaForm {...props}></JsonSchemaForm>
        </ThemeProvider>
      )
    }
  },
})
