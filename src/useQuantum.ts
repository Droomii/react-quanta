import {useState} from "react";
import {quantize} from './Quantum';
import {useEntangler} from './useEntangler';

export const useQuantum = <T>(value: T) => {
    const [quantum] = useState(quantize<T>(value));
    return useEntangler(quantum);
}