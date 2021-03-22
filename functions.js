const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/return",{ useNewUrlParser: true,useUnifiedTopology: true})

const userCollection = new mongoose.model("user",new mongoose.Schema())

module.exports.login = function(req,res,next){
    if(req.body.username.trim() && req.body.password.trim()){
        const data = req.body
        userCollection.findOne({username : data.username})
        .then(back=>{
            if(back){
                    if(back.password === data.password){
                        next()
                    }else{
                        console.log("password or username wrong, try again")
                        res.json("password or username wrong, try again")
                        res.refresh()
                    }
            }else{
               console.log("no user found, check your inputs again")
               res.json("no user found, check your inputs again")
               res.refresh()
            }
        })

    }
}