let express=require('express'),
   mongoose=require('mongoose'),
   bodyParser=require('body-parser'),
   cookieParser=require('cookie-parser')
   eventRouter=require('./Controllers/eventController'),
   userRouter=require('./Controllers/userController'),
   passport=require('./Controllers/authenticationController'),
   path=require('path')
   
let server=express();

mongoose.connect("mongodb://localhost:27017/yalla_events")

server.use(express.static(path.join(__dirname,"Views")))

//libraries middlewares
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended:false}))
server.use(cookieParser())



server.use(passport.initialize())

server.get('/',(req,res)=>{    
    res.redirect('/signup.html')//main route
})

server.get('/auth' ,(req,res,next)=>{

    passport.authenticate("id_strategy",{session:false},function(err,user,info){
        req.user_id=user._id;
        res.send({_id:req.user_id})
    })(req, res, next)
   
 
   
})

// server.get('/secret',
// passport.authenticate("user_strategy",{session:false}),(req,res)=>{
//     console.log("secret route")
// })

// server.get('/secret2',
// passport.authenticate("admin_strategy",{session:false}),(req,res)=>{
//     console.log("secret route2")
// })


server.use(eventRouter)
server.use(userRouter)

// server.use((err,req,res)=>{
//     console.log("api not found")
// })


server.listen(4040,()=>{
    console.log("listening")
})