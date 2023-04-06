import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
// Schema
const fundsSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    notes: {
      type: String,
      required: false
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  });

// Plugins
fundsSchema.plugin(aggregatePaginate);
fundsSchema.plugin(AutoIncrement(mongoose), {
  id: 'funds_seq',
  inc_field: 'id'
});

// Indexes
fundsSchema.index({ id: 1 });

const Model = model('Funds', fundsSchema);

export default Model;
