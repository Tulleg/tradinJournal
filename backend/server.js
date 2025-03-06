
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');




const app = express();

app.use(express.json());
app.use(cors());

// Routes einbinden
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

// Starte den Server nur, wenn er direkt ausgeführt wird
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB verbunden');
      app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
    })
    .catch((err) => console.error('MongoDB Verbindungsfehler:', err));
}

module.exports = app; // Exportiere nur die App-Instanz
