const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postsRoute = require("./routes/posts")

dotenv.config();

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

const dbURL = process.env.MONGO_URL;
//mongoose.connect(process.env.MONGO_URL);
//MI7FZvRSRTtKXKPx
mongoose.connect(dbURL).then((res) => console.log("DBに接続しました"));

const PORT = 3000;
app.listen(PORT, () => {
    console.log("サーバー接続完了");
})