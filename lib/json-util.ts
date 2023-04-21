import _ from 'lodash'

export type BasicJsonValue = boolean | number | string | null | undefined
export type JsonValue = BasicJsonValue | JsonArray | JsonMap
export interface JsonMap {
  [key: string]: JsonValue | undefined
}
export type JsonArray = JsonValue[]

export class JsonBuilder {
  public constructor(public readonly json: JsonMap = {}) {}

  public add(key: string, value: JsonValue, serializeEmpty = false): this {
    if ((_.isNil(value) || value === '') && !serializeEmpty) {
      return this
    }

    this.json[key] = value
    return this
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function recursiveDasherizeKeys(body: any) {
  let dasherized = _.mapKeys(body, (_value, key) => dasherize(key))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dasherized = _.mapValues(dasherized, (value: any) => {
    if (_.isPlainObject(value)) {
      return recursiveDasherizeKeys(value)
    }

    return value
  })

  return dasherized
}

export function dasherize(target: string): string {
  // prettier-ignore
  return target
    .replace(/([A-Z])/g, (_match, p1: string, _offset, _whole) => `-${p1.toLowerCase()}`)
    .replace(/\s/g, '-')
}
