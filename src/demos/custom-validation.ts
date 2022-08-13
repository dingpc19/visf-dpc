import PasswordWidget from '@/components/PasswordWidget'

export default {
  name: 'Custom validation',
  schema: {
    title: 'Custom validation',
    description:
      'This form defines custom validation rules checking that the two passwords match.',
    type: 'object',
    properties: {
      pass1: {
        title: 'Password',
        type: 'string',
        test: true,
      },
      pass2: {
        title: 'Repeat password',
        type: 'string',
        minLength: 3,
      },
      age: {
        title: 'Age',
        type: 'number',
        minimum: 18,
      },
      color: {
        title: 'input color',
        type: 'string',
        format: 'color',
      },
    },
  },
  uiSchema: {
    properties: {
      pass1: {
        widget: PasswordWidget,
      },
      pass2: {
        color: 'red',
      },
    },
  },
  async customValidate(data: any, errors: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (data.pass1 !== data.pass2) {
          errors.pass2.addError('Passwords should match')
        }
        console.log('data.pass1', data.pass1)
        console.log('data.pass2', data.pass2)
        resolve({})
      }, 2000)
    })
  },
}
