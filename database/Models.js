// Utworzenie tzw. schematu i modelu (schemat określa budowę dokumentu, wymagania i typy danych)
module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var playerSchema = new Schema(
        {
			nick: { type: String },
            pozX: { type: Number },
            pozY: { type: Number },
            pozZ: { type: Number },
            size: { type: Number, min: 1, max: 4 },
			rotate: { type: Number, min: 0, max: 3 },
            color: { type: String }
        });
    // Obiekt, który chcemy wyeksportować z tego pliku
    var models = {
        Player: mongoose.model("Player", playerSchema)  
    }
    return models;
}