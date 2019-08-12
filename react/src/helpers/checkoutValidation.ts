
type pointingType = "below" | "left"
type validationContent = null | {content: string, pointing?: pointingType}

export function ValidLength(input: string, name: string, minLen: number, maxLen: number): validationContent {
    if (!input || input.length < minLen || input.length > maxLen) {
        return {content: name + " needs to be at least " + minLen + " and at most " + maxLen + " characters long"}
    }

    return null
}
export function ValidFirstName(input: string): validationContent {
    const result = ValidLength(input, "First Name", 3, 50)

    if (result !== null) {
        return result
    }
    
    return null
}

export function ValidLastName(input: string): validationContent {
    const result = ValidLength(input, "Last Name", 3, 50)

    if (result !== null) {
        return result
    }
    
    return null
}

export function ValidStreet(input): validationContent {
    const result = ValidLength(input, "Street", 3, 50)

    if (result !== null) {
        return result
    }
    
    return null
}

export function ValidAddress(input): validationContent {
    const result = ValidLength(input, "Address", 3, 50)

    if (result !== null) {
        return result
    }
    
    return null
}

export function ValidPhone(input): validationContent {
    return null
}

export function ValidInfo(input): validationContent {
    return null
}