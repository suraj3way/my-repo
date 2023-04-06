import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
// Schema
const ledgerSchema = new Schema({
    trade_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trades',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    broker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Broker',
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    brokerage: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['buy', 'sell'],
      default: 'buy',
      required: true,
    }
  }, { timestamps: true });
  

// Plugins
ledgerSchema.plugin(aggregatePaginate);
ledgerSchema.plugin(AutoIncrement(mongoose), {
  id: 'ledger_seq',
  inc_field: 'id'
});

// Indexes
ledgerSchema.index({ id: 1 });

const Model = model('Ledger', ledgerSchema);

export default Model;
