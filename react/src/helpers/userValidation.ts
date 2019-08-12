type retType = {content: string}
export function checkEmail(input: string): retType {
    if (!input || input.length < 8 || input.length > 40) {
        return {content: "Email needs to be at least 8 and at most 40 characters long"}
    }
    if (!input.includes("@") || !input.includes(".")) {
        return {content: "Email is not valid"}
    }
    
    return null
}

export function checkUsername(input: string): retType {
    if (!input || input.length < 5 || input.length > 30) {
        return {content: "Username needs to be at least 5 and at most 30 characters long"}
    }
    
    return null
}

export function checkPassword(input: string): retType {
    if (!input || input.length < 6 || input.length > 99) {
        return {content: "Username needs to be at least 6 and at most 99 characters long"}
    }

    return null
}
