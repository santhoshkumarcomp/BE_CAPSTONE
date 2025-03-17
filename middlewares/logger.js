const logger = async (req, res, next) => {
  console.log(`New request received: ${req.method}`);
  console.log("Request body:", req.body);
  console.log("Request query:", req.query);
  console.log("Request params:", req.params);
  console.log("Request cookies:", req.cookies);
  console.log("-".repeat(50));
  next();
};
module.exports = logger;
