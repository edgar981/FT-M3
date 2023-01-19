const express = require("express");

const postsRouter = express.Router();
let id = 0;

postsRouter.post("/", (req,res)=>{
    const {author, title, contents} = req.body;

    if(author && title && contents){
        let publicacion = {
            author: author,
            title: title,
            contents: contents,
            id: id++,
        }

        publications.push(publicacion);

        return res.json(publicacion);
    } else {
        return res.json({error: "No se recibieron los parámetros necesarios para crear la publicación"});
    }
});

module.exports = postsRouter;