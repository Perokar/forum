import express from "express";
import mongoose from "mongoose"
import * as dotenv from 'dotenv'
import { registerValidation, loginValidation, postCreateValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
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
app.get('/auth/me', checkAuth, UserController.checkMe);
//authoriztion 
app.post('/auth/login',loginValidation, UserController.login )
// registration
app.post('/auth/register', registerValidation, UserController.register)
//work with posts
//app.get('/posts',PostController.getAll )
//app.get('/post/:id', PostController.getOne )
app.post('/post',checkAuth, postCreateValidation, PostController.create )
//app.delete('/post',checkAuth, PostController.remove )
//app.patch('/post',checkAuth, PostController.update )

app.listen(4444, (err) => {
    if (err) {
        return console.log(`start server with errr ${err}`)
    }
    console.log(`Server start on 4444 port`);
})