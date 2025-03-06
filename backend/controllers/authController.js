const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Benutzer existiert bereits' });
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
  } catch (error) {
    res.status(500).json({ message: 'Registrierung fehlgeschlagen', error: error.message });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 Stunde
    await user.save();

    // E-Mail senden
    const transporter = nodemailer.createTransport({
      // Konfiguriere hier deinen E-Mail-Service
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Passwort zurücksetzen',
      text: `Du erhältst diese E-Mail, weil du (oder jemand anderes) das Zurücksetzen des Passworts für dein Konto angefordert hast.

Bitte klicke auf den folgenden Link oder füge ihn in deinen Browser ein, um den Vorgang abzuschließen:

http://${req.headers.host}/reset/${resetToken}

Wenn du dies nicht angefordert hast, ignoriere bitte diese E-Mail und dein Passwort bleibt unverändert.`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Eine E-Mail wurde gesendet mit weiteren Anweisungen.' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Zurücksetzen des Passworts', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Passwort-Reset-Token ist ungültig oder abgelaufen' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Zurücksetzen des Passworts', error: error.message });
  }
};
exports.logout = async (req, res) => {
  try {
    // Hier kannst du den Token ungültig machen, wenn du eine Blacklist verwendest
    res.json({ message: 'Benutzer erfolgreich ausgeloggt' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Logout', error: error.message });
  }
};