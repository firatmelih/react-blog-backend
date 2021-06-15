const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const authRoute=require("./routes/auth")
const usersRoute=require("./routes/users")
const postsRoute=require("./routes/posts")
const categoriesRoute = require("./routes/categories")
const multer = require("multer");
const storage = multer.diskStorage({
    destination:(req,file,cb)=>
    {
        cb(null,"images")
    },
    filename:(req,file,cb)=>
    {
        console.log(file)
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({storage:storage})

const app = express();



dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex:true
    }).then(console.log("Connected to MongoDB")).catch(err=>console.log(err));

    
app.set("view engine", "ejs")

app.get("/upload",(req,res)=>
{
    res.render("upload");
})

app.post("/upload",upload.single("image"),(req,res)=>{
    res.send("uploaded")
})

app.use("/api/auth",authRoute);

app.use("/api/users",usersRoute);

app.use("/api/posts",postsRoute);

app.use("/api/categories",categoriesRoute);

app.use("/",(req,res)=>
{
    console.log("this is main url")
})

app.listen("5000",()=>{
    console.log("Backend is running");
});