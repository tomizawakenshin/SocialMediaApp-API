const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/resister", async(req,res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        })
        const user = await newUser.save();
        res.status(200).json(user);
        res.send("登録完了！")
    } catch(err) {
        console.log(err);
    }
})

router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({email : req.body.email});
        if(!user) {
            return res.status(404).json("ユーザーが見つかりませんでした");
        }
        //!user && res.status(404).json("ユーザーが見つかりませんでした");

        console.log("リクエストパスワード : " + req.body.password + ", データベースパスワード : " + user.password);
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        console.log(validPassword);
        if(!validPassword) {
            return res.status(400).json("パスワードが間違っています");
        }
        //!validPassword && res.status(400).json("パスワードが間違っています!");

        return res.status(200).json("認証に成功しました！");
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;