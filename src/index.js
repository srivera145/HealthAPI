const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const PORT = process.env.PORT || 4040;
const app = express();


// Create a GET route for News API

const newspaper = [
   {
     name: 'Google Health',
     address: 'https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US%3Aen',
     base: 'https://news.google.com/'
   },
   {
     name: 'Fox Health',
     address: 'https://www.foxnews.com/lifestyle',
     base: 'https://www.foxnews.com'
  },
  {
    name: 'NBC Health',
    address: 'https://www.nbcnews.com/health',
    base: ''
  },
  {
    name: 'CBS Health',
    address: 'https://www.cbsnews.com/health/',
    base: ''
  }
]

const articles = []

newspaper.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data
    const $ = cheerio.load(html)
    

    $('article', html).each(function () {
      const title = $(this).find('h4').text()
      const url = $(this).find('a').attr('href')
      const image = $(this).find('img').attr('src')
      const publishedAt = new Date()
      const description = $(this).find('p').text()
      const author = newspaper.name
      
      

      articles.push({
        title,
        description,
        author,
        url: newspaper.base + url,
        image,
        publishedAt
        
      })
    })
  })
})

app.get('/', (req, res) => {
  res.send('Welcome to the Health API!');
});

app.get('/health', (req, res) => {
  res.send(articles);
});
 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});