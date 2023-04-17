import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
// Schema
const tradesSchema = new Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    script: {
      type: String,
      required: true
    },
    segment: {
      type: String,
      enum: ['mcx', 'eq'],
      required: true
    },
    buy_rate: {
      type: Number
    },
    sell_rate: {
      type: Number
    },
    units: {
      type: Number,
      required: true,
      default: 0
    },
    lots:{
      type: Number,
      required: true,
      default: 0
    },
    lot_size:{
      type: Number,
      required: true,
      default: 1
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'closed'],
      default: 'pending',
      required: true,
    },
    profit:{
      type: Number,
      default:0
    },
    loss:{
      type: Number,
      default:0
    },
    purchaseType: {
      type: String,
      enum: ['buy', 'sell'],
      required: true
    },
    // orderType: {
    //   type: String,
    //   enum: ['buy', 'sell'],
    //   required: false
    // },
    isDirect: {
      type: Boolean,
      require: true
    },
    isCancel: {
      type: Boolean,
      default: false
    },
    tradeType: {
      type: String,
      enum: ['market', 'order'],
      required: true
    },
    soldBy: {
      type: String,
      enum: ['trader', 'admin'],
      required: true
    },
  }, { timestamps: true });
  

// Plugins
tradesSchema.plugin(aggregatePaginate);
tradesSchema.plugin(AutoIncrement(mongoose), {
  id: 'treads_seq',
  inc_field: 'id'
});

// Indexes
tradesSchema.index({ id: 1 });

const Model = model('Trades', tradesSchema);

export default Model;
