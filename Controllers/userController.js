let express=require('express'),
    users=require('../Models/user'),
    events=require('../Models/event'),
    userRouter=express.Router(),
    jwt=require('jsonwebtoken'),
    passport=require('../Controllers/authenticationController')

//////////////////////////////////////////////////////////////////////////////////
//       user authorization

userRouter.post('/api/user/register',(req,res)=>{
    //console.log(req.body,new Date())

    let newUser={
        name:req.body.name,
        role:"user",
        email:req.body.email,
        gender:req.body.gender,
        dob:new Date().getTime(),
        password:req.body.password,
        events:[]
    }

    users.create(newUser)
    .then(createdUser=>{    
        let payload={_id:createdUser._id}
        let token=jwt.sign(payload,'ninja')
        res.cookie("token",token)//,{httpOnly:true,secure:true}
        res.status(200).redirect('../../login.html')
        //res.status(200).send({'msg':"successfully signed up"})//createdUser)
    })
    .catch((err)=>{
        res.status(500).redirect('../../error.html')
        //res.status(500).send({'err':err.message})
    })
})

userRouter.post('/api/user/login',(req,res)=>{
    //console.log(req.body)

    users.findOne({email:req.body.email,password:req.body.password})
    .then(foundUser=>{
        if(!foundUser) throw new Error("no such user found")
        else {
            req.user_id=foundUser._id;
            let payload={_id:foundUser._id}
            let token=jwt.sign(payload,'ninja')
            res.cookie("token",token)
            
            if(foundUser.role=="user"){
                res.status(200).redirect('../../user_profile.html')
            }
            else if(foundUser.role=="admin"){
                res.status(200).redirect('../../admin_profile.html')
                //res.status(200).redirect('../../admin_profile.html')
            }
            else if(foundUser.role=="super admin"){
                res.status(200).redirect('../../super_admin_profile.html')
            }
            else{
                throw new Error("no role or unknown user")
            }
            //res.status(200).send({'msg':"successfully logged in"})//foundUser
        }
    })
    .catch((err)=>{
        res.status(500).redirect('../../error.html')
        //res.status(401).send({'err':err.message})
    })
})

userRouter.post('/api/user/myEvents',passport.authenticate('user_strategy',{session:false}),(req,res)=>{

    users.findOne({_id:req.body._id})
    .populate({"path":"events"})
    .then(user=>{
        if(!user || !user.events || user.events.length<=0) throw new Error("no events for this user")
        else res.status(200).send(user.events)//array of events
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })

})


userRouter.get('/api/user/viewEvents',passport.authenticate('admin_strategy',{session:false}),(req,res)=>{//for admin authorization only

    console.log("view events")
    console.log(req.query)

    users.findOne({_id:req.query._id})
    .populate({"path":"events"})
    .then(user=>{

        if(!user || !user.events || user.events.length<=0) throw new Error("no events for this user")
        else res.status(200).send(user.events)//array of events
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })

})

userRouter.post('/api/user/myUpcomingEvents',passport.authenticate('user_strategy',{session:false}),(req,res)=>{

    let todayDateInMilliseconds=new Date().getTime()

    users.findOne({_id:req.body._id})
    .populate({
        path:'events',
        match:{date:{$gte:todayDateInMilliseconds}}
    })
    .then(user=>{
        if(!user || !user.events || user.events.length<=0) throw new Error("no upcoming events for this user")
        else res.status(200).send(user.events)//array of upcoming events
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })
    
})

userRouter.post('/api/user/myPastEvents',passport.authenticate('user_strategy',{session:false}),(req,res)=>{

    let todayDateInMilliseconds=new Date().getTime()

    users.findOne({_id:req.body._id})
    .populate({
        path:'events',
        match:{date:{$lte:todayDateInMilliseconds}}
    })
    .then(user=>{
        if(!user || !user.events || user.events.length<=0) throw new Error("no past events for this user")
        else res.status(200).send(user.events)//array of past events
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })
    
})


userRouter.post('/api/user/joinEventRequest',passport.authenticate('user_strategy',{session:false}),(req,res)=>{

    console.log("join request sent")
    events.updateOne({_id:req.body.event_id},{$push:{users:{_id:req.body.user_id,status:"pending"}}})
    .then(result=>{
        res.status(200).send({result})
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })

})

userRouter.post('/api/user/leaveEvent',passport.authenticate('user_strategy',{session:false}),(req,res)=>{


    events.updateOne({_id:req.body.event_id},{$pull:{users:{_id:req.body.user_id}}})
    .then(result=>{
        console.log("event leave")   
        //res.status(200).redirect('../../user_profile.html') 
        res.status(200).send({result}) 
    })

})

userRouter.post('/api/user/allUsers',passport.authenticate('admin_strategy',{session:false}),(req,res)=>{

     users.find({})
    .then(users=>{
        res.status(200).send(users) 
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })

})






module.exports=userRouter