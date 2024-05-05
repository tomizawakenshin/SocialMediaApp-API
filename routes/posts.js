const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    console.log(newPost);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch(err) {
        return res.status(500).json(err);
    }
})

router.put("/:id", async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({$set: req.body});
            return res.status(200).json("編集が完了しました！");
        } else {
            return res.status(403).json("自分のポストしか編集できません");
        }
    } catch(err) {
        return res.status(500).json(err);
    }
})

router.delete("/:id", async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json("削除しました");
        } else {
            return res.status(403).json("自分のポストしか削除できません");
        }
    } catch(err) {
        return res.status(500).json(err);
    }
})

// router.put("/:id/like", async (req, res) => {
//     try {
//       const post = await Post.findById(req.params.id);
//       console.log(post);
//       console,log(post.userId);
//       console.log("working2");
//       if (!post.likes.includes(req.body.userId)) {
//         console,log("like");
//         await post.updateOne({ $push: { likes: req.body.userId } });
//         res.status(200).json("The post has been liked");
//       } else {
//         console.log("dislike");
//         await post.updateOne({ $pull: { likes: req.body.userId } });
//         res.status(200).json("The post has been disliked");
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch(err) {
        return res.status(500).json(err);
    }

});

router.get("/timeline/all", async(req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({userId : friendId});
            })
        );
        console.log("working");
        return res.status(200).json(userPosts.concat(...friendPosts));
    } catch(err) {
        return res.status(500).json(err);
    }
})
module.exports = router;