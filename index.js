const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
var cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dl2nf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log("conncect async")
        const database = client.db("courixDB");
        const serviceCollection = database.collection("services");
        const orderCollection = database.collection("orders");

        // Insert/post Service
        app.post('/addservice', async (req, res) => {
            const service = req.body
            // console.log(service)
            // console.log("hit the post api", service);
            const result = await serviceCollection.insertOne(service)
            // console.log(result)
            res.json(result)
        })
        // get Service Data
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        // get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service)
        })
        // Book order/Post order
        app.post('/shipping', async (req, res) => {
            const order = req.body
            // console.log()
            console.log("hit the post api", order);
            const result = await orderCollection.insertOne(order)
            // console.log(result)
            res.json(result)
            // res.send("ok")
        })
        // get Order
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        // Delete Order
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}



run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("connected")
})

app.listen(port, () => {
    console.log("Connected from", port)
})