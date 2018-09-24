// Export object containing basic MongoDB operations using the Mongoose library
module.exports = function () {
  var opers = {
    // inserting one record into the document - INSERT
    InsertOne: function (data) {
      data.save(function (error, data, callback) {
        // console.log("Added: " + data)
      })
    },
    // download all "records" from the document - SELECT
    SelectAll: function (Model, callback) {
      var obj = {};
      Model.find({},function (err, data) {
        if (err) {
          obj.data = err;
        }
        else {
          obj.data = data;
        }
        // function returning data outside
        callback(data);
      })
    },
    // download with limited quantity and condition - WHERE, LIMIT
    SelectAndLimit: function (Model, count, callback) {
      var obj = {};
      Model.find({}, function (err, data) {
        if (err) {
          obj.data = err;
        }
        else {
          obj.data = data;
        }
        // function returning data outside
        callback(data);
      }).limit(count)
    },
    SelectLimitWhere: function (Model, nick, count, callback) {
      var obj = {};
      Model.find({ nick: nick }, function (err, data) {
        if (err) {
          obj.data = err;
        }
        else {
          obj.data = data;
        }
        // function returning data outside
        callback(data);
      }).limit(count)
    },
    SelectWhere: function (Model, nick, callback) {
      var obj = {};
      Model.find({ nick: nick }, function (err, data) {
        if (err) {
          obj.data = err;
        }
        else {
          obj.data = data;
        }
        // function returning data outside
        callback(data);
      })
    },
    // remove data - DELETE
    DeleteAll: function (Model) {
      Model.remove(function (err, data) {
        if (err) return console.error(err);
          // console.log(data);
      })
    },
    // remove data where - DELETE
    DeleteWhere: function (Model, nick) {
      Model.remove({ nick: nick }, function (err) {
        if (err) return console.error(err);
        // deleted at most one tank document
      });
    }
  }
  
  return opers;
}