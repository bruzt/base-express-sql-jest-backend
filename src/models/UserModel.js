const { Model, DataTypes } = require('sequelize');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserModel extends Model {

    static init(connection) {

        super.init({

            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            access_level: DataTypes.INTEGER,
            reset_password_token: DataTypes.STRING,
            reset_password_expires: DataTypes.DATE,

        }, {
            tableName: 'users',
            sequelize: connection,
            hooks: {
                beforeSave: async (user) => {
                    
                    if(user._changed.password){

                        user.password = await bcrypt.hash(user.password, 8);
                    }
                }
            }
        });
    }

    static associate(models) {

        this.hasMany(models.AddressModel, {
            foreignKey: 'user_id',
            as: 'addresses'
        });

        this.belongsToMany(models.TechModel, {
            foreignKey: 'user_id',
            through: 'users_techs',
            as: 'techs'
        });
    }

    checkPassword(password) {

        return bcrypt.compare(password, this.password);
    }

    generateToken() {

        return jwt.sign({ 
            id: this.id, 
            accessLevel: this.access_level 
        }, process.env.APP_SECRET, { expiresIn: "12h" });
    }
}

module.exports = UserModel;