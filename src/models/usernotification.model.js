import mongoose, { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import AutoIncrement from 'mongoose-sequence';
// Schema
const usernotificationSchema = new Schema({
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
usernotificationSchema.plugin(aggregatePaginate);
usernotificationSchema.plugin(AutoIncrement(mongoose), {
    id: 'usernotification_seq',
    inc_field: 'id'
});

// Indexes
usernotificationSchema.index({ id: 1 });

const Model = model('usernotification', usernotificationSchema);

export default Model;