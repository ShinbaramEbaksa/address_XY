import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

const API_KEY = '6AF229F1-482F-3323-942F-37D854F22E2A';
const API_URL = 'https://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get('/address', async (req, res) => {
    try {
        const address = req.query.address;
        const response = await fetch(`${API_URL}&address=${encodeURIComponent(address)}&refine=true&simple=false&format=xml&type=road&key=${API_KEY}`);
        const data = await response.text(); // XML 형식이므로 .text() 사용
        res.header('Content-Type', 'application/xml');
        res.send(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
