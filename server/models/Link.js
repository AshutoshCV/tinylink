import mongoose from 'mongoose';
import validator from 'validator';

const linkSchema = new mongoose.Schema({
    shortCode: {
        type: String,
        required: true,
        unique: true,
        match: [/^[A-Za-z0-9]{6,8}$/, 'Short code must be 6-8 alphanumeric characters']
    },

    originalUrl: {
        type: String,
        required: true,
        validate: function(v){
            return validator.isURL(v, {
                require_protocol:true,
                require_valid_protocol: true,
            });
        },
        message: 'Invalid URL Format'
    },
    clicks:{
        type: Number,
        default: 0
    },
    lastClicks:{
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// indexing for faster lookups

linkSchema.index({shortCode: 1});
linkSchema.index({createdAt: -1});

export default mongoose.model('Link', linkSchema);