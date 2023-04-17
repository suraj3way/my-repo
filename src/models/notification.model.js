import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
// Schema
const notificationSchema = new Schema({
    User_type: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin'
    },
    notification: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

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