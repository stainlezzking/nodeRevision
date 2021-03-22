const express = require("express")

const mongoose = require("mongoose")

const app = express()

// const {login} = require("./functions")


mongoose.connect("mongodb://localhost:27017/return",{ useNewUrlParser: true,useUnifiedTopology: true})
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({extended:false}))

const structure1 = {
    username : String,
    password : String,
    motto : String
}
const userSchema = mongoose.Schema(structure1)

const userCollection = new mongoose.model("user", userSchema)


app.use("/static", function(req,res){
    res.sendFile(__dirname +"/static/"+ req.url)
})

app.route("/login")

.get(function(req,res){
    res.render("login.ejs")
})
.post(function(req,res){
    console.log(req.body)
    if(req.body.username.trim() && req.body.password.trim()){
        const data = req.body
        userCollection.findOne({username : data.username})
        .then(back=>{
            if(back){
                    if(back.password === data.password){
                        res.redirect("/profile")
                    }else{
                        res.json("password or username wrong, try again")
                       res.end()
                    }
            }else{
               console.log("no user found, check your inputs again")
               res.json("no user found, check your inputs again")
              res.end()
            }
        }).catch(err=>{
            console.log(err.message)
            res.json(err.message)
        })

    }else{
        res.json("username or password empty")
    }
  
})

app.route("/signup") 
.get(function(req,res){
    res.render("signup.ejs")
})
.post(function(req,res){
const {username,password,confirm} = req.body
    if(username && password && confirm){
        userCollection.findOne({username: username}, function(resp){
            if(!resp){
                if(password === confirm){
                const info = new userCollection({
                    username,
                    password
                })
                info.save()
                res.redirect("/profile")
                }else{
                    res.json({err:"make sure both passwords are the same"})
                }
             
            }else{
                res.json({err :"user already exist, use a different username"})
                res.end()
            }
        })
    }else{
        res.json({err:"fill in all fields"})
    }
 
})

app.get("/profile", function(req,res){
    res.render("profile.ejs")
})
app.post("/info", function(req,res){
   res.json(req.body)
   res.end()
})
app.listen(3000, ()=>{
    console.log(" listening on port 3000 bosss")
})