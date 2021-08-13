module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        boardType: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
    }, {
        tableName: 'post',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.Account);
        db.Post.hasMany(db.PostTag);
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Notification);
    }
    return Post;
}