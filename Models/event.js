let mongoose=require('mongoose')

let eventSchema=new mongoose.Schema({
    name:String,
    about:String,
    location:String,
    date:String,
    duaration:String,
    users:[{_id:{type:mongoose.Schema.Types.ObjectId,ref:"user"},status:String}]
})

module.exports=mongoose.model("event",eventSchema,"events")

