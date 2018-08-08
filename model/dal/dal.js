var Product = require('../product.js')



const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

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
    // await deleteAllProducts();
    await printAllProducts();

    console.log(`- disconnecting from db -`);
    await disconnect();
    process.exit(0);
}

async function getAllProductsByHand(){
    try{
        let collection = db.collection(`products`);
        let products = await collection.aggregate([{
          "$match":{}
        },{
            "$group":
                {
                    "_id" : "$hand",
                    "avgPrice": {"$avg": {"$convert": {input: "$price", to: "int"}}}
                }
        }]).toArray();
        return products;
    } catch (error) {
        console.error(`Error getting all products grouped by hand ${error}`);
    }
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
        let id_o = new mongo.ObjectID(id);
        let product = await collection.findOne({'_id': id_o});
        return product;
    } catch (error) {
        console.log(`Error getting product of id ${id} ${error}`);
    }
}


async function updateProduct(product){
    let collection = db.collection("products");
    let id_o = new mongo.ObjectID(product['_id']);
    let newValues = {};
    for (key in product){
        if(key != '_id'){
            newValues[key] = product[key];
        }
    }
    await collection.updateOne({'_id': id_o},{$set: newValues});
}

async function deleteProduct(id){
    try{
        let collection = db.collection('products');
        let id_o = new mongo.ObjectID(id);
        let result = await collection.deleteOne({_id: id_o});
        console.log(`Deleted ${result.result.n} from DB`);
        return {'success': true};
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
        products.map(p => new Product.Product(p._id, p.name, p.description));
        return products;
    } catch (error) {
        console.error(`Error getting all products ${error}`);
    }

}

async function checkLogin(username,password){
    let collection = db.collection('admins');
    let admin = await collection.findOne({"_id": username});
    if(admin && admin.password === password){
        return "TRUE";
    } else return "FALSE";
}

async function insertAdmin(username,password){
    let collection = db.collection('admins');
    await collection.insert({"_id": username, "password":password});
    console.log(`inserted admin ${username}`);
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
exports.getAllProductsByHand = getAllProductsByHand;
exports.checkLogin = checkLogin
exports.getProductView = getProductView;
exports.updateProduct = updateProduct;
