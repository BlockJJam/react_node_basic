//mongodb+srv://jjm:<password>@blockjjam.lmmka.mongodb.net/<dbname>?retryWrites=true&w=majority
const path =require('path');
const app = require('./config/express')();
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const port = 5001;
const {User} = require("./models/User");
const {auth} = require("./config/auth");

dotenv.config({ path: __dirname+"/../.env"});
const MONGO_URL = process.env.MONGO_URL;
app.use(cookieParser());

mongoose.connect(MONGO_URL, {
  useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('mongoDB connected')).catch(err=> console.log(err));

app.get('/', (req,res) => res.send('hello world! '));

app.post('/api/users/register', (req, res)=> {

  //회원가입할 때 필요한 정보들을 client에서 가져오면 디비에 넣어준다
  const user = new User(req.body);
  // user model에 저장(디비에저장)
  user.save((err,userInfo)=> {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는 지 확인
  User.findOne({ email: req.body.email }, (err, user) =>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 디비에있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch)=>{
      if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});

      //비밀번호까지 맞다면 토큰 생성
      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err);

        //토큰을 생성했으면 토큰을 저장하자 where?? 쿠키 , 로컬, 세션 ..(여기선 쿠키)
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id})
      })
    })
  })
})

// auth 미들웨어 역할 : get request받은 다음 콜백 전에 전처리 해주는
// role 0 : user , 1 ~ : admin
app.get('/api/users/auth', auth ,(req,res)=>{

  //여기까지 미들웨어를 통과해서 왔다는 얘기는 Authentication이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req,res)=>{
  User.findOneAndUpdate({_id: req.user._id},{token:""}, (err,user)=>{
    if(err) return res.json({ success: false, err});
    return res.status(200).send({
      success: true
    })
  });
});

app.listen(port, ()=> console.log(`예제 app ahn john study ${port}`));
