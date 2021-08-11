module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        category: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    Tag.associate = (db) => {
        db.Tag.hasMany(db.PostTag);
        db.Tag.hasMany(db.AccountTag);
    }
    return Tag;
}