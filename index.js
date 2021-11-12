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
    const usersReviewCollection = database.collection('userReview');

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

    //-----------------------------Add New PRODUCTS 
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
    const result = await productsCollection.insertOne(newProduct)
      res.send(result);
    });
    //--------------------------------------------Product Delete
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.json(result);
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

    //---------------------------------------------------------get All Order
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    //--------------------------------------------------------- submit order  post
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      console.log(orders);
      const result = await ordersCollection.insertOne(orders);
      res.json(result);
    });

    //--------------------------------------------------------- get specifiq user order
    app.get('/orders/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const userOrder = await cursor.toArray();
      res.json(userOrder);
    });
    //----------------------------------order Approve
    app.put('/orders/:id', async (req, res) => {
      const orderId = req.params.id;
      const updateStatus = req.body;
      console.log(updateStatus.status);
      const options = { upsert: true };
      const filter = { _id: ObjectId(orderId) };
      const updateDoc = {
        $set: { status: updateStatus.status },
      };
      const result = await ordersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    //--------------------------------order Delete
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });

    //-----------------------------------------------------admin creat
    app.put('/user/admin', async (req, res) => {
      const user = req.body;
      console.log(user.adminMail);
      const filter = { email: user.adminMail };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);

      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    //------------------------------------------ADD REVIEW
    app.post('/review', async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await usersReviewCollection.insertOne(review);
      res.json(result);
    });

    //------------------------------------------fetch REVIEW
    app.get('/reviews', async (req, res) => {
      const cursor = usersReviewCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
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
