import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
// Schema
const tradingClientsSchema = new Schema({
    Name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    credit_limit: {
      type: Number,
      required: true
    },
    ledger_balance: {
      type: Number,
      required: true
    },
    gross_PL: {
      type: Number,
      required: true
    },
    brokerage: {
      type: Number,
      required: true
    },
    net_PL: {
      type: Number,
      required: true
    },
    admin: {
      type: Boolean,
      required: true
    },
    demo_acc: {
      type: Boolean,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Inactive']
    },
    created_by: {
      type: Number,
      required: true
    }
  }, { timestamps: true });
  

// Plugins
tradingClientsSchema.plugin(aggregatePaginate);
tradingClientsSchema.plugin(AutoIncrement(mongoose), {
  id: 'tradingClient_seq',
  inc_field: 'id'
});

// Indexes
tradingClientsSchema.index({ id: 1 });

const Model = model('TradingClient', tradingClientsSchema);

export default Model;
