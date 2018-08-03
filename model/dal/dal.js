

const MongoClient = require('mongodb').MongoClient;
var client,db;

async function connect() {
    try {
        client = await MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true });
        console.log(`Succesfully connected to DB`);

        db = client.db('SurfServerDB');

        //uncomment this for test
        // console.log(`--TESTING MONGO DB--\n`);
        // await test();
    } catch (err) {
        console.error(err);
    }
}

async function test(){

    console.log(`- testing product insert -`);

    let testProduct = {name: 'Product1', description: 'Product1 description'};
    await insertProduct(testProduct);

    await printAllProducts();

    console.log(`- testing deleting a product -`);
    //inserting assigned _id value to the inserted object so we can use it
    await deleteProduct(testProduct._id);

    console.log(`- testing inserting 10 products -`);
    let products = [];
    for(let i=0; i < 10; i++){
        products.push({name: 'Product' + i, description: 'Description' + i});
    }
    await insertMany(products);

    await printAllProducts();

    console.log(`- testing deleting all products -`);
    await deleteAllProducts();
    await printAllProducts();

    console.log(`- disconnecting from db -`);
    await disconnect();
    process.exit(0);
}

async function deleteAllProducts(){
    try{
        let collection = db.collection('products');
        await collection.drop();
    } catch (error) {
        console.error(`Error deleting products`);
    }

}

async function insertProduct(product){
    try{

        let collection = db.collection('products');
        await collection.insertOne(product);
        console.log(`Inserted product of id : ${product._id}`);

    } catch (error) {

        if(error.toString().includes('duplicate key')){
            console.log(`Ignoring duplicate key insertion`);
        } else {
            console.error(`Error inserting product to DB : ${error}`)
        }

    }

}

async function getProduct(id){
    try{
        let collection = db.collection('products');
        let product = await collection.findOne({_id: id});
        return product;
    } catch (error) {
        console.log(`Error getting product of id ${id}`);
    }
}

async function deleteProduct(id){
    try{
        let collection = db.collection('products');
        await collection.deleteOne({_id: id});
        console.log(`Deleted product of id ${id}`);
    } catch (error) {
        console.error(`Error deleting product of id ${id} : ${error}`);
    }

}

async function insertMany(products){
    try{
        let collection = db.collection('products');
        let result = await collection.insertMany(products);
        console.log(`inserted ${result.insertedCount} products`);
    } catch (error) {
        console.error(`Error inserting many products : ${error}`);
    }

}



async function getAllProducts(){
    try{
        let collection = db.collection(`products`);
        let products = await collection.find({}).toArray();
        console.log(`Fetched all products`);
        return products;
    } catch (error) {
        console.error(`Error getting all products ${error}`);
    }

}

async function printAllProducts(){
    let currentProductsInDb = await getAllProducts();
    console.log('Products: ' + JSON.stringify(currentProductsInDb,null,'\t'));
}

async function disconnect(){
    client.close();
}

exports.connect = connect;
exports.disconnect = disconnect;
exports.getAllProducts = getAllProducts;
exports.insertProduct = insertProduct;
exports.insertMany = insertMany;
exports.deleteProduct = deleteProduct;
exports.getProduct = getProduct;