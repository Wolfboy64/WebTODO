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

app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
app.get('/user/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
/* users tábla szerkezete:
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `create_at` datetime NOT NULL
*/
app.post('/users', async (req, res) => {
    const { name, email, create_at } = req.body;
    try {
        if (!name || !email) {
            return res.status(400).json({ error: 'name and email are required' });
        }

        const createAtDate = create_at ? new Date(create_at) : new Date();
        if (Number.isNaN(createAtDate.getTime())) {
            return res.status(400).json({ error: 'create_at must be a valid date' });
        }

        const [result] = await pool.execute('INSERT INTO users (name, email, create_at) VALUES (?, ?, ?)', [name, email, createAtDate]);
        res.json({ id: result.insertId, name, email, create_at: createAtDate });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Failed to insert data' });
    }

});
app.put('/users/:id', async (req, res) => {
    const { name, email, create_at } = req.body;
    try {
        if (!name || !email) {
            return res.status(400).json({ error: 'name and email are required' });
        }
        const createAtDate = create_at ? new Date(create_at) : new Date();
        if (Number.isNaN(createAtDate.getTime())) {
            return res.status(400).json({ error: 'create_at must be a valid date' });
        }
        const [result] = await pool.execute('UPDATE users SET name = ?, email = ?, create_at = ? WHERE id = ?', [name, email, createAtDate, req.params.id]);
        if (result.affectedRows === 0) {

            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ id: req.params.id, name, email, create_at: createAtDate });
    }
    catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Failed to update data' });
    }
});
app.delete('/users/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Failed to delete data' });
    }
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});