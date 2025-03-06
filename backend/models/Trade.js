const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  tradeNumber: {
    type: Number,
    unique: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  symbol: {
    type: String,
    required: true
  },
  model: {
    type: String,
    default: ''
  },
  bias: {
    type: String,
    enum: ['Bearish', 'Bullish'],
    required: true
  },
  session: {
    type: String,
    enum: ['Asia', 'London', 'NY'],
    required: true
  },
  timeframe: {
    type: String,
    default: ''
  },
  confluences: {
    type: [String],
    default: []
  },
  orderType: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    enum: ['Buy', 'Sell'],
    required: true
  },
  status: {
    type: String,
    enum: ['Closed by Stoploss', 'Closed manually', 'Closed by TP'],
    required: true
  },
  slPips: {
    type: Number,
    default: 0
  },
  riskPercentage: {
    type: Number,
    default: 0
  },
  netPnL: {
    type: Number,
    default: 0
  },
  maxRR: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

tradeSchema.pre('save', async function(next) {
  if (!this.tradeNumber) {
    const lastTrade = await this.constructor.findOne({}, {}, { sort: { 'tradeNumber': -1 } });
    this.tradeNumber = lastTrade && lastTrade.tradeNumber ? lastTrade.tradeNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Trade', tradeSchema);
