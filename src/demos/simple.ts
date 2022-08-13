export default {
  name: 'Simple',
  schema: {
    description: 'A simple form example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: {
        title: 'firstName',
        type: 'string',
        default: 'Chuck',
      },
      lastName: {
        title: 'lastName',
        type: 'string',
      },
      telephone: {
        title: 'telephone',
        type: 'string',
        minLength: 10,
      },
      staticArray: {
        title: 'staticArray',
        type: 'array',
        items: [{ type: 'string' }, { type: 'number' }],
      },
      singleTypeArray: {
        type: 'array',
        items: {
          type: 'object',
          properties: { a: { type: 'string' }, b: { type: 'string' } },
        },
      },
    },
  },
  uiSchema: {
    title: 'A registration form',
    properties: {
      firstName: {
        title: 'First name',
      },
      lastName: {
        title: 'Last name',
      },
      telephone: {
        title: 'Telephone',
      },
    },
  },
  default: {
    firstName: 'Chuck',
    lastName: 'Norris',
    age: 75,
    bio: 'Roundhouse kicking asses since 1940',
    password: 'noneed',
    singleTypeArray: [{ a: 1, b: 2 }],
  },
}
