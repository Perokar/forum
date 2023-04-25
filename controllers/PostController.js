import PostModel from "../models/post.js";

export const getAll = async(req,res)=>{
    try {
        const posts = await PostModel.find({}).populate('user').exec();
        res.json(posts);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`Не вдалось отримати усі статті`});
    }
}
export const getOne =async(req,res)=>{
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {
            _id:postId,
            },
            {
                $inc:{viewCount:1},
            },
            {
                returnDocument:'after',
            })
            .then((doc)=>{
                if(!doc){
                    return res.status(404).json({message:`Стаття в базі данних відсутня`});
                }
                res.json(doc)
            },(err)=>{
                if(err){
                    console.log(`err in function getOne ${err}`);
                    return res.status(500).json({message:`Помилка в базі даних`});
                }
            })
                    
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`Сервер не знайшов статтю`});
    }
}

export const remove =(req,res)=>{
    try {
        const postId = req.params.id;
        PostModel.findByIdAndDelete(postId)
        .then(
            (doc)=>{
                if(!doc) return res.status(404).json({message:'Такого документа не існує'})
            res.status(200).json({
                message:`Документ було видалено`})
            },
            (err)=>{
            console.log(err);
            res.status(500).json({message:'Упс щось пішло не по плану'})
        });
    }               
    catch (error) {
        console.log(error);
        res.status(500).json({message:`Неможливо видалите те, чого не має`});
    }
};

export const create = async(req,res)=>{
    try {
        const doc = new PostModel({
            title:req.body.title,
            text:req.body.text,
            tags:req.body.tags,
            imageUrl:req.body.imgURL,
            user:req.userId,
        })
        const post = await doc.save();
        res.status(200).json({post})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:`Не вдалось створити статью`
        })
    }
}

export const update =async(req,res)=>{
    try {
        const postId = req.params.id;
        const updateDoc =await PostModel.findOneAndUpdate(
            {
            _id:postId,
            },
            {
                title:req.body.title,
                text:req.body.text,
                tags:req.body.tags,
                imageUrl:req.body.imgURL,
                user:req.userId,
            },
            {
                returnDocument:'after'
            });
            res.json(updateDoc);                    
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`Не вдалось оновити статтю`});
    }
}