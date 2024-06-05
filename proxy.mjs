import express from 'express';
import fetch from 'node-fetch';

const app = express();

const API_KEY = 'YOUR_API_KEY';
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
        const response = await fetch(`${API_URL}&address=${encodeURIComponent(address)}&refine=true&simple=false&format=json&type=parcel&key=${API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
