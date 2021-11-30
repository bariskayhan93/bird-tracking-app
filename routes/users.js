const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register

router.post("/register", async (req, res) => {
  try {
    //generate ew password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    res.status(500).json(err);
  }
});

//login
router.post("/login",async(req,res)=>{
    try{
//find user
        const user=await User.findOne({username:req.body.username})
        !user&&res.status(400).json("wrong username or password!")
//validate
        const validPassword= await bcrypt.compare(req.body.password,user.password)
        !validPassword&&res.status(400).json("password is not valid")
//sen res


        res.status(200).json({_id:user._id, username:user.username})
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;
