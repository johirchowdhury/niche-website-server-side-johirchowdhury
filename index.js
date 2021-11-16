const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjijy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log("Database Successfully Connected");
        const database = client.db("jacs-watch");
        const watchCollection = database.collection("products");
        const orderCollection = database.collection("order");
        const reviewCollection = database.collection("review");
        const usersCollection = database.collection("users");

        app.get('/products', async (req, res) => {
            const cursor = watchCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
            // console.log(products)
        })
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.json(review);
            // console.log(products)
        })
        app.get('/myorder', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const order = orderCollection.find(query);
            const result = await order.toArray();
            res.json(result);
        })
        app.delete('/myorder/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/homeProducts', async (req, res) => {
            const cursor = watchCollection.find({});
            const products = await cursor.limit(6).toArray();
            res.json(products);
            // console.log(products)
        })
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
            console.log(orders)
        })

        app.post('/products', async (req, res) => {
            const appointment = req.body;
            const result = await watchCollection.insertOne(appointment)
            // console.log(result)
            res.json(result)
        })
        app.post('/addReview', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewCollection.insertOne(review)
            // console.log(result)
            res.json(result)
        })
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders)
            // console.log(result)
            res.json(result)
        })
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const services = await watchCollection.findOne(query);
            // console.log(services);
            res.send(services);
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const services = await watchCollection.findOne(query);
            res.send(services);
        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await watchCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const results = await usersCollection.updateOne(filter, updateDoc, options);
            console.log(results)
            res.json(results);
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`listening ${port}`)
})