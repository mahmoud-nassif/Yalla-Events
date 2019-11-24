let mongoose=require('mongoose');

let userSchema=new mongoose.Schema({
    name:String,
    role:String,
    email:String,
    gender:String,
    dob:String,
    password:String,
    events:[{type:mongoose.Schema.Types.ObjectId,ref:"event"}]
})

module.exports=mongoose.model("user",userSchema,"users")