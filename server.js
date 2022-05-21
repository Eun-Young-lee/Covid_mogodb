const express = require('express');
const res = require('express/lib/response');
const app = express();
const mongoose = require('mongoose');
const { create } = require('./models/Thread');
const PORT = 3000;
const Thread = require('./models/Thread');
app.use(express.json());
app.use(express.static('public'));

require('dotenv').config();


  mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('db connected'))
  .catch((err) => console.log(err));

app.get("/api/v1/threads", async (req, res) => {
  try {
    const allThreads = await Thread.find({});
    res.status(200).json(allThreads);
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/thread", async (req, res) => {
  try {
    const createThread = await Thread.create(req.body);
    res.status(200).json(createThread);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, ()=> console.log("server running"));