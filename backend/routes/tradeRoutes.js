const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const auth = require('../middleware/auth');

// Route zum Erstellen eines neuen Trades
router.post('/', auth, tradeController.createTrade);

// Route zum Abrufen aller Trades eines Benutzers
router.get('/', auth, tradeController.getTrades);

// Route zum Aktualisieren eines bestehenden Trades
router.put('/:tradeId', auth, tradeController.updateTrade);

// Route zum Löschen eines bestehenden Trades
router.delete('/:tradeId', auth, tradeController.deleteTrade);

//Anzahl Trades abrufen
router.get('/count', auth, tradeController.getTradeCount);

module.exports = router;
