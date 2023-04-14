import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
// Schema
const adminnotificationSchema = new Schema({
    fcm_token: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true });

// Plugins
adminnotificationSchema.plugin(aggregatePaginate);
adminnotificationSchema.plugin(AutoIncrement(mongoose), {
    id: 'adminnotification_seq',
    inc_field: 'id'
});

// Indexes
adminnotificationSchema.index({ id: 1 });

const Model = model('adminnotification', adminnotificationSchema);

export default Model;