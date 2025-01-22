const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Coffee server is Running");
});

app.listen(port, () => {
  console.log(`Coffee server is Running in port: ${port}`);
});
