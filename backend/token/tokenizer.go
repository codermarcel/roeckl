package token

type Tokenizer interface {
	Build(ClaimSet) (string, error)
	Parse(string) (ClaimSet, error)
}

type Builder interface {
	Build(ClaimSet) (string, error)
	Parse(string) (ClaimSet, error)
}
