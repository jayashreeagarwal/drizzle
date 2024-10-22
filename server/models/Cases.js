const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: 'This field is required.'
    },
});
module.exports = mongoose.model('Cases', caseSchema);