const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.json())

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', (process.env.PORT || 3000));

var db

MongoClient.connect('mongodb://yoda:yodapower@ds161016.mlab.com:61016/star-wars-quotes', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(app.get('port'), () => {
    console.log('listening on ' + app.get('port'))
  })
})

app.get('/', (req, res) => {
  db.db('star-wars-quotes').collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', { quotes: result })
  })
})

app.post('/quotes', (req, res) => {
  db.db('star-wars-quotes').collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.db('star-wars-quotes').collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.db('star-wars-quotes').collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})