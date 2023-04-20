import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try{
            const decoded = jwt.verify(token,'secret88888');
            req.userId=decoded._id;
            next()
        }
        catch(err){
                    res.status(403).json({
            message: 'Доступ відсутній'
        })
        }
    } else {
        res.status(403).json({
            message: 'Доступ відсутній'
        })
    }
}