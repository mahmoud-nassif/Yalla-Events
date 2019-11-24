let express=require('express'),
    events=require('../Models/event'),
    users=require('../Models/user'),
    eventRouter=express.Router(),
    passport=require('./authenticationController')

 //    super admin authorization
eventRouter.get('/api/event/find',passport.authenticate('super_admin_strategy',{session:false}),(req,res)=>{
    console.log(req.query)

    events.findOne({_id:req.query.eventId})
    .then(foundEvent=>{
        if(!foundEvent) throw new Error("event is not found")
        else res.status(200).send(foundEvent)
    })
    .catch((err)=>{
        res.status(500).send({'err':err.message})
    })

})

eventRouter.post('/api/event/create',passport.authenticate('super_admin_strategy',{session:false}),(req,res)=>{
    console.log(req.body)

    let dateInMilliseconds=new Date(req.body.date).getTime()+(2*3600000)

    let newEvent={
        name:req.body.name,
        about:req.body.about,
        location:req.body.location,
        date:dateInMilliseconds,
        duration:req.body.duration,
        users:[]
    }

    events.create(newEvent)
    .then(createdEvent=>{
        res.status(200).redirect('../../super_admin_profile.html')
       // res.status(200).send(createdEvent)
    })
    .catch((err)=>{
        res.status(500).send({'err':err.message})
    })

})

eventRouter.get('/api/event/edit',passport.authenticate('super_admin_strategy',{session:false}),(req,res)=>{
    console.log(req.body)
    res.status(200).send({'sorry':"this route has not been implemented yet"})
    // let newEvent={
    //     uuid:"",//use uuid()
    //     name:req.body.name,
    //     about:req.body.about,
    //     location:req.body.location,
    //     date:req.body.date,//dont forget to covert to milliseconds
    //     duration:req.body.duration,
    //     users:[]
    // }

    // events.create(newEvent)
    // .then(createdEvent=>{
    //     res.status(200).send(createdEvent)
    // })
})
//      super admin & admin authorization
eventRouter.post('/api/event/allEvents',passport.authenticate('admin_strategy',{session:false}),(req,res)=>{
    
    events.find({})
    .then(allEvents=>{
        if(!allEvents || allEvents.length<=0) throw new Error("no Events found")
        else res.status(200).send(allEvents)//array of events
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })

})

eventRouter.post('/api/event/upcomingEvents',passport.authenticate('admin_strategy',{session:false}),(req,res)=>{

    let todayDateInMilliseconds=new Date().getTime()

    events.find({date:{$gte:todayDateInMilliseconds}})
    .then(upcomingEvents=>{
        if(!upcomingEvents || upcomingEvents.length<=0) throw new Error("no upcoming events found")
        else res.status(200).send(upcomingEvents)//array of events
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })

})



eventRouter.post('/api/event/pastEvents',passport.authenticate('admin_strategy',{session:false}),(req,res)=>{

    let todayDateInMilliseconds=new Date().getTime()
    
    events.find({date:{$lte:todayDateInMilliseconds}})
    .then(pastEvents=>{
        if(!pastEvents || pastEvents.length<=0) throw new Error("no past Events found")
        else res.status(200).send(pastEvents)//array of events
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })

})


eventRouter.post('/api/event/pendingUsers',passport.authenticate('admin_strategy',{session:false}),(req,res)=>{

    events.find({"users.status":"pending"})
    .populate({path:"users._id"})
    .then(eventWithPendingUsers=>{
        res.status(200).send(eventWithPendingUsers)
        //supposed to display only status:"pending"
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })

})

eventRouter.get('/api/event/assign',passport.authenticate('admin_strategy',{session:false}),(req,res)=>{

    console.log("assign")
    console.log(req.query)

    events.updateOne({_id:req.query.event_id,"users._id":req.query.user_id},{$set:{"users.$.status":"member"}})
    .then(result=>{
        return users.updateOne({_id:req.query.user_id},{$push:{events:req.query.event_id}})
    })
    .then(result=>{
        res.status(200).send(result)
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})
    })

})

eventRouter.get('/api/event/viewUsers',passport.authenticate('admin_strategy',{session:false}),(req,res)=>{

    console.log("view users")
    console.log(req.query)
    
    events.findOne({_id:req.query._id,"users.status":"member"})
    .populate({
        path:'users._id'
    })
    .then(event=>{
        if(!event || !event.users || event.users.length<=0) throw new Error("no users for this event yet")
        else res.status(200).send(event.users)//array of users {_id:completeUser:status:""}
        //supposed to view only status:"member"
    })
    .catch(err=>{
        res.status(500).send({'err':err.message})   
    })

})

module.exports=eventRouter;