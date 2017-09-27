// Export obiektu zawierającego podstawowe operacje na bazie MongoDB za pomocą biblioteki Mongoose
module.exports = function () {
    var opers = {
        // wstawienie jednego "rekordu" do dokumentu - INSERT
        InsertOne: function (data) {
            data.save(function (error, data, dodanych) {
                console.log("Dodano: " + data)
            })
        },
        // pobranie wszystkich "rekordów" z dokumentu - SELECT
        SelectAll: function (Model) {
            Model.find({},function (err, data) {
                if (err) return console.error(err);
                console.log(data);
            })
        },
        // pobranie z ograniczeniem ilości i warunkiem - WHERE, LIMIT
        SelectAndLimit: function (Model, count, callback) {
            var obj = {};
            Model.find({}, function (err, data) {
                if (err) {
                    obj.data = err
                }
                else {
                    obj.data = data
                }
                // funkcja zwracająca dane na zewnątrz
                callback(data);
            }).limit(count)
        },
        SelectLimitWhere: function (Model, nick, count, callback) {
            var obj = {};
            Model.find({ nick: nick }, function (err, data) {
                if (err) {
                    obj.data = err
                }
                else {
                    obj.data = data
                }
                // funkcja zwracająca dane na zewnątrz
                callback(data);
            }).limit(count)
        },
        // usuniecie danych - DELETE
        DeleteAll: function (Model) {
			Model.remove(function (err, data) {
				if (err) return console.error(err);
				console.log(data);
			})
        },
    }
    return opers;
}
