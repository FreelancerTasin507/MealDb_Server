const express = require('express')
const app = express()
const port = process.env.PORT || 5500;
require("dotenv").config();
const cors = require("cors");

const meals = './Data/meals.json'

app.use(cors());
app.use(express.json());




app.get("/meals", async (req, res) => {
    res.send(meals);
  });



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})