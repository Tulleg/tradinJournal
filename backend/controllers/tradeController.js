const Trade = require('../models/Trade');

// Funktion zum Erstellen eines neuen Trades
exports.createTrade = async (req, res) => {
    try {
      const trade = new Trade({
        ...req.body,
        account: req.user.userId
      });
      await trade.save();
      res.status(201).json(trade);
    } catch (error) {
      res.status(400).json({ message: 'Fehler beim Erstellen des Trades', error: error.message });
    }
  };
  

// Funktion zum Abrufen aller Trades eines Benutzers
exports.getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ account: req.user.userId });
    res.json(trades);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Abrufen der Trades', error: error.message });
  }
};

// Funktion zum Aktualisieren eines Trades
exports.updateTrade = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const trade = await Trade.findOneAndUpdate(
      { _id: tradeId, account: req.user.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!trade) {
      return res.status(404).json({ message: 'Trade nicht gefunden oder kein Zugriff' });
    }

    res.json(trade);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Aktualisieren des Trades', error: error.message });
  }
};

// Funktion zum Löschen eines Trades
exports.deleteTrade = async (req, res) => {
  try {
    const { tradeId } = req.params;
    const trade = await Trade.findOneAndDelete({ _id: tradeId, account: req.user.userId });

    if (!trade) {
      return res.status(404).json({ message: 'Trade nicht gefunden oder kein Zugriff' });
    }

    res.json({ message: 'Trade erfolgreich gelöscht' });
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Löschen des Trades', error: error.message });
  }
};
