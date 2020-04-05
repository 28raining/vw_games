package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"log"
)

type Page struct {
	Title string
	Body  []byte
}

//assigns the save function to the Page type
func (p *Page) save() error {
	filename := p.Title + ".txt"
	return ioutil.WriteFile(filename, p.Body, 0600)
}

//reads a text page
func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}

func viewHandler(w http.ResponseWriter, r *http.Request) {
	title := r.URL.Path[len("/view/"):]
	p,_ := loadPage(title)
	fmt.Fprintf(w, "<h1>%s</h1><div>%s</div>",p.Title, p.Body)
}

//Creates a page and saves it
func main() {
	http.HandleFunc("/view/", viewHandler)
	log.Fatal(http.ListenAndServe(":8080",nil))
	// p1 := &Page{Title: "TestPage", Body: []byte("This is a sample page.")}
	// p1.save()
	// p2, _ := loadPage("TestPage")
	// fmt.Println(string(p2.Body))
}
