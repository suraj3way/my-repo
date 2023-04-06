import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
import bcrypt from 'bcrypt';
// Schema
const brokerSchema = new Schema({
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    contact: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
   
  },{timestamps: true});
  

// Plugins
brokerSchema.plugin(aggregatePaginate);
brokerSchema.plugin(AutoIncrement(mongoose), {
  id: 'broker_seq',
  inc_field: 'id'
});

// Statics
brokerSchema.statics.compare = async (candidatePassword, password) => {
  return await bcrypt.compareSync(candidatePassword, password);
};

// Hooks
brokerSchema.pre('save', async function () {
  const user = this;
  if (user.password) {
    const hash = await bcrypt.hashSync(user.password, 10);
    user.password = hash;
  }
});

brokerSchema.pre('updateOne', async function () {
  const user = this._update;
  if (user.password) {
    const hash = await bcrypt.hashSync(user.password, 10);
    this._update.password = hash;
  }
});

brokerSchema.pre('updateMany', async function () {
  const user = this._update;
  if (user.password) {
    const hash = await bcrypt.hashSync(user.password, 10);
    this._update.password = hash;
  }
});

// Indexes
brokerSchema.index({ id: 1 });


const Model = model('Broker', brokerSchema);

export default Model;
