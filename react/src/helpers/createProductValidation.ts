import { ValidLength } from "./checkoutValidation";

type pointingType = "below" | "left"
type validationContent = null | {content: string, pointing?: pointingType}

export function ValidName(input: string): validationContent {
    const result = ValidLength(input, "Product Name", 5, 50)

    if (result !== null) {
        return result
    }
    
    return null
}

export function ValidCategory(input: string): validationContent {
    const result = ValidLength(input, "Product Category", 5, 50)

    if (result !== null) {
        return result
    }
    
    return null
}

export function ValidDescription(input: string): validationContent {
    const result = ValidLength(input, "Product Description", 10, 300)

    if (result !== null) {
        return result
    }
    
    return null
}

export function ValidPrice(input: number): validationContent {
    const ok = input > 0 && input < 99999

    if (!ok) {
        return {content: "price needs to be more than 0 and less than 99999"}
    }
    
    return null
}

export function ValidQuantity(input): validationContent {
    const ok = input > 0 && input < 9999

    if (!ok) {
        return {content: "quantity needs to be more than 0 and less than 9999"}
    }
    
    return null
}