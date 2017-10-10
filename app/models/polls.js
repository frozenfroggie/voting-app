var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var pollsSchema = new Schema({
  title: String,
  labelsNames: Array,
  labels: Object,
  owner: String
});

module.exports = mongoose.model('PoolsModel', pollsSchema);