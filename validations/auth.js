import { body } from "express-validator"

export const registerValidation = [
    body('fullName', 'Wrong Name').isLength({ min: 3 }),
    body('nick', 'so small nick').isLength({ min: 3 }),
    body('email', 'wrong email ').isEmail(),
    body('password', 'password will have 8 or more symvols').isLength({ min: 8 }),
    body('avatarUrl', 'its not like a URL').optional().isURL(),
]