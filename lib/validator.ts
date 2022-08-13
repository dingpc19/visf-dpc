import toPath from 'lodash.topath'
import Ajv from 'ajv'
import { Schema } from './types'
import i18n from 'ajv-i18n'
import { isObject } from './utils'

interface TransformedErrorObject {
  name: string
  property: string
  message: string | undefined
  params: Ajv.ErrorParameters
  schemaPath: string
}

export type ErrorSchema = {
  [level: string]: ErrorSchema
} & {
  __errors?: string[]
}

function toErrorSchema(errors: TransformedErrorObject[]) {
  if (errors.length < 1) return {}
  return errors.reduce((errorSchema, error) => {
    const { property, message } = error
    const path = toPath(property) // .obj.a ->[obj,a]
    let parent = errorSchema
    if (path.length > 0 && path[0] === '') {
      path.splice(0, 1)
    }
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        ;(parent as any)[segment] = {}
      }
      parent = parent[segment]
    }
    if (Array.isArray(parent.__errors)) {
      parent.__errors = parent.__errors.concat(message || '')
    } else {
      parent.__errors = [message || '']
    }
    return errorSchema
  }, {} as ErrorSchema)
}

function transformErrors(errors: Ajv.ErrorObject[] | null | undefined) {
  if (errors === null || errors === undefined) return []
  return errors.map(({ message, dataPath, keyword, params, schemaPath }) => {
    return {
      name: keyword,
      property: `${dataPath}`,
      message,
      params,
      schemaPath,
    }
  })
}
export async function validateFormData(
  validator: Ajv.Ajv,
  formData: any,
  schema: Schema,
  locle: string = 'zh',
  customValidata: ((data: any, errors: any) => void) | undefined,
) {
  let validationError: any = null
  try {
    validator.validate(schema, formData)
  } catch (err) {
    validationError = err
  }
  i18n[locle](validator.errors)
  let errors = transformErrors(validator.errors)
  if (validationError) {
    errors = [
      ...errors,
      {
        message: validationError.message,
      } as TransformedErrorObject,
    ]
  }
  const errorSchema = toErrorSchema(errors)
  if (!customValidata) {
    return {
      errors,
      errorSchema,
      isValid: errors.length === 0,
    }
  }
  const proxy = createErrorHandlerProxy()
  await customValidata(formData, proxy)
  const newErrorSchema = mergeObjects(errorSchema, proxy, true)
  return {
    errors,
    errorSchema: newErrorSchema,
    isValid: errors.length === 0,
  }
}

function createErrorHandlerProxy(raw: object = {}) {
  return new Proxy(raw, {
    get(target, key, receiver) {
      if (key === 'addError') {
        return (message: string) => {
          const t: any = target
          if (t.__errors) t.__errors.push(message)
          else t.__errors = [message]
        }
      }

      if (key === '__get_raw__') {
        return raw
      }
      const res = Reflect.get(target, key, receiver)

      if (res === undefined) {
        const proxy: any = createErrorHandlerProxy({})
        ;(target as any)[key] = proxy
        return proxy
      }

      return res
    },
  })
}
export function mergeObjects(
  obj1: any,
  obj2: any,
  concatArrays: boolean = false,
) {
  // Recursively merge deeply nested objects.
  let acc = Object.assign({}, obj1) // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key]
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays)
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right)
    } else {
      acc[key] = right
    }
    return acc
  }, acc)
}
