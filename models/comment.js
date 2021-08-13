module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        tableName: 'comment',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        createdAt: 'time_stamp',
        updatedAt: false,
    });
    Comment.associate = (db) => {
        db.Comment.belongsTo(db.Account, {
            foreignKey: 'account_id' /// 양 도메인 모두에 정의해야 적용된다.
        });
        db.Comment.belongsTo(db.Post, {
            foreignKey: 'post_id' /// 양 도메인 모두에 정의해야 적용된다.
        });
    }
    return Comment;
}