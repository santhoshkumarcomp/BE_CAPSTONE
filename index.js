const mongoose = require("mongoose");
const cron = require("node-cron");
const app = require("./app");
const { MONGODB_URI, PORT } = require("./utils/config");
const Post = require("./models/post");

const updateValue = async () => {
  console.log("in here");
  try {
    const posts = await Post.find();
    if (!posts) {
      console.log("in return here");
      return;
    }
    posts.map(async (post) => {
      let dt = new Date(post.createdAt);
      const [date, time] = dt.toISOString().split("T");
      const t = time.split("Z");
      console.log("in map here");
      console.log(date, t);
      console.log(Date.now() - dt); //1800000 millis seconds for 30 minutes
      if (Date.now() - dt > 1800000 && !post.closed) {
        await Post.findByIdAndUpdate(post._id, { closed: true });
      }
      console.log(post);
    });
  } catch (error) {
    console.log(error.message);
  }
};

// Schedule to run after 5 seconds (every 5 seconds here for demonstration)
// cron.schedule("*/1800000 * * * * *", updateValue);

try {
  mongoose.connect(MONGODB_URI).then(
    app.listen(PORT, () => {
      console.log("listening at port 3001");
      console.log("connected to db");
    })
  );
} catch (error) {
  console.log(error.message);
}
