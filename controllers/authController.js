const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10);
  await User.create({username:req.body.username,password:hash});
  res.json({msg:'User created'});
};

exports.login = async (req,res)=>{
  const user = await User.findOne({username:req.body.username});
  if(!user) return res.json({msg:'No user'});

  const ok = await bcrypt.compare(req.body.password,user.password);
  if(!ok) return res.json({msg:'Wrong password'});

  const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
  res.json({token});
};
