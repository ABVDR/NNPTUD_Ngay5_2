const { body } = require('express-validator');

module.exports = {
    ChangePasswordValidator: [
        body('oldpassword').notEmpty().withMessage('oldpassword không được để trống'),
        body('newpassword')
            .notEmpty().withMessage('newpassword không được để trống')
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minNumbers: 1,
                minSymbols: 1,
                minUppercase: 1
            }).withMessage('newpassword phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt'),
    ]
};
