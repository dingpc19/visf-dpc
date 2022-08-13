import { mount } from '@vue/test-utils'
import { NumberField, StringField } from '../../lib'
import TestComponent from './utils/TestComponent'
describe('ObejctField', () => {
  let schema: any
  beforeEach(() => {
    schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
    }
  })
  it('should render properties to correct fields', async () => {
    let value = ''
    const wrapper = mount(TestComponent, {
      props: {
        schema,
        rootSchema: {},
        value: {},
        change: () => {},
      },
    })
    const numberField = wrapper.findComponent(NumberField)
    expect(numberField.exists()).toBeTruthy()
    const stringField = wrapper.findComponent(StringField)
    expect(stringField.exists()).toBeTruthy()
  })

  it('should changeValue when sub fields trigger onchange', async () => {
    let value: any = {}
    const wrapper = mount(TestComponent, {
      props: {
        schema,
        rootSchema: {},
        value: value,
        change: (v: any) => {
          value = v
        },
      },
    })
    const numberField = wrapper.findComponent(NumberField)
    numberField.props('change')(1)
    expect(value.age).toBe(1)
    const stringField = wrapper.findComponent(StringField)
    stringField.props('change')('2')
    expect(value.name).toBe('2')
  })
  it('should changeValue when sub fields trigger onchange and value is undefiend', async () => {
    let value: any = { age: 12 }
    const wrapper = mount(TestComponent, {
      props: {
        schema,
        rootSchema: {},
        value: value,
        change: (v: any) => {
          value = v
        },
      },
    })
    const numberField = wrapper.findComponent(NumberField)
    numberField.props('change')(undefined)
    expect(value.age).toBeUndefined()
  })
})
