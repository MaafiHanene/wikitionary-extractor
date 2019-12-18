const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')

let categories = []
let words = []
let roots = []
axios.get("https://en.wiktionary.org/w/index.php?title=Category:Arabic_3-letter_roots&subcatfrom=%D8%B9+%D8%B3+%D9%84%0AArabic+terms+belonging+to+the+root+%D8%B9+%D8%B3+%D9%84#mw-subcategories")
    .then(function (response) {
        //console.log(response)

        let $ = cheerio.load(response.data);
        $('.CategoryTreeItem').slice(0, 100).each((i, category) =>{
            console.log(i);
            categories.push({
                id: i,
                url: "https://en.wiktionary.org" + $(category).find('a').attr('href'),
            });
            axios.get(categories[i].url)
                .then(function (response) {
                    //console.log(response)

                    let $ = cheerio.load(response.data);
                    let text = $("#firstHeading i").text();
                    $('.mw-content-ltr li').each((i, word) =>{
                       // console.log(i)
                       let string = $(word).find('a').attr('title');
                        words.push(

                                string
                        );
                    });
                    
                    let root = {
                       // id: categories[i].id,
                        root: text,
                        words: words
                    }
                    words = []
                    let donnees = JSON.stringify(root)
                    fs.writeFile('roots.json',  donnees, { flag: 'a', EOL: '\r\n' },
                        (err) => {
                            if (err) {
                                console.error(err)
                                throw err
                            }

                            console.log('Saved data to file.')
                        })


                }).catch(function(e) {
                console.log(e)

            })
        });













    });







