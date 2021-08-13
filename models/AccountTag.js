module.exports = (sequelize, DataTypes) => {
    const AccountTag = sequelize.define('AccountTag', {
        account_id: { ///AccountId -> account_id
            type: DataTypes.INTEGER,
        },
        tag_id: { /// TagId -> tag_id
            type: DataTypes.INTEGER,
        },
    }, {
        tableName: 'account_tag',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        createdAt: 'time_stamp',
    });
    AccountTag.associate = (db) => {
        db.AccountTag.belongsTo(db.Account);
        db.AccountTag.belongsTo(db.Tag);
    }
    return AccountTag;
};