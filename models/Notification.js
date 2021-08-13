module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        AccountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'notification',
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Notification.associate = (db) => {
        db.Notification.belongsTo(db.Account);
        db.Notification.belongsTo(db.Post);
    }
    return Notification;
};