const express=require("express")
const mongoose = require("mongoose");
const cors=require("cors")
require('dotenv').config()
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Database connection successfull");
    
})
.catch(()=>{
    console.log("Database connection failed")
   
});

const userSchema =new mongoose.Schema({
    
    Full_name:String,
    location:String,
    number_of_rides:Number,
    rating:Number
})

const usermodel=new mongoose.model("user",userSchema)

const app=express()
app.use(express.json())
app.use(cors())

// get add from server
app.get("/",async(req,res)=>{
    try {
        const data= await usermodel.find()
        res.status(200).json(data)
        console.log(data)
    } catch (error) {
      res.status(400).json({massage:error.massage})  
    }
  

})
// post data in server

app.post("/add", async (req,res)=>{
    const data=req.body

    const newdata=  new usermodel(data)
  
   try {
    
     await newdata.save()
     res.status(200).json({newdata})
   } catch (error) {
    res.status(400).json({massage:error.massage})
   }
   
})

// Updated data 

app.put("/edit/:userId",async (request, response) => {
    let user = request.body;
     const editUser = new usermodel(user);
   
    try{
        await usermodel.findOneAndUpdate({_id: request.params.userId}, editUser);
        response.status(200).json(editUser);
    } catch (error){
        response.status(400).json({ message: error.message});     
    }
})

// Delete data

app.delete("/delete/:userId",async (request, response) => {
  

   try{
        await usermodel.findOneAndDelete({_id:request.params.userId});
        response.status(200).json("User deleted Successfully");
    } catch (error){
        response.status(400).json({ message: error.message});     
    }
    
})

app.listen(8000,()=>{
    console.log("server connect is successfull")
   
})