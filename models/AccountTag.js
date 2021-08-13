module.exports = (sequelize, DataTypes) => {
    const AccountTag = sequelize.define('AccountTag', {
        AccountId: {
            type: DataTypes.INTEGER,
        },
        TagId: {
            type: DataTypes.INTEGER,
        },
    }, {
        tableName: 'account_tag',
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    AccountTag.associate = (db) => {
        db.AccountTag.belongsTo(db.Account);
        db.AccountTag.belongsTo(db.Tag);
    }
    return AccountTag;
};