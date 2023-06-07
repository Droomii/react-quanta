# react-quanta

react-quanta is a simple state management library for React.

## Installation

npm

```
npm install react-quanta
```

yarn

```
yarn add react-quanta
```

## Main Concepts

### Quantum

`quantum` is a state that can be observed.
`quantum` can be created by using `quantize` function, or `useQuantum` hook.

```tsx
import {quantize, useQuantum} from 'react-quanta'

// quantized number
const quantumNumber = quantize(1);
console.log(quantumNumber.value) // 1

// quantized string
const quantumString = quantize('123')
console.log(quantumString.value) // '123'

// quantized object
// objects are deeply quantized
const quantizedObj = quantize({a: 1, b: '2', c: [1, 2, 3]})
console.log(quantizedObj.a.value) // 1

// 'unwrap' method returns pure value of the quantum
console.log(quantizedObj.unwrap()) // {a: 1, b: '2', c: [1, 2, 3]}

const QuantumExample = () => {
  // useQuantum automatically subscribes to changes of value
  const q = useQuantum(123);

  return <div>{q.value}</div>
}
```

## Entangler

`Entangler`, `useEntangler` subscribes to changes of quanta's value.

```tsx
import {quantize, Entangler, useEntangler} from 'react-quanta'

// quantized object
// objects are deeply quantized
const quantizedObj = quantize({a: 1, b: '2', c: [1, 2, 3]})

const QuantumExample = () => {
  // subscribes to changes of quantizedObj.a
  const entangledQuantum = useEntangler(quantizedObj.a);
  
  // rerender triggers
  const incrementA = () => entangledQuantum.a.setvalue(v => v + 1);

  return (
    <div>
      <button onClick={incrementA}>add 1</button> 
      <div>{q.value}</div> {/* returns 1 */}
      {/* subscribes to changes of quanta passed to 'watch' props */}
      <Entangler watch={quantizedObj.b}>{() => (
        <div>{quantizedObj.b.value}</div> /* returns 2 */
      )}</Entangler>
    </div>
  )
}
```

## Collider

`useCollider` returns a memoized value which updates when one of the observing quanta changes.

```tsx
import {useCollider} from 'react-quanta';

const formData = quantize({firstName: '', lastName: ''});

const Form = () => {
  const {firstName, lastName} = formData;
  const isNameValid = useCollider(() => !!(firstName.value && lastName.value), [firstName, lastName])

  return (
    <div>
      <Entangler watch={firstName}>{() => (
        <input value={firstName.value} onChange={e => firstName.setValue(e.currentTarget.value)}/>
      )}</Entangler>
      <Entangler watch={lastName}>{() => (
        <input value={lastName.value} onChange={e => lastName.setValue(e.currentTarget.value)}/>
      )}</Entangler>
      <button disabled={!isNameValid}>submit</button>
    </div>
  )
}

```
