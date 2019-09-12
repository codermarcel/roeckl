package main

import (
	"strconv"

	"github.com/gobuffalo/packr"
	"github.com/jinzhu/gorm"
)

const (
	drinks  = "Getraenke"
	vorSp   = "Vorspeisen"
	hauptSp = "Hauptspeisen"
	dessert = "Dessert"
)

func getProductImage(box packr.Box, id string) []byte {
	data, err := box.Find("food/" + id + ".jpeg")
	if err != nil {
		panic(err.Error())
	}

	return data
}

func CreateFunc(db *gorm.DB) func(name, description, category string, pictureName int, price int64, quantity int64) {
	box := packr.NewBox("./pictures")

	return func(name, description, category string, pictureName int, price int64, quantity int64) {
		p := Product{
			ID:          UUID4(),
			CreatedAt:   Now(),
			Name:        name,
			Description: description,
			Category:    category,
			Price:       price,
			Quantity:    quantity,
			Disabled:    false,
			Avatar:      getProductImage(box, strconv.Itoa(pictureName)),
		}

		db.Create(&p)
	}
}

func seedProducts(db *gorm.DB) {
	CreateProduct := CreateFunc(db)

	CreateProduct("Grosse Erfrischung",
		"Erfrischendes Wasser mit Mize und Limette",
		drinks,
		11, 350, 20)

	CreateProduct("Kleine Erfrischung",
		"Erfrischendes Wasser mit Mize und Limette",
		drinks,
		12, 250, 20)

	CreateProduct("Gemischter Salat",
		"Regionaler Salat mit Eisbergsalat, Karotten, Sellerie, Radischen, Gurken und Ei mit Balsamico Essig",
		vorSp,
		21, 500, 20)

	CreateProduct("Gebackener Schafskaese",
		"Schafskaese auf hauchdünnen Zucchini umrahmt mit Blätterteig, serviert mit Hausgemachter Honigsenf Soße",
		vorSp,
		22, 800, 20)

	CreateProduct("Hokaido Suppe",
		"Hokaido Kürbissuppe verfeinert mit Oma's Kräutern und Croutons",
		vorSp,
		23, 750, 20)

	CreateProduct("Salami Pizza Speziale",
		"Pizza nach original Rezeptur eines Italienischen Pizzabaeckers und Spanische Salami(Chorizo)",
		hauptSp,
		31, 1000, 20)

	CreateProduct("Pizza Gourmet",
		"Pizza mit Putenstreifen, Champions, Speck, Zwibeln und frischer Petersilie auf dünnem, italienischen Pizzateig",
		hauptSp,
		32, 1300, 20)

	CreateProduct("Maccaroni alla Bolognese",
		"Bologneses vom Rind mit frischen Tomaten, Basilikum und Tymian garniert mit eigenem Schnittlauch",
		hauptSp,
		33, 900, 20)

	CreateProduct("Rumpsteak Streifen",
		"Zartes Rumpsteak - medium - auf Kakerlakengratin mit Aubergine, Zucchini und Karotte",
		hauptSp,
		34, 2300, 20)

	CreateProduct("Feige Nuss",
		"Feige Gefüllt mit Gorgonzola auf einer Rotweinzwiebel-Nussoblade; garniert mit Schinken und Salatblätter",
		hauptSp,
		35, 1700, 20)

	CreateProduct("Spareribs Extravagant",
		"Spareribs serviert auf Bohnen- Karotten-Gemuese mit Tortellini und jungen Erbsen",
		hauptSp,
		36, 1800, 20)

	CreateProduct("Selbstgemacher Himmbeeryoghurt",
		"Frische Himmbeeren und Yoghurt aus eigener Herstellung garniert mit Schokoladenraspeln",
		dessert,
		41, 400, 20)

	CreateProduct("Dessert Komposition",
		"Frische Himmbeeren abwechselnt mit Schokoladen-Nuss-Kuchenstreuseln und selbstgemachten Yoghurt",
		dessert,
		42, 600, 20)
}
