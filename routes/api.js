var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/products', function(req, res, next) {
    res.send([{name: 'Product1', description: 'Product Description No.1'},
        {name: 'Product2', description: 'Product Description No.2'},
        {name: 'Product3', description: 'Product Description No.3'}]);
    res.end();
});

module.exports = router;
