const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const dotenv = require("dotenv");
const usersRoute = require("./routes/users");
const pinRoute = require("./routes/pins");

dotenv.config()

app.use(express.json());

mongoose 
 .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
.then(()=>{
    console.log('DB Connected')

})
.catch((err)=>console.log(err))

app.use("/api/users" , usersRoute)
app.use("/api/pins" , pinRoute)

app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.listen(process.env.PORT || 8800,()=>{
    console.log(`Backend server is running at 8800`)
})