const mongoose = require('mongoose');
const supertest = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Importiere nur die App-Instanz
const User = require('../models/User');
const Trade = require('../models/Trade');

const request = supertest(app);
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); // In-Memory-MongoDB starten
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
    
  
});
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

afterAll(async () => {
  await mongoose.disconnect(); // Verbindung trennen
  await mongoServer.stop(); // In-Memory-MongoDB stoppen
});

describe('Trade API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Benutzer erstellen und einloggen
    const user = new User({ email: 'test@example.com', password: 'password123' });
    await user.save();
    userId = user._id;

    const loginResponse = await request
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    token = loginResponse.body.token;
  });

  afterEach(async () => {
    await User.deleteMany(); // Testdaten löschen
    await Trade.deleteMany();
  });

  test('sollte einen neuen Trade erstellen', async () => {
    const response = await request
      .post('/api/trades')
      .set('Authorization', `Bearer ${token}`)
      .send({
        symbol: 'EURUSD',
        bias: 'Bullish',
        session: 'London',
        position: 'Buy',
        status: 'Closed manually',
        netPnL: 100,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('tradeNumber');
    expect(response.body.symbol).toBe('EURUSD');
  });

  test('sollte alle Trades eines Benutzers abrufen', async () => {
    // Erstelle einige Test-Trades
    await Trade.create([
      { account: userId, symbol: 'EURUSD', bias: 'Bullish', session: 'London', position: 'Buy', status: 'Closed manually', tradeNumber: 1 },
      { account: userId, symbol: 'GBPUSD', bias: 'Bearish', session: 'NY', position: 'Sell', status: 'Closed by TP', tradeNumber: 2 }
    ]);
  
    const response = await request
      .get('/api/trades')
      .set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('tradeNumber');
    expect(response.body[1]).toHaveProperty('tradeNumber');
  });
  

  test('sollte einen Trade aktualisieren', async () => {
    const trade = await Trade.create({
      account: userId,
      symbol: 'EURUSD',
      bias: 'Bullish',
      session: 'London',
      position: 'Buy',
      status: 'Closed manually',
    });

    const response = await request
      .put(`/api/trades/${trade._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ netPnL: 150 });

    expect(response.status).toBe(200);
    expect(response.body.netPnL).toBe(150);
  });

  test('sollte einen Trade löschen', async () => {
    const trade = await Trade.create({
      account: userId,
      symbol: 'EURUSD',
      bias: 'Bullish',
      session: 'London',
      position: 'Buy',
      status: 'Closed manually',
    });

    const response = await request.delete(`/api/trades/${trade._id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Trade erfolgreich gelöscht');

    const deletedTrade = await Trade.findById(trade._id);
    expect(deletedTrade).toBeNull();
  });
});
