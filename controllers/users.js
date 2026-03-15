let userModel = require("../schemas/users");
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let fs = require('fs')

module.exports = {
    CreateAnUser: async function (username, password, email, role, fullName, avatarUrl, status, loginCount) {
        // Kiểm tra trùng username/email, tránh lỗi 11000 (duplicate key)
        let exist = await userModel.findOne({ $or: [{ username }, { email }] });
        if (exist) {
            let field = exist.email === email ? 'email' : 'username';
            let err = new Error(`Đã tồn tại ${field}`);
            err.status = 409;
            throw err;
        }

        let newItem = new userModel({
            username: username,
            password: password,
            email: email,
            fullName: fullName,
            avatarUrl: avatarUrl,
            status: status,
            role: role,
            loginCount: loginCount
        });
        await newItem.save();
        return newItem;
    },
    GetAllUser: async function () {
        return await userModel
            .find({ isDeleted: false })
    },
    GetUserById: async function (id) {
        try {
            return await userModel.findOne({
                isDeleted: false,
                _id: id
            })
        } catch (error) {
            return false;
        }
    },
    QueryLogin: async function (username, password) {
        if (!username || !password) {
            return false;
        }
        let user = await userModel.findOne({
            username: username,
            isDeleted: false
        })
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const privateKey = fs.readFileSync('private.key');
                return jwt.sign({
                    id: user.id
                }, privateKey, {
                    algorithm: 'RS256',
                    expiresIn: '1d'
                })
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    ChangePassword: async function (userId, oldpassword, newpassword) {
        const user = await userModel.findOne({ _id: userId, isDeleted: false });
        if (!user) throw new Error('User not found');
        if (!bcrypt.compareSync(oldpassword, user.password)) {
            throw new Error('Mật khẩu cũ không đúng');
        }
        user.password = newpassword;
        await user.save();
        return { message: 'Đổi mật khẩu thành công' };
    }
}