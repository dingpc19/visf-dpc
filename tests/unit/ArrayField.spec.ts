import { mount } from '@vue/test-utils'
import { NumberField, StringField, ArrayField } from '../../lib'
import TestComponent from './utils/TestComponent'
describe('ArrayField', () => {
  it('should render muti type', async () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }],
        },
        rootSchema: {},
        value: {},
        change: () => {},
      },
    })
    const arrayField = wrapper.findComponent(ArrayField)
    expect(arrayField.exists()).toBeTruthy()
    const stringField = arrayField.findComponent(StringField)
    expect(stringField.exists()).toBeTruthy()
    const numberField = arrayField.findComponent(NumberField)
    expect(numberField.exists()).toBeTruthy()
  })

  it('should render single type', async () => {
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: 'array',
          items: { type: 'string' },
        },
        rootSchema: {},
        value: ['1', '2'],
        change: () => {},
      },
    })
    const arrayField = wrapper.findComponent(ArrayField)
    expect(arrayField.exists()).toBeTruthy()
    const stringFields = arrayField.findAllComponents(StringField)
    expect(stringFields.length).toBe(2)
    expect(stringFields[0].props('value')).toBe('1')
  })
  it('should render select type', async () => {
    let value: string[] = ['1', '2']
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: 'array',
          items: { type: 'string', enum: ['1', '2', '3'] },
        },
        rootSchema: {},
        value: value,
        change: (v: any) => {
          value = value
        },
      },
    })
    // const selectionField = wrapper.findComponent(SelectionField)
    // expect(selectionField.exists()).toBeTruthy()
  })
})
