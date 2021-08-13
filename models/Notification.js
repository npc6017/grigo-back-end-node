module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'notification',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        createdAt: 'time_stamp',
    });
    Notification.associate = (db) => {
        db.Notification.belongsTo(db.Account, {
            foreignKey: 'account_id'
        });
        db.Notification.belongsTo(db.Post, {
            foreignKey: 'post_id'
        });
    }
    return Notification;
};