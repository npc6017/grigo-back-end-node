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
        tableName: 'tag',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        createdAt: 'time_stamp',
    });
    Tag.associate = (db) => {
        db.Tag.hasMany(db.PostTag, {
            foreignKey: 'tag_id',
        });
        db.Tag.hasMany(db.AccountTag, {
            foreignKey: 'tag_id'
        });
    }
    return Tag;
}