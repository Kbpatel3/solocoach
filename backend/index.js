const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const quoteRoutes = require('./routes/quote');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount the routes
app.use('/api/quotes', quoteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});