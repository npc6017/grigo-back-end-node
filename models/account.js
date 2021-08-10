module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        birth: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        sex: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Account.associate = (db) => {
        db.Account.hasMany(db.Post);
        db.Account.belongsToMany(db.Tag, { through: "AccountTag"});
        db.Account.hasMany(db.Comment);
        db.Account.belongsToMany(db.Post, {through: "Notification"})
    }
    return Account;
};