const router = require('express').Router();
const Product = require('../models/Product');

router.get('/', async (req,res)=>{
  res.json(await Product.find());
});

router.post('/', async (req,res)=>{
  await Product.create(req.body);
  res.json({msg:'added'});
});

module.exports = router;
