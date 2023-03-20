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
