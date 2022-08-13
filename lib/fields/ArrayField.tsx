/*
 * @author: dingpengcheng
 * @since: 2022-08-08
 * ArrayField.tsx
 */
import { defineComponent, PropType } from 'vue'
import { createUseStyles } from 'vue-jss'
import { useVJSFContext } from '../context'
import {
  FiledPropsDefine,
  Schema,
  SelectionWidgetNames,
  UISchema,
} from '../types'
import { getWidget } from '../theme'
const useStyles = createUseStyles({
  container: {
    border: '1px solid #eee',
  },
  actions: {
    background: '#eee',
    padding: 10,
    textAlign: 'right',
  },
  action: {
    '& + &': {
      marginLeft: 10,
    },
  },
  content: {
    padding: 10,
  },
})
const ArrayItemWrapper = defineComponent({
  name: 'ArrayItemWrapper',
  props: {
    add: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    delete: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    up: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    down: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    index: { type: Number, required: true },
  },
  setup(props, { slots }) {
    const classRef = useStyles()

    return () => {
      const classes = classRef.value
      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button
              class={classes.action}
              onClick={() => props.add(props.index)}
            >
              新增
            </button>
            <button
              class={classes.action}
              onClick={() => props.delete(props.index)}
            >
              删除
            </button>
            <button
              class={classes.action}
              onClick={() => props.up(props.index)}
            >
              上移
            </button>
            <button
              class={classes.action}
              onClick={() => props.down(props.index)}
            >
              下移
            </button>
          </div>
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      )
    }
  },
})

export default defineComponent({
  name: 'ArrayField',
  props: FiledPropsDefine,
  setup(props) {
    const context = useVJSFContext()
    const handleArrayItemChange = (v: any, index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      arr[index] = v
      props.change(arr)
    }
    const handleAdd = (index: number) => {
      const { value } = props
      debugger
      const arr = Array.isArray(value) ? value : []
      arr.splice(index + 1, 0, undefined)
      props.change(arr)
    }
    const handleDelete = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      arr.splice(index, 1)
      props.change(arr)
    }
    const handleUp = (index: number) => {
      if (index > 0) {
        const { value } = props
        const arr = Array.isArray(value) ? value : []
        arr.splice(index - 1, 0, arr.splice(index, 1)[0])
        props.change(arr)
      }
    }
    const handleDown = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []
      if (index < arr.length - 1) {
        arr.splice(index + 1, 0, arr.splice(index, 1)[0])
      }
      props.change(arr)
    }
    const SelectionWidgetRef = getWidget(SelectionWidgetNames.SelectionWidget)
    return () => {
      const SchemaItem = context.SchemaItem
      const SelectionWidget = SelectionWidgetRef.value
      const { schema, value, rootSchema, errorSchema, uiSchema } = props
      const isMultiType = Array.isArray(schema.items)
      const isSelect = schema.items && (schema.items as any).enum
      if (isMultiType) {
        const items: Schema[] = schema.items as any
        const arr = Array.isArray(value) ? value : []
        return items.map((s: Schema, index: number) => {
          const uiSchemaItems = uiSchema.items
          const us = Array.isArray(uiSchemaItems)
            ? uiSchemaItems[index] || {}
            : uiSchemaItems || {}
          return (
            <SchemaItem
              schema={s}
              rootSchema={rootSchema}
              key={index}
              value={arr[index]}
              change={(v: any) => handleArrayItemChange(v, index)}
              uiSchema={us}
              errorSchema={errorSchema[index] || {}}
            ></SchemaItem>
          )
        })
      } else if (!isSelect) {
        const arr = Array.isArray(value) ? value : []
        return arr.map((v: any, index: number) => {
          return (
            <ArrayItemWrapper
              index={index}
              add={handleAdd}
              delete={handleDelete}
              down={handleDown}
              up={handleUp}
            >
              <SchemaItem
                schema={schema.items as Schema}
                rootSchema={rootSchema}
                key={index}
                value={v}
                change={(v: any) => handleArrayItemChange(v, index)}
                uiSchema={(uiSchema.items as UISchema) || {}}
                errorSchema={errorSchema[index] || {}}
              ></SchemaItem>
            </ArrayItemWrapper>
          )
        })
      } else {
        //加载有枚举的数组schema
        const enumOptions = (schema as any).items.enum
        const options = enumOptions.map((op: any) => ({
          key: op,
          value: op,
        }))
        return (
          <SelectionWidget
            schema={schema}
            value={value}
            change={props.change}
            options={options}
            errors={errorSchema.__errors || []}
          ></SelectionWidget>
        )
      }
    }
  },
})
