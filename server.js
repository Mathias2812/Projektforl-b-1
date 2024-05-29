const express = require("express")
const bodyParser = require("body-parser")
const app = express();
const db = require("./queries");
const port = process.env.PORT || 4000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

require("dotenv").config();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
     extended: true,
    })
);

const path = require("path")
app.use(express.static(path.join(__dirname, "/")))

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
  });

app.get("/Data", db.getData);
app.post("/insert-Data", db.insertData);
app.post("/populate", db.populateData);
app.get('/data/mwiOutliers', db.getmwiOutliers);  
app.get('/data/wasteOutliers', db.getwasteOutliers);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});

