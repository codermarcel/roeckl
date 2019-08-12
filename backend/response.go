package main

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func NewResponse(success bool, message string, data ...interface{}) Response {
	if len(data) > 0 && data[0] != nil {
		return Response{Success: success, Message: message, Data: data[0]}
	}

	return Response{Success: success, Message: message}
}

func Success(msg string, data ...interface{}) Response {
	return NewResponse(true, msg, data...)
}

func Fail(msg string, data ...interface{}) Response {
	return NewResponse(false, msg, data...)
}

func FailNotAuthenticated() Response {
	return NewResponse(false, "you are not authenticated")
}

func FailUserNotFound() Response {
	return NewResponse(false, "user not found")
}

func BadRequest(msg string) Response {
	return NewResponse(false, msg)
}

func BadRequestGeneric() Response {
	return NewResponse(false, "Bad request")
}
