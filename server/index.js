const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'default_super_secret_key_for_dev';

const allowedOrigins = [
    'http://localhost:5173',
    'https://car-dashboard-project.vercel.app'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const carsFilePath = path.join(dataDir, 'cars.csv');
const usersFilePath = path.join(dataDir, 'users.csv');

let allCarsData = [];
const ORIGIN_MAP = { '1': 'USA', '2': 'Europe', '3': 'Japan' };

const processRawCarData = (rawCar) => ({
    name: rawCar['car name'],
    mpg: parseFloat(rawCar.mpg),
    cylinders: parseInt(rawCar.cylinders, 10),
    displacement: parseFloat(rawCar.displacement),
    horsepower: rawCar.horsepower === '?' ? null : parseFloat(rawCar.horsepower),
    weight: parseInt(rawCar.weight, 10),
    acceleration: parseFloat(rawCar.acceleration),
    modelYear: parseInt(rawCar['model year'], 10),
    origin: ORIGIN_MAP[rawCar.origin] || 'Unknown',
});

const loadCarData = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        if (!fs.existsSync(carsFilePath)) {
            console.warn('cars.csv not found.');
            return resolve([]);
        }
        fs.createReadStream(carsFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(processRawCarData(data)))
            .on('end', () => {
                allCarsData = results;
                console.log(`${allCarsData.length} car records loaded and processed.`);
                resolve();
            })
            .on('error', (error) => reject(error));
    });
};

const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        if (!fs.existsSync(filePath)) {
            return resolve([]);
        }
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

const writeCSV = (filePath, data) => {
    return new Promise((resolve, reject) => {
        if (data.length === 0) return resolve();
        const headersArray = Object.keys(data[0]);
        const headers = headersArray.join(',');
        const rows = data.map(row => 
            headersArray.map(header => row[header] || '').join(',')
        );
        const csvString = `${headers}\n${rows.join('\n')}`;
        fs.writeFile(filePath, csvString, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

app.get('/api', (req, res) => {
    res.json({ message: 'API is running successfully.' });
});

app.get('/api/cars', (req, res) => {
    try {
        let filteredCars = [...allCarsData];
        const { q, cylinders, origin, mpg_from, mpg_to, year_from, year_to } = req.query;

        if (q) filteredCars = filteredCars.filter(car => car.name.toLowerCase().includes(q.toLowerCase()));
        if (cylinders) filteredCars = filteredCars.filter(car => car.cylinders === parseInt(cylinders, 10));
        if (origin) filteredCars = filteredCars.filter(car => car.origin === origin);
        if (mpg_from) filteredCars = filteredCars.filter(car => car.mpg >= parseFloat(mpg_from));
        if (mpg_to) filteredCars = filteredCars.filter(car => car.mpg <= parseFloat(mpg_to));
        if (year_from) filteredCars = filteredCars.filter(car => car.modelYear >= parseInt(year_from, 10));
        if (year_to) filteredCars = filteredCars.filter(car => car.modelYear <= parseInt(year_to, 10));

        res.json(filteredCars);
    } catch (error) {
        console.error('Error filtering car data:', error);
        res.status(500).json({ message: 'Error filtering car data' });
    }
});

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: 'Request body is missing or malformed. Ensure Content-Type header is set to application/json.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.'});
        }
        const users = await readCSV(usersFilePath);
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, password: hashedPassword };
        users.push(newUser);
        await writeCSV(usersFilePath, users);
        res.status(201).json({ message: 'User created successfully. Please log in.' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: 'Request body is missing or malformed.' });
        }
        const users = await readCSV(usersFilePath);
        const user = users.find(u => u.email === email);
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { email: user.email } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

loadCarData()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Failed to load car data:', error);
        process.exit(1);
    });