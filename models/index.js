const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Account = require('./account')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Notification = require('./Notification')(sequelize, Sequelize);
db.Tag = require('./tag')(sequelize, Sequelize);
db.AccountTag = require('./AccountTag')(sequelize, Sequelize);
db.PostTag = require('./PostTag')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

// 각 모델에서 설정한 associate 연결
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
