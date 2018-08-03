var express = require('express');
var router = express.Router();
var appDal = require('../model/dal/dal')

/* GET users listing. */
router.get('/products',async function(req, res, next) {
    res.send(await appDal.getAllProducts());
});

router.get('/product/:id', async function(req, res, next){
    res.send(await appDal.getProduct(req.params.id));
})



module.exports = router;
