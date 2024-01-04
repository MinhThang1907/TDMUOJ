const express = require("express");

const connectDB = require("./Database");
connectDB();

const app = express();
app.use(express.json({ extended: false }));

const cors = require("cors");
app.use(cors());


//routes
const account = require("./routes/accountRoute");

//using
app.use(account);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
