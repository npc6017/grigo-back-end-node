module.exports = (sequelize, DataTypes) => {
    const PostTag = sequelize.define('PostTag', {
        PostId: {
            type: DataTypes.INTEGER,
        },
        TagId: {
            type: DataTypes.INTEGER,
        },
    }, {
        tableName: 'post_tag',
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    PostTag.associate = (db) => {
        db.PostTag.belongsTo(db.Post);
        db.PostTag.belongsTo(db.Tag);
    }
    return PostTag;
};