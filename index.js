import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import * as dotenv from 'dotenv'
import { registerValidation } from "./validations/auth.js"
import { validationResult } from "express-validator"
import UserModel from "./models/user.js"
import checkAuth from "./utils/checkAuth.js"
dotenv.config()


const database = process.env.DATABASE;
const secret = process.env.SECRET
mongoose.connect(database)
    .then(() => console.log(`database start Ok`))
    .catch((err) => console.log(`database err is`, err))
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world');
});
//about me
app.get('/auth/me', checkAuth, (req, res) => {
    try {} catch (err) {

    }
    res.send('hello world');
});
//authoriztion 
app.post('/auth/login', async(req, res) => {
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
                return res.status(404).json({
                    message: 'Невірний логін або пароль'
                })
            }
            const token = jwt.sign({
                    _id: user._id
                },
                'secret88888', {
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
    })
    // registration
app.post('/auth/register', registerValidation, async(req, res) => {
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
})
app.listen(4444, (err) => {
    if (err) {
        return console.log(`start server with errr ${err}`)
    }
    console.log(`Server start on 4444 port`);
})