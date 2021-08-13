module.exports = (sequelize, DataTypes) => {
    const PostTag = sequelize.define('PostTag', {
        post_id: {
            type: DataTypes.INTEGER,
        },
        tag_id: {
            type: DataTypes.INTEGER,
        },
    }, {
        timestamps: false,
        tableName: 'post_tag',
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    PostTag.associate = (db) => {
        db.PostTag.belongsTo(db.Post, {
            foreignKey: 'post_id',
        });
        db.PostTag.belongsTo(db.Tag, {
            foreignKey: 'tag_id',
        });
    }
    return PostTag;
};