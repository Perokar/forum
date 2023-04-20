import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { validationResult } from "express-validator"
import UserModel from "../models/user.js"
// registration
export const register = async(req, res) => {
    try {
        const Errors = validationResult(req);
        if (!Errors.isEmpty()) {
            res.status(400).json(Errors.array())
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10);
        const Hash = await bcrypt.hash(password, salt)
        const userDoc = new UserModel({
            email: req.body.email,
            nick: req.body.nick,
            fullName: req.body.fullName,
            passwordHash: Hash,
            avatarUrl: req.body.avatarUrl
        })
        const user = await userDoc.save()
        const token = jwt.sign({
                _id: user._id
            },
            'secret88888', {
                expiresIn: '10d'
            })
        const {
            passwordHash,
            ...userData
        } = user._doc;
        res.json({
            userData,
            token
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Реєстрація не вдала"
        })
    }
};
//login
export const login = async(req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email
        })

        if (!user) {
            return res.status(404).json({
                message: 'Користувача не знайдено'
            })
        }
        const isValidPass = bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Невірний логін або пароль'
            })
        }
        const token = jwt.sign({
                _id: user._id
            }, 'secret88888',
             {
                expiresIn: '10d'
            })
        const { passwordHash, ...userData } = user._doc;

        res.json({
            userData,
            token
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не вдалося авторизуватись"
        })
    }
}
//authentificator
export const checkMe = async  (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if(!user){
            res.status(404).json({
                message:"Користувача не знайдено"
            })  
        }
        else{
            console.log(user._doc)
            const { passwordHash, ...userData } = user._doc;
            res.json({userData});
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message:`Доступ заборонено`
        })

    }
}