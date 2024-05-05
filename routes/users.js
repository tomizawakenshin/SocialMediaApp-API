const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.put("/:id", async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
                //res.status(200).json("パスワードが変更されました！");
                console.log("パスワードが変更されました！");
            } catch(err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("アカウント情報が更新されました！");
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("自分のアカウント情報のみ更新できます！");
    }
})

router.delete("/:id", async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("アカウントの削除に成功しました！");
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("自分のアカウントのみ削除できます！");
    }
})

router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        try {
            const {password, updateAt, ...other} = user._doc;
            return res.status(200).json(other);
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(404).json("アカウントが見つかりませんでした");
    }
})

router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const followingUser = await User.findById(req.params.id);
            const followerdUser = await User.findById(req.body.userId);

            if(!followingUser.following.includes(req.body.userId)) {
                await followingUser.updateOne({$push : {following: req.body.userId}});
                await followerdUser.updateOne({$push :{followers: req.params.id}});
                return res.status(200).json("フォローが完了しました！");
            } else {
                return res.status(403).json("あなたは既にこのアカウントをフォローしています");
            }
        } catch(err) {
            return res.status(403).json(err);
        }
    } else {
        return res.status(500).json("自分自身をフォローすることはできません！");
    }
})

router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const followingUser = await User.findById(req.params.id);
            const followerdUser = await User.findById(req.body.userId);

            if(followingUser.following.includes(req.body.userId)) {
                await followingUser.updateOne({$pull : {following: req.body.userId}});
                await followerdUser.updateOne({$pull :{followers: req.params.id}});
                return res.status(200).json("フォローを解除しました！");
            } else {
                return res.status(403).json("あなたは既にこのアカウントのフォローを解除しています");
            }
        } catch(err) {
            return res.status(403).json(err);
        }
    } else {
        return res.status(500).json("自分自身のフォローを解除することはできません！");
    }
})
module.exports = router;