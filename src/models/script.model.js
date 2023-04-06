import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
// Schema
const scriptSchema = new Schema({
    scriptname: {
      type: String,
      required: true
    },
    segment: {
        type: String,
        enum: ['mcx', 'eq'],
        required: true
    },
    deleted_at: {
      type: Date,
      default: null
    }

  }, { timestamps: true });

// Plugins
scriptSchema.plugin(aggregatePaginate);
scriptSchema.plugin(AutoIncrement(mongoose), {
  id: 'script_seq',
  inc_field: 'id'
});

// Indexes
scriptSchema.index({ id: 1 });

const Model = model('script', scriptSchema);

export default Model;