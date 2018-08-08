var express = require('express');
var router = express.Router();
var appDal = require('../model/dal/dal')


router.get('/products',async function(req, res, next) {
    res.send(await appDal.getAllProducts());
});

router.get('/byhand',async function(req, res, next) {
    res.send(await appDal.getAllProductsByHand());
});

router.get('/product/getone/:id', async function(req, res, next){
    res.send(await appDal.getProduct(req.params.id));
});

router.post('/product/upload', async function (req,res,next){
    res.send(await appDal.insertProduct(req.body));
});

router.get('/product/delete/:id', async function(req,res,next){
    res.send(await appDal.deleteProduct(req.params.id));
});

router.post('/product/update', async function(req,res,next){
    res.send(await appDal.updateProduct(req.body));
});


module.exports = router;
