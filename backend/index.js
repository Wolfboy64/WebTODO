import mysql from 'mysql2/promise';
import cors from 'cors';
import express from 'express';


const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gyakorlas',
    port: 3306
};
const pool = mysql.createPool(dbConfig);

app.get('/api/data', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});