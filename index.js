const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jvd1e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("Task_Manager").collection("task");

  // POST DATA //

  app.post('/addTask', (req, res) => {
      const item = req.body;
      collection.insertOne(item)
      .then(result => {
        res.send(result);
      })
  })

  // GET DATA //

  app.get('/api/tasks', (req, res) => {
      collection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  // DELETE DATA //

  app.get('/delete/:id', (req, res) => {
      collection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send(result);
      })
  })

  // LOAD SINGLE DOCUMENT //

  app.get('/api/task/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  // UPDATE DOCUMENT //

  app.patch('/update/:id', (req, res) => {
    collection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: req.body
    })
    .then(result => {
      res.send(result);
    })
  })

});

app.get('/', (req, res) => {
    res.send('working...');
})

app.listen(process.env.PORT || port);