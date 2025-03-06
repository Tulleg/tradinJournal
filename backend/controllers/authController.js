const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
  } catch (error) {
    res.status(400).json({ message: 'Registrierung fehlgeschlagen', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Anmeldung fehlgeschlagen', error: error.message });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  // Implementierung für Passwort-Reset-Anfrage
};

exports.resetPassword = async (req, res) => {
  // Implementierung für Passwort-Reset
};
