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
        db.Post.hasMany(db.Comment, {
            foreignKey: 'post_id' /// 양 도메인 모두에 정의해야 적용된다.
        });
        db.Post.hasMany(db.Notification);
    }
    return Post;
}