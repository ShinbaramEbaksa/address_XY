import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { parseStringPromise } from 'xml2js';

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY || '6AF229F1-482F-3323-942F-37D854F22E2A'; // 환경 변수 또는 기본 API 키
const API_URL = 'https://api.vworld.kr/req/address?service=address&request=getcoord&version=2.0&crs=epsg:4326';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.get('/coordinates', async (req, res) => {
    try {
        const address = req.query.address;
        if (!address) {
            return res.status(400).json({ error: '주소를 제공해야 합니다.' });
        }

        const response = await fetch(`${API_URL}&address=${encodeURIComponent(address)}&refine=true&simple=false&format=xml&type=road&key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.text();
        const parsedData = await parseStringPromise(data);

        if (parsedData.response.status[0] === "OK" && parsedData.response.result && parsedData.response.result[0].point) {
            const x = parseFloat(parsedData.response.result[0].point[0].x[0]);
            const y = parseFloat(parsedData.response.result[0].point[0].y[0]);
            res.json({ x, y });
        } else {
            res.status(400).json({ error: '주소를 변환할 수 없음' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
