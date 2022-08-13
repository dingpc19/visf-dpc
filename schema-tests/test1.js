const Ajv = require('ajv')
// const addFormats = require('ajv-formats')
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
// addFormats(ajv)
ajv.addKeyword('test', {
  validate: function (schema, data) {
    console.log('schema', schema)
    console.log('data', data)
    return true
  },
})
const schema = {
  type: 'object',
  properties: {
    foo: { type: 'number', minimum: 50 },
    bar: { type: 'string', minLength: 5, format: 'email' },
  },
  required: ['foo'],
  additionalProperties: false,
}

const validate = ajv.compile(schema)

const data = {
  foo: 3,
  bar: 'abc1111@ee.com',
}

const valid = validate(data)
if (!valid) console.log(validate.errors)
