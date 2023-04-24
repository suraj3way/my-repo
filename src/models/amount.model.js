import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
// Schema
const amountSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require:true
    },
    funds: {
      type: Number,
      default: 0
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

// Plugins
amountSchema.plugin(aggregatePaginate);
amountSchema.plugin(AutoIncrement(mongoose), {
  id: 'amount_seq',
  inc_field: 'id'
});

// Indexes
amountSchema.index({ id: 1 });

const Model = model('amount', amountSchema);

export default Model;
