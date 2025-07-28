import express from 'express';
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, child, get, remove  } from "firebase/database";


const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBq2Ps9I6l1CHe8NscfHd7xqTCc_iq7fYg",
  databaseURL: "https://anya-crypto-price-default-rtdb.europe-west1.firebasedatabase.app",
  authDomain: "anya-crypto-price.firebaseapp.com",
  projectId: "anya-crypto-price",
  storageBucket: "anya-crypto-price.firebasestorage.app",
  messagingSenderId: "596722593659",
  appId: "1:596722593659:web:7b24b51c395125e8a597de",
  measurementId: "G-68MXTFT67P"
};

// Initialize Firebase
const cryptoApp = initializeApp(firebaseConfig);
const database = getDatabase(cryptoApp);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Public")));

app.get("/", (req, res) => {
    const postListRef = ref(database, 'coinsAdded/');

    get(postListRef).then((snapshot) => {
        if (snapshot.exists()) {
            const coinList = Object.values(snapshot.val()); // Convert object to list
            console.log(coinList); // Array of post objects
            res.render("index.ejs", { coinList });
        } else {
            res.render("index.ejs", { coinList: null });
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

});

app.get("/submit", async (req, res) => {

    try {
    const coinSymbol = req.query["coinInput"];

    const [apiData, apiUSDComparison] = await Promise.all([

      axios.get('http://api.coinlayer.com/list?access_key=a83ff3e03467ee9c6464eaddd682ed78'),
      axios.get(`https://api.coinlore.net/api/tickers`)
    ]);

    const result = apiData.data;
    const resultUSD = apiUSDComparison.data;

    // console.log("Coin Data:", result.crypto[coinSymbol]);

    for (let i =0; i < resultUSD.data.length; i++) {
        if (resultUSD.data[i].symbol === coinSymbol) {
            // console.log("Coin Data:", resultUSD.data[i]);

            const newResultUSD = resultUSD.data[i];

             set(ref(database, 'coinsAdded/' + `${result.crypto[coinSymbol].name}`), {
             contentID: result.crypto[coinSymbol].name,
             iconUrl: result.crypto[coinSymbol].icon_url,
             coinName: result.crypto[coinSymbol].name,
             coinSymbol: result.crypto[coinSymbol].symbol,
             coinPrice: resultUSD.data[i].price_usd,
             coinVolume24: resultUSD.data[i].volume24,
            });

            const coinListRef = ref(database, 'coinsAdded/');

            get(coinListRef).then((snapshot) => {
                const coinList = Object.values(snapshot.val()); // Convert object to list
                res.render("index.ejs", { coinList, result: result.crypto[coinSymbol], resultUSD: newResultUSD });
            }).catch((error) => {
                console.error(error);
            });
        }
    }
    } catch (error) {
        console.error("Error fetching coin data:", error);
        return res.status(500).send("Internal Server Error");
        
    }

});

app.post("/delete", (req, res) => {
    const coinId = req.body['coinId'];

    const coinRef = ref(database, 'coinsAdded/' + coinId);

    remove(coinRef).then(() => {
        // console.log("Coin removed successfully");
        res.redirect("/");
    }).catch((error) => {
        // console.error("Error removing coin:", error);
        res.status(500).send("Internal Server Error");
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});