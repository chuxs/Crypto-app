import express from 'express';
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Public")));

app.get("/", (req, res) => {
    res.render("index.ejs", {result: null});
});

app.get("/submit", async (req, res) => {

    try {
    const coinSymbol = req.query["coinInput"];

    const apiEndpoint = await axios.get('http://api.coinlayer.com/list?access_key=a83ff3e03467ee9c6464eaddd682ed78')
    const result = apiEndpoint.data;

    console.log(result.crypto[coinSymbol]);
        
    } catch (error) {
        console.error("Error fetching coin data:", error);
        return res.status(500).send("Internal Server Error");
        
    }

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});