import {
  ComponentPublicInstance,
  DefineComponent,
  ExtractPropTypes,
  PropType,
} from 'vue'
import { ErrorSchema } from './validator'

import {
  CompilationContext,
  FormatDefinition,
  KeywordDefinition,
  SchemaValidateFunction,
  ValidateFunction,
} from 'ajv'

export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean',
}

// type SchemaTypes =
//   | 'number'
//   | 'string'
//   | 'integer'
//   | 'object'
//   | 'array'
//   | 'boolean'

export interface VueJsonSchemaConfig {
  title?: string
  descrription?: string
  component?: string
  options?: {
    [key: string]: any
  }
  withFormItem?: boolean
  widget?: 'checkbox' | 'textarea' | 'select' | 'radio' | 'range' | string
  // items?: UISchema | UISchema[]
  propertiesOrder?: string[]
  controls?: {
    sortable?: boolean
    removeable?: boolean
    addable?: boolean
  }
}

type SchemaRef = { $ref: string }

// export type Schema = (JSONSchema6 | JSONSchema7) & {
//   enumNames?: (string | number)[]
//   vjsf?: VueJsonSchemaConfig
// }

// type Schema = any
export interface Schema {
  type?: SchemaTypes | string
  const?: any
  format?: string

  title?: string
  default?: any

  properties?: {
    [key: string]: Schema
  }
  items?: Schema | Schema[] | SchemaRef
  uniqueItems?: any
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef
  }
  oneOf?: Schema[]
  anyOf?: Schema[]
  allOf?: Schema[]
  vjsf?: VueJsonSchemaConfig
  required?: string[]
  enum?: any[]
  enumNames?: any[]
  enumKeyValue?: any[]
  additionalProperties?: any
  additionalItems?: Schema

  minLength?: number
  maxLength?: number
  minimun?: number
  maximum?: number
  multipleOf?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
}

export const FiledPropsDefine = {
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
  rootSchema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true,
  },
  customValidata: {
    type: Function as PropType<(data: any, errors: any) => void>,
  },
  uiSchema: {
    type: Object as PropType<UISchema>,
    required: true,
  },
} as const

export type CommonFieldType = DefineComponent<typeof FiledPropsDefine, {}, {}>

export const CommonWidgetPropsDefine = {
  value: {},
  change: { type: Function as PropType<(v: any) => void>, required: true },
  errors: {
    type: Array as PropType<string[]>,
  },
  schema: { type: Object as PropType<Schema>, required: true },
  options: { type: Object as PropType<{ [key: string]: any }> },
} as const

export type WidgetComponentType = ComponentPublicInstance<
  ExtractPropTypes<typeof CommonWidgetPropsDefine>
>
export type WidgetComponentDefine =
  ComponentPublicInstanceConstructor<WidgetComponentType>

export const SelectionWidgetPropsDefine = {
  ...CommonWidgetPropsDefine,
  options: {
    type: Array as PropType<{ key: any; value: any }[]>,
    required: true,
  },
} as const

export type SelectionWidgetComponentType = ComponentPublicInstance<
  ExtractPropTypes<typeof SelectionWidgetPropsDefine>
>
export type SelectionWidgetDefine =
  ComponentPublicInstanceConstructor<SelectionWidgetComponentType>

declare type ComponentPublicInstanceConstructor<
  T extends ComponentPublicInstance,
> = {
  new (): T
}

export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetDefine
    [WidgetComponentDefineNames.TextWidget]: WidgetComponentDefine
    [WidgetComponentDefineNames.NumberWidget]: WidgetComponentDefine
  }
}

export enum SelectionWidgetNames {
  SelectionWidget = 'SelectionWidget',
}
export enum WidgetComponentDefineNames {
  TextWidget = 'TextWidget',
  NumberWidget = 'NumberWidget',
}

export type UISchema = {
  widget?: string | WidgetComponentDefine
  properties?: {
    [key: string]: UISchema
  }
  items?: UISchema | UISchema[]
} & {
  [key: string]: any
}

export interface CustomFormat {
  name: string
  definition: FormatDefinition
  component: WidgetComponentDefine
}

export interface VjsfKeywordDefinition {
  type?: string | Array<string>
  async?: boolean
  $data?: boolean
  errors?: boolean | string
  metaSchema?: object
  // schema: false makes validate not to expect schema (ValidateFunction)
  schema?: boolean
  statements?: boolean
  dependencies?: Array<string>
  modifying?: boolean
  valid?: boolean
  // one and only one of the following properties should be present
  validate?: SchemaValidateFunction | ValidateFunction

  macro: (
    schema: any,
    parentSchema: object,
    it: CompilationContext,
  ) => object | boolean
}

export interface CustomKeyword {
  name: string
  definition: VjsfKeywordDefinition
  transformSchema: (originSchema: Schema) => Schema
}

// // export interface UISchemaNest {
// //   [property: string]: UISchema
// // }

// declare type ComponentPublicInstanceConstructor<
//   T extends ComponentPublicInstance,
// > = {
//   new (): T
// }

// export interface UISchema extends VueJsonSchemaConfig {
//   properties?: {
//     [property: string]: UISchema
//   }
// }

// export interface CustomFormat extends AjvFormat {
//   component: ComponentPublicInstanceConstructor<
//     ComponentPublicInstance<ExtractPropTypes<typeof CommonWidgetPropsDefine>>
//   >
// }

// export interface CustomKeyword extends AjvKeyword {
//   transformSchema?: (originSchema: Schema) => Schema
// }

// export interface JsonSchemFormPlugin {
//   customFormats?: CustomFormat[] | CustomFormat
//   customKeywords?: CustomKeyword[] | CustomKeyword
// }

// // export interface A extends ComponentObjectPropsOptions {
// //   path: Prop<string>
// //   value: Prop<any>
// //   schema: Prop<Schema>
// //   rootSchema: Prop<Schema>
// //   uiSchema: Prop<UISchema>
// //   onChange: Prop<(value: any) => void>
// //   requiredError: Prop<boolean>
// //   required: Prop<boolean>
// // }

// // fix error TS2456: Type alias 'ErrorSchema' circularly references itself
// interface ErrorSchemaObject {
//   [level: string]: ErrorSchema
// }

// export type ErrorSchema = ErrorSchemaObject & {
//   __errors: string[]
// }

// export const CommonPropsDefine = {
//   id: {
//     type: String as PropType<string>,
//     required: true,
//   },
//   path: {
//     type: String as PropType<string>,
//     required: true,
//   },
//   value: {
//     required: true,
//   },
//   schema: {
//     type: Object as PropType<Schema>,
//     required: true,
//   },
//   rootSchema: {
//     type: Object as PropType<Schema>,
//     required: true,
//   },
//   uiSchema: {
//     type: Object as PropType<UISchema>,
//     required: true,
//   },
//   onChange: {
//     type: Function as PropType<(value: any) => void>,
//     required: true,
//   },
//   // requiredError: {
//   //   type: Boolean as PropType<boolean>,
//   //   required: true,
//   // },
//   required: {
//     type: Boolean as PropType<boolean>,
//     required: true,
//   },
//   isDependenciesKey: {
//     type: Boolean as PropType<boolean>,
//     required: true,
//   },
// } as const

// export const CommonFieldPropsDefine = {
//   ...CommonPropsDefine,
//   errorSchema: {
//     type: Object as PropType<ErrorSchema>,
//     required: true,
//   },
// } as const

// export interface WidgetOptions {
//   enumOptions?: {
//     key: string
//     value: string | number | boolean
//   }[]
//   // widget?: string | WidgetComponentDefine
//   disabled?: boolean
//   readonly?: boolean
//   // TODO: can be component
//   description?: string | VNodeChild
//   multiple?: boolean
// }
// export const CommonWidgetPropsDefine = {
//   ...CommonPropsDefine,
//   title: {
//     type: String as PropType<string>,
//     required: true,
//   },
//   errors: {
//     type: Array as PropType<string[]>,
//   },
//   options: {
//     type: Object as PropType<WidgetOptions>,
//     required: true,
//   },
// } as const

// export const SchemaFormPropsDefine = {
//   schema: {
//     type: Object as PropType<Schema>,
//     required: true,
//   },
//   uiSchema: {
//     type: Object as PropType<UISchema>,
//   },
//   value: {
//     type: [String, Number, Boolean, Object, Array] as PropType<any>,
//   },
//   onChange: {
//     type: Function as PropType<(value: any) => void>,
//     required: true,
//   },
//   formProps: {
//     type: Object as PropType<{ [key: string]: any }>,
//   },
//   plugins: {
//     type: Array as PropType<JsonSchemFormPlugin[] | JsonSchemFormPlugin>,
//   },
//   locale: {
//     type: String as PropType<string>,
//     default: 'zh',
//   },
//   ajvInstanceOptions: {
//     type: Object as PropType<AjvOptions>,
//   },
//   /**
//    * use this to provide owner `doValidate`
//    */
//   contextRef: {
//     type: Object as PropType<Ref>,
//   },
//   customValidate: {
//     type: Function as PropType<(data: any, errors: any) => void>,
//   },
// } as const
