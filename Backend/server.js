const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- Database Connection ---
// (We are keeping this hardcoded for now since it works)
const dbLink = "mongodb+srv://Minhaj:password321@minhaj.ow5cny3.mongodb.net/?appName=Minhaj&retryWrites=true&w=majority";

mongoose.connect(dbLink)
    .then(() => console.log('   | DATABASE: CONNECTED (Atlas) |'))
    .catch((err) => console.error('   | DATABASE: FAILED TO CONNECT |', err));

// --- THE BLUEPRINT (Schema) ---
// This tells Mongo what a "Weapon" looks like
const WeaponSchema = new mongoose.Schema({
    name: String,
    type: String,
    damage: Number
});

const Weapon = mongoose.model('Weapon', WeaponSchema);

// --- ROUTES ---

// 1. Home Check
app.get('/', (req, res) => {
    res.send('Yautja Prime Online. Database Link Active.');
});

// 2. GET: Fetch all weapons from the cloud
app.get('/api/weapons', async (req, res) => {
    try {
        const weapons = await Weapon.find();
        res.json(weapons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. POST: Add a new weapon to the cloud
// UPDATE a weapon
// 3. POST: Add a new weapon to the cloud
app.post('/api/weapons', async (req, res) => {
    try {
        const newWeapon = new Weapon(req.body);
        await newWeapon.save(); // Saves to MongoDB Atlas
        res.status(201).json(newWeapon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// --- IGNITION ---
app.listen(PORT, () => {
    console.log(`
    __________________________
   | YAUTJA LINK ESTABLISHED  |
   | PORT: ${PORT}               |
   | CLOAKING: ENABLED        |
   |__________________________|
    `);
});