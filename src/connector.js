const mongoose = require('mongoose')

exports.db = mongoose.createConnection('mongodb+srv://root:root@cluster0.beiud.mongodb.net/hms?retryWrites=true&w=majority',
  ({ useNewUrlParser: true, useUnifiedTopology: true }))