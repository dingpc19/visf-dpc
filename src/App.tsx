import SchemaForm from '../lib/SchemaForm'
import themeDefault from '../lib/theme-default'
import { Schema } from '../lib/types'
import { defineComponent, ref, Ref, reactive, watchEffect } from 'vue'
import { createUseStyles } from 'vue-jss'
import MonacoEditor from './components/MonacoEditor'
import demos from './demos'
import { ThemeProvider } from '../lib'
import customForm from './plugins/custom-formats'
import customKeyword from './plugins/customKeyword'
function toJson(data: any) {
  return JSON.stringify(data, null, 2)
}

const useStyles = createUseStyles({
  '@global': {
    body: {
      margin: 0,
      padding: 0,
    },
    '*': {
      boxSizing: 'border-box',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '1200px',
    margin: '0 auto',
  },
  menu: {
    marginBottom: 20,
    backgroundColor: '#3fb983',
    paddingTop: 20,
    minWidth: 1200,
    '& > h1': {
      textAlign: 'center',
      color: '#fff',
      fontSize: 60,
    },
  },
  code: {
    width: 700,
    flexShrink: 0,
  },
  codePanel: {
    minHeight: 400,
    marginBottom: 20,
  },
  uiAndValue: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > *': {
      width: '46%',
    },
  },
  content: {
    display: 'flex',
  },
  form: {
    padding: '0 20px',
    flexGrow: 1,
  },
  menuButton: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'inline-block',
    padding: 15,
    color: '#fff',
    borderRadius: 5,
    '& + &': {
      marginLeft: 15,
    },
    '&:hover': {
      background: '#fff',
      color: '#3fb983',
    },
  },
  menuSelected: {
    background: '#fff',
    color: '#3fb983',
    '&:hover': {
      background: '#fff',
      color: '#3fb983',
    },
  },
  menus: {
    width: 1200,
    padding: 20,
    margin: '0 auto',
  },
})

export default defineComponent({
  setup() {
    const selectedRef: Ref<number> = ref(0)
    const contextRef = ref()
    const demo: {
      schema: Schema | null
      data: any
      uiSchema: any
      schemaCode: string
      dataCode: string
      uiSchemaCode: string
      customValidate: ((d: any, e: any) => any) | undefined
    } = reactive({
      schema: null,
      data: {},
      uiSchema: {},
      schemaCode: '',
      dataCode: '',
      uiSchemaCode: '',
      customValidate: undefined,
    })

    watchEffect(() => {
      const index = selectedRef.value
      const d: any = demos[index]
      demo.schema = d.schema
      demo.data = d.default
      demo.uiSchema = d.uiSchema
      demo.schemaCode = toJson(d.schema)
      demo.dataCode = toJson(d.default)
      demo.uiSchemaCode = toJson(d.uiSchema)
      demo.customValidate = d.customValidate
    })

    const methodRef: Ref<any> = ref()

    const classesRef = useStyles()

    const handleChange = (v: any) => {
      demo.data = v
      demo.dataCode = toJson(v)
    }

    function handleCodeChange(
      filed: 'schema' | 'data' | 'uiSchema',
      value: string,
    ) {
      try {
        const json = JSON.parse(value)
        demo[filed] = json
        ;(demo as any)[`${filed}Code`] = value
      } catch (err) {
        console.log('err', err)
      }
    }

    const handleSchemaChange = (v: string) => handleCodeChange('schema', v)
    const handleDataChange = (v: string) => handleCodeChange('data', v)
    const handleUISchemaChange = (v: string) => handleCodeChange('uiSchema', v)

    const handleValidate = async () => {
      let a = await contextRef.value.doValidate()
      debugger
      const { valid, errors, errorSchema } = a
      console.log(valid, errors, errorSchema)
    }

    return () => {
      const classes = classesRef.value
      const selected = selectedRef.value

      console.log(methodRef)

      return (
        <div>
          <div class={classes.menu}>
            <h1>Vue3 JsonSchema Form</h1>
            <div class={classes.menus}>
              {demos.map((demo, index) => (
                <button
                  class={{
                    [classes.menuButton]: true,
                    [classes.menuSelected]: index === selected,
                  }}
                  onClick={() => (selectedRef.value = index)}
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>
          <div class={classes.container}>
            <div class={classes.content}>
              <div class={classes.code}>
                <MonacoEditor
                  code={demo.schemaCode}
                  class={classes.codePanel}
                  onChange={handleSchemaChange}
                  title="Schema"
                />
                <div class={classes.uiAndValue}>
                  <MonacoEditor
                    code={demo.uiSchemaCode}
                    class={classes.codePanel}
                    onChange={handleUISchemaChange}
                    title="UISchema"
                  />
                  <MonacoEditor
                    code={demo.dataCode}
                    class={classes.codePanel}
                    onChange={handleDataChange}
                    title="Value"
                  />
                </div>
              </div>
              <div class={classes.form}>
                <ThemeProvider theme={themeDefault}>
                  <SchemaForm
                    customFormats={customForm}
                    customKeywords={customKeyword}
                    schema={demo.schema!}
                    value={demo.data}
                    change={handleChange}
                    contextRef={contextRef}
                    customValidata={demo.customValidate}
                    uiSchema={demo.uiSchema || {}}
                  />
                </ThemeProvider>
                <div style={{ marginTop: '20px' }}>
                  <button onClick={handleValidate}>??????</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
})
