const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/dbConnection'); 

const orderRoutes = require('./routes/orderRoutes');

// Routes
const productRoutes = require('./routes/productRoutes');

const userProfileRoutes = require('./routes/userProfileRoutes')

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ഇമേജുകൾ കാണാൻ ഇത് അത്യാവശ്യമാണ്
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api/products', productRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/users', userProfileRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});