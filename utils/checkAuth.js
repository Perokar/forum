import jsw from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    console.log(token)
    if (token) {

    } else {
        res.status(403).json({
            message: 'Доступ відсутній'
        })
    }
    next()
}