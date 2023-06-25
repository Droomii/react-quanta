/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
import { type Dispatch, type SetStateAction } from "react"
import { deepEqual } from "./object"

type Setter<T> = Dispatch<SetStateAction<T>>

export interface Quantum<T = any> {
  value: T

  setValue<U extends T>(value: U | ((prevState: T) => U)): void

  unwrap(): T extends Array<infer U> ? U[] : T

  reset(): void
}

export interface SubscribableQuantum<T = any> extends Quantum<T> {
  subscribe(setter: Setter<T>): void

  unsubscribe(setter: Setter<T>): void
}

class QuantumClass<T> implements Quantum<T>, SubscribableQuantum<T> {
  private readonly _setters = new Set<Setter<T>>()
  private _value: T
  private readonly _initialValue: T

  constructor(initialValue: T) {
    if (typeof initialValue === "function") {
      throw TypeError("Functions cannot be quantized.")
    }

    if (initialValue && typeof initialValue === "object") {
      for (const key in initialValue) {
        if (key in this) {
          console.warn(
            `property name collision warning: getter/method '${key}' will be masked by the property of provided value.`
          )
        }
      }
    }

    this._initialValue = JSON.parse(JSON.stringify(initialValue))
    this._value = JSON.parse(JSON.stringify(initialValue))
    this.setValue = this.setValue.bind(this)
    this.unwrap = this.unwrap.bind(this)
    this.quantizeProperties()
  }

  setValue<U extends T>(value: ((prevState: T) => U) | U): void {
    const oldValue = this.unwrap()

    if (typeof value === "function") {
      this.setValue(
        (value as (prevState: T extends Array<infer U> ? U[] : T) => U)(
          this.unwrap()
        )
      )
    } else {
      const json = JSON.parse(JSON.stringify(value))

      if (this._value && typeof this._value === "object") {
        const value = this._value
        for (const key in json) {
          if (key in this._value) {
            ;(
              this._value[key as keyof typeof value] as Quantized<unknown>
            ).setValue(json[key])
          } else {
            this._value[key as keyof typeof value] = quantize(
              json[key]
            ) as never
          }
        }

        for (const key in this._value) {
          if (!(key in json)) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._value[key as keyof typeof value]
          }
        }
        this._value = (
          Array.isArray(this._value)
            ? this._value.filter((v) => !!v)
            : { ...this._value }
        ) as T
      } else if (json && typeof json === 'object') {
        this._value = quantize(json).value;
      } else {
        this._value = json;
      }
    }

    const newValue = this.unwrap()
    if (deepEqual(oldValue, newValue)) return

    this._setters.forEach((v) => {
      v(this._value)
    })
  }

  reset() {
    this.setValue(this._initialValue)
  }

  private quantizeProperties() {
    if (typeof this._value !== "string") {
      for (const key in this._value) {
        this._value[key] = quantize(this._value[key]) as never
      }
    }
  }

  get value() {
    return this._value
  }

  subscribe(setter: Setter<T>) {
    this._setters.add(setter)
  }

  unsubscribe(setter: Setter<T>) {
    this._setters.delete(setter)
  }

  unwrap(): T extends Array<infer U> ? U[] : T {
    if (Array.isArray(this._value)) {
      return this._value.map((v) => v.unwrap()) as T extends Array<infer U>
        ? U[]
        : never
    }

    if (this._value && typeof this._value === "object") {
      const unwrapped = {}
      for (const key in this._value) {
        const val = this._value[key]
        if (val instanceof QuantumClass) {
          Object.assign(unwrapped, { [key]: val.unwrap() })
        } else {
          Object.assign(unwrapped, { [key]: val })
        }
      }

      return unwrapped as T extends Array<infer U> ? never : T
    }

    return this._value as T extends Array<infer U> ? never : T
  }
}

export type Quantized<T> = Quantum<T> &
  (T extends Function
    ? never
    : T extends object
    ? { [key in keyof T]: Quantized<T[key]> }
    : Quantum<T>)

export function quantize<T>(
  value: T
): T extends Function ? never : Quantized<T> {
  if (typeof value === "function") {
    throw TypeError("Functions cannot be quantized.")
  }

  const quantumHandler: ProxyHandler<QuantumClass<T>> = {
    get(target: QuantumClass<T>, p: string | symbol, receiver: any): any {
      if (target.value && typeof target.value === "object") {
        if (p in target.value) {
          const val = target.value[p as keyof typeof target.value]
          if (typeof val === "function") {
            return (val as Function).bind(target.value)
          }
          return val
        }
      }

      return Reflect.get(target, p, receiver)
    }
  }
  const proxy: Quantum<T> = new Proxy(new QuantumClass(value), quantumHandler)
  return proxy as T extends Function ? never : Quantized<T>
}
