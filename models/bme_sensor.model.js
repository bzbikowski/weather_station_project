var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Creation of document schema
var GeneralSchema = new Schema({
    time: {type: Date, required: true},
    temp_value: {type: Number, required: true},
    hum_value: {type: Number, required: true},
    pres_value: {type: Number, required: true}
});


// Export the model
module.exports = mongoose.model('Data', GeneralSchema);

