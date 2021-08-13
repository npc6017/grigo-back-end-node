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
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        student_id: { // studentId -> student_id
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
        check_notice:{ // checkNotice -> check_notice
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        timestamps: false,
        tableName: 'account',
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });
    Account.associate = (db) => {
        db.Account.hasMany(db.Post, {
            foreignKey: 'account_id' ///
        });
        db.Account.hasMany(db.Comment, {
            foreignKey: 'account_id' /// 양 도메인 모두에 정의해야 적용된다.
        });
        db.Account.hasMany(db.Notification, {
            foreignKey: 'account_id'
        });
        db.Account.hasMany(db.AccountTag, {
            foreignKey: 'account_id',
        });
    }
    return Account;
};