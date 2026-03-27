const router = require('express').Router();
const Order = require('../models/Order');

router.post('/', async (req,res)=>{
  const total = req.body.reduce((t,i)=>t+i.price*i.qty,0);
  await Order.create({items:req.body,total});
  res.json({msg:'order saved'});
});

router.get('/', async (req,res)=>{
  res.json(await Order.find());
});

module.exports = router;
