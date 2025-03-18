const mongoose = require("mongoose");

const app = require("./app");
const { MONGODB_URI, PORT } = require("./utils/config");
const Post = require("./models/post");

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
