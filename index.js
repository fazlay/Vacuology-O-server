const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//vacuadmin 8iUimVBeAoDiBrGd

app.use(cors());
app.use(express.json());
const uri =
  'mongodb+srv://vacuadmin:8iUimVBeAoDiBrGd@cluster0.a4iwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('vacuology');
    const productsCollection = database.collection('products');
    const ordersCollection = database.collection('orders');
    const usersCollection = database.collection('users');

    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    //---------------------------------------------------------single Product
    app.get('/products/:id', async (req, res) => {
      const productId = req.params.id;
      const query = { _id: ObjectId(productId) };
      const singleProduct = await productsCollection.findOne(query);

      res.send(singleProduct);
    });

    //-----------------------------------------------insert-Update User info in Server

    app.post('/user', async (req, res) => {
      const userInfo = req.body;
      const result = await usersCollection.insertOne(userInfo);
      res.json(result);
    });
    app.put('/user', async (req, res) => {
      const usersInfo = req.body;
      console.log(userInfo);
      const filter = { email: usersInfo.email };
      const options = { upsrt: true };
      const updateDoc = {
        $set: usersInfo,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //---------------------------------------------------------order post
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      console.log(orders);
      const result = await ordersCollection.insertOne(orders);
      res.json('text');
    });
  } finally {
  }
}
run().catch();

app.get('/', (req, res) => {
  res.send('Server is Running');
});

app.listen(port, () => {
  console.log('Running Server at port', port);
});
