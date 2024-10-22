const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: 'This field is required.'
    },
    file: {
        type: String,
        required: 'This field is required.'
    },
    case: {
        type: String,
        required: 'This field is required.'
    },
});
fileSchema.index({ name: 'text', case: 'text'})
module.exports = mongoose.model('Files', fileSchema);