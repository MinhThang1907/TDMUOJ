const express = require("express");

const connectDB = require("./Database");
connectDB();

const app = express();
app.use(express.json({ extended: false }));

const cors = require("cors");
app.use(cors());

//routes
const account = require("./routes/accountRoute");
const news = require("./routes/newsRoute");
const problem = require("./routes/problemRoute");
const tagProblem = require("./routes/tagProblemRoute");
const submission = require("./routes/submissionRoute");
const contest = require("./routes/contestRoute");
const rulesContest = require("./routes/rulesContestRoute");
const rankingContest = require("./routes/rankingContestRoute");
const resetPassword = require("./routes/resetPasswordRoute");
const chat = require("./routes/chatRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");

//using
app.use(account);
app.use(news);
app.use(problem);
app.use(tagProblem);
app.use(submission);
app.use(contest);
app.use(rulesContest);
app.use(rankingContest);
app.use(resetPassword);
app.use(chat);
app.use(courseRoute);
app.use(categoryRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
