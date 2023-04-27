import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
import bcrypt from 'bcrypt';

// Schema
const adminSchema = new Schema({
    role: {
      type: String,
      enum: ['admin', 'broker'],
      default: 'admin'
    },
    fullname: {
      type: String,
      required: true
    },
    mobile: {
      type: Number,
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
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  });
  

// Plugins
adminSchema.plugin(aggregatePaginate);
adminSchema.plugin(AutoIncrement(mongoose), {
  id: 'admin_seq',
  inc_field: 'id'
});

// Statics
// adminSchema.statics.compare = async (candidatePassword, password) => {
//   return await bcrypt.compareSync(candidatePassword, password);
// };

// // Hooks
// adminSchema.pre('save', async function () {
//   const user = this;
//   if (user.password) {
//     const hash = await bcrypt.hashSync(user.password, 10);
//     user.password = hash;
//   }
// });

// adminSchema.pre('updateOne', async function () {
//   const user = this._update;
//   if (user.password) {
//     const hash = await bcrypt.hashSync(user.password, 10);
//     this._update.password = hash;
//   }
// });

// adminSchema.pre('updateMany', async function () {
//   const user = this._update;
//   if (user.password) {
//     const hash = await bcrypt.hashSync(user.password, 10);
//     this._update.password = hash;
//   }
// });

// Indexes
adminSchema.index({ id: 1 });

const Model = model('Admin', adminSchema);

export default Model;
