const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email:{
    type: String,
    trim: true,
    unique: 1
  },
  password:{
    type: String,
    minlength: 5
  },
  lastname:{
    type: String,
    maxlength:50,
  },
  role: {
    type:Number,
    default:0
  },
  image: String,
  token:{
    type: String
  },
  tokenExp:{
    type: Number
  }
})
// User.use하기 전에 pre에서 먼저 암호
userSchema.pre('save', function(next){
  let user = this;

  if(user.isModified('password'))
  {
    bcrypt.genSalt(saltRounds, function(err,salt){
      if(err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
      })
    })
  } else{
    next();
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb){

  //plainPassword 1234567 //cryptedPassword $2b$10$yX2iD9lhT5NGN.....
  // 평문을 암호화해서 비교하면 된다
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    if(err) return cb(err);
    cb(null, isMatch);

  })
}

userSchema.methods.generateToken = function(cb){

  let user = this;
  // jsonwebtoken을 이용해서 token을 생성하기
  let token = jwt.sign(user._id.toHexString(), 'secretToken');
  console.log(user._id.toHexString());
  // user._id + 'secretToken' = token 생성 , 'secretToken' -> user._id가 나옴
  user.token = token;
  user.save(function(err,user){
    if(err) return cb(err);
    cb(null, user);
  })
}

userSchema.statics.findByToken = function(token, cb){
  let user = this;

  // token + 'secretToken' => user._id
  jwt. verify(token,'secretToken', function(err,decoded){

    //유저 아이디를 이용해서 유저 찾기 => client에서 가져온 token과 디비 토큰 일치 확인
    user.findOne({ "_id" : decoded, "token": token}, function(err, user){
      if(err) return cb(err);
      cb(null, user);
    })
  } )
}

const User = mongoose.model('User', userSchema);
module.exports={User};
