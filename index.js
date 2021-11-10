const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId =require('mongodb').ObjectId
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

    app.get('/products', async(req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    //---------------------------------------------------------single Product
    // app.get('/products1/:id' async(req,res)=>{

    //   const id =req.param.id;
    //   console.log(id);
    //   res.send('text')
    // })

    //
    app.get('/products/:id', async(req, res) => {
      const productId=req.params.id
    const query= {_id:ObjectId(productId)}
    const singleProduct = await productsCollection.findOne(query)

      res.send(singleProduct);
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
