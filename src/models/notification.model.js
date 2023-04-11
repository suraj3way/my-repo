import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
// Schema
const notificationSchema = new Schema({
    admin_id: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
      },
    FCM_token: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true });

// Plugins
notificationSchema.plugin(aggregatePaginate);
notificationSchema.plugin(AutoIncrement(mongoose), {
    id: 'notification_seq',
    inc_field: 'id'
});

// Indexes
notificationSchema.index({ id: 1 });

const Model = model('notification', notificationSchema);

export default Model;