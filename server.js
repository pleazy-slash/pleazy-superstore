require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// TEST LOG
console.log("🚀 Starting Pleazy Superstore Pro...");

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB ERROR:", err));

// ================= MODELS =================
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}));

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  img: String
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  items: Array,
  total: Number,
  date: { type: Date, default: Date.now }
}));

// ================= AUTH =================
app.post('/auth/register', async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  await User.create({username:req.body.username,password:hash});
  res.json({msg:'User created'});
});

app.post('/auth/login', async (req,res)=>{
  const user = await User.findOne({username:req.body.username});
  if(!user) return res.json({msg:'User not found'});

  const ok = await bcrypt.compare(req.body.password,user.password);
  if(!ok) return res.json({msg:'Wrong password'});

  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
  res.json({token});
});

// ================= PRODUCTS =================
app.get('/products', async (req,res)=>{
  res.json(await Product.find());
});

app.post('/products', async (req,res)=>{
  await Product.create(req.body);
  res.json({msg:'Product added'});
});

// ================= ORDERS =================
app.post('/checkout', async (req,res)=>{
  const total = req.body.reduce((t,i)=>t+i.price*i.qty,0);
  await Order.create({items:req.body,total});
  res.json({msg:'Order placed'});
});

app.get('/orders', async (req,res)=>{
  res.json(await Order.find());
});

// ================= ANALYTICS =================
app.get('/analytics', async (req,res)=>{
  const orders = await Order.find();
  const revenue = orders.reduce((a,b)=>a+b.total,0);

  res.json({
    revenue,
    totalOrders: orders.length
  });
});

// ================= HOME =================
app.get('/', (req,res)=>{
  res.send("🔥 Pleazy Superstore Pro is LIVE");
});

// ================= START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log(`🔥 Server running on port ${PORT}`);
});
