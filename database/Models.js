// Create schema and model (schema defines document structure, requirements and data types)
module.exports = function (mongoose) {
  var Schema = mongoose.Schema;
  var playerSchema = new Schema({
    nick: { type: String },
    pozX: { type: Number },
    pozY: { type: Number },
    pozZ: { type: Number },
    size: { type: Number, min: 1, max: 4 },
    rotate: { type: Number, min: 0, max: 3 },
    color: { type: String }
  });

  // The object we want to export from this file
  var models = {
    Player: mongoose.model("Player", playerSchema)  
  }

  return models;
}