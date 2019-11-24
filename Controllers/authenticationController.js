let passport=require('passport'),
    passportJWT=require('passport-jwt'),
    jwtStrategy=passportJWT.Strategy,
    jwtExtractor=passportJWT.ExtractJwt,
    users=require('../Models/user')

function jwtCookieExtractor(req){
    let token=null;
    //console.log("cookies",req.cookies)
    if(req && req.cookies){
      token=req.cookies['token']
    }
    return token;
}

let jwtOptions={}
jwtOptions.jwtFromRequest=jwtExtractor.fromExtractors([jwtCookieExtractor])
jwtOptions.secretOrKey="ninja"

let userStrategy=new jwtStrategy(jwtOptions,function(payload,next){//verifyCallback
   //console.log("payload",payload)
   users.findOne({_id:payload._id,role:"user"})
   .then(foundUser=>{
       next(null,foundUser)
   })
   .catch(err=>{
       next(err,false)
   })
})

let adminStrategy=new jwtStrategy(jwtOptions,function(payload,next){//verifyCallback
    //console.log("payload",payload)
    users.findOne({_id:payload._id,role:{$regex:/admin/,$options:'i'}})//role contains admin word
    .then(foundUser=>{
        next(null,foundUser)
    })
    .catch(err=>{
        next(err,false)
    })
 })

 let superAdminStrategy=new jwtStrategy(jwtOptions,function(payload,next){//verifyCallback
    //console.log("payload",payload)
    users.findOne({_id:payload._id,role:"super admin"})
    .then(foundUser=>{
        next(null,foundUser)
    })
    .catch(err=>{
        next(err,false)
    })
 })

 let idStrategy=new jwtStrategy(jwtOptions,function(payload,next){//verifyCallback
    //console.log("payload",payload)
    users.findOne({_id:payload._id})
    .then(foundUser=>{
        //console.log("logged in user ",foundUser)
        next(null,foundUser)
    })
    .catch(err=>{
        next(err,false)
    })
 })

passport.use("user_strategy",userStrategy)
passport.use("admin_strategy",adminStrategy)
passport.use("super_admin_strategy",superAdminStrategy)
passport.use("id_strategy",idStrategy)

module.exports=passport;
   