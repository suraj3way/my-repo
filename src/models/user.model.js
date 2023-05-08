import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
import bcrypt from 'bcrypt';

// Schema
const schema = new Schema({
  user_id: {
    type: String,
    required: true,
    index: { unique: true }
  },
  phone: {
    type: String,
    trim: true,
    uppercase: true,
    index: { unique: true }
  },
  email: {
    type: String,
    trim: true,
    uppercase: true,
    index: { unique: true }
  },
  name: {
    type: String,
    uppercase: true,
    trim: true,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    uppercase: true,
    trim: true,
    required: true
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  permissions: {
    type: Array,
    default: ['user']
  },
  code_verification: {
    type: String,
    default: null
  },
  creditLimit: {
    type: Number,
    required: true
  },
  funds: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['Broker'],
    required: true
  },
  broker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Broker'
  },
  maxTradesAllowed: {
    type: Number,
    required: true
  },
  accountStatus: {
    type: Boolean,
    required: true
  },
  autoClosePercentageBalance: {
    type: Number,
    required: true
  },
  notifyPercentageBalance: {
    type: Number,
    required: true
  },
  profitLossShareToBroker: {
    type: Number,
    required: true
  },
  mcxTrading: {
    type: Boolean,
    required: true
  },
  maxLotSizeRequiredPerSingleTradeMCX: {
    type: Number,
    required: true
  },
  maxLotSizeAllowedPerSingleTradeMCX: {
    type: Number,
    required: true
  },
  maxLotSizeAllowedPerScriptActivelyOpenMCX: {
    type: Number,
    required: true
  },
  maxLotSizeAllowedOverallActivelyOpenMCX: {
    type: Number,
    required: true
  },
  mcxBrokerageType: {
    type: String,
    enum: ['Per Crore Basis'],
    required: true
  },
  mcxBrokeragePerCrore: {
    type: Number,
    required: true
  },
  intradayExposureMarginMCX: {
    type: Number,
    required: true
  },
  holdingExposureMarginMCX: {
    type: Number,
    required: true
  },
  MGOLD_intraday: {
    type: Number,
    required: true
  },
  MGOLD_holding: {
    type: Number,
    required: true
  },
  MSILVER_intraday: {
    type: Number,
    required: true
  },
  MSILVER_holding: {
    type: Number,
    required: true
  },
  BULLDEX_intraday: {
    type: Number,
    required: true
  },
  BULLDEX_holding: {
    type: Number,
    required: true
  },
  GOLD_intraday: {
    type: Number,
    required: true
  },
  GOLD_holding: {
    type: Number,
    required: true
  },
  SILVER_intraday: {
    type: Number,
    required: true
  },
  SILVER_holding: {
    type: Number,
    required: true
  },
  CRUDEOIL_intraday: {
    type: Number,
    required: true
  },
  CRUDEOIL_holding: {
    type: Number,
    required: true
  },
  COPPER_intraday: {
    type: Number,
    required: true
  },
  COPPER_holding: {
    type: Number,
    required: true
  },
  EQTrading: {
    type: Boolean,
    required: true
  },
  EQBrokragePerCrore: {
    type: Number,
    required: true
  },
  intradayExposureMarginEQ: {
    type: Number,
    required: true
  },
  holdingExposureMarginEQ: {
    type: Number,
    required: true
  },
  EQOrderAwayByPercentFromCurrentPrice: {
    type: Number,
    required: true
  },
  minLotSizeRequiredPerSingleTradeEQFUT: {
    type: Number,
    required: true
  },
  minLotSizeRequiredPerSingleTradeEQFUTINDEX: {
    type: Number,
    required: true
  },
  maxLotSizeAllowedPerScriptActivelyOpenEQ: {
    type: Number,
    required: true
  },
  maxLotSizeAllowedOverallActivelyOpenEQ: {
    type: Number,
    required: true
  },
  maxLotSizeRequiredPerSingleTradeEQFUT: {
    type: Number,
    required: true
  },
  maxLotSizeRequiredPerSingleTradeEQFUTINDEX: {
    type: Number,
    required: true
  },
  maxLotSizeAllowedPerScriptActivelyOpenEQINDEX: {
    type: Number,
    required: true
  },
  maxLotSizeAllowedOverallActivelyOpenEQINDEX: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  deleted_at: {
    type: Date,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String
  },
  equityTradeType: {
    type: String,
    enum: ['units', 'lots'],
    required: true
  }
});

// Plugins
schema.plugin(aggregatePaginate);
schema.plugin(AutoIncrement(mongoose), { id: 'user_seq', inc_field: 'id' });

// Statics
// schema.statics.compare = async (candidatePassword, password) => {
//   return await bcrypt.compareSync(candidatePassword, password);
// };

// // Hooks
// schema.pre('save', async function () {
//   const user = this;
//   if (user.password) {
//     const hash = await bcrypt.hashSync(user.password, 10);
//     user.password = hash;
//   }
// });

// schema.pre('updateOne', async function () {
//   const user = this._update;
//   if (user.password) {
//     const hash = await bcrypt.hashSync(user.password, 10);
//     this._update.password = hash;
//   }
// });

// schema.pre('updateMany', async function () {
//   const user = this._update;
//   if (user.password) {
//     const hash = await bcrypt.hashSync(user.password, 10);
//     this._update.password = hash;
//   }
// });

// Indexes
schema.index({ id: 1 });

const Model = model('User', schema);

export default Model;
