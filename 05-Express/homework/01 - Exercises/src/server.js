// const bodyParser = require("body-parser");
const express = require("express");

// const postsRouter = require("./postsRouter")

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let publications = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

// server.use("/posts", postsRouter);

let id = 0;
server.post("/posts", (req,res)=>{
    const {author, title, contents} = req.body;

    if(author && title && contents){

        let publicacion = {
            author: author,
            title: title,
            contents: contents,
            id: ++id,
        }

        publications.push(publicacion);

        res.json(publicacion);
    } else {
        res.status(404).json({error: "No se recibieron los parámetros necesarios para crear la publicación"});
    }
});


server.get("/posts", (req, res) => {
    const { term, author, title } = req.query;

    if (term) {
        let result = publications.filter((post)=>{
            return post.title.includes(term) || post.contents.includes(term);
        });
        result.length > 0 ? res.status(200).json(result) : res.status(200).json(publications);
    }
    // arrTerms.length > 0 ? res.status(200).json(arrTerms) : res.status(200).json(publications)
    else if (author && title) {
        let arrTerms = publications.filter((publicacion) => {
            return publicacion.author.includes(author) && publicacion.title.includes(title);
        })

        arrTerms.length > 0 ? res.status(200).json(arrTerms) : res.status(400).json({error: "No existe ninguna publicación con dicho título y autor indicado"});
    }
    res.status(200).json(publications);

});

server.get("/posts/:author", (req,res) => {
    const {author} = req.params;

    if (author){
        let publicaciones = publications.filter((autori) => {
            // return autori.author === author;
            return autori.author.includes(author);
        })
        publicaciones.length > 0 ? res.status(200).json(publicaciones) : res.status(404).json({error: "No existe ningun post del autor indicado"});
    }

})

server.put("/posts/:id", (req,res)=>{
    const {id} = req.params;
    const {title, contents} = req.body;

    const id_check = publications.find((post)=>{
        return post.id === parseInt(id);
    })


    if (!title || !contents) {
        res.status(404).json({error: "No se recibieron los parámetros necesarios para modificar la publicación"});
    } else if (id_check) {
        id_check.title = title;
        id_check.contents = contents;

        res.status(200).json(id_check);
    } else {
        res.status(404).json({error: "No se recibió el id correcto necesario para modificar la publicación"});
    }

})

server.delete("/posts/:id", (req,res) => {
    const {id} = req.params;

    const id_check = publications.find((post)=>{
        return post.id === parseInt(id);
    })

    if (!id) {
        res.status(404).json({error: "No se recibió el id de la publicación a eliminar"});
    } else if (id_check) {
        const indice = publications.findIndex((post) => {
            return post.id === id_check.id;
        })
        publications.splice(indice, 1);
        res.status(200).json({success: true});
    }
    res.status(404).json({error: "No se recibió el id correcto necesario para eliminar la publicación"});
})

server.delete("/author/:name", (req, res) => {
    const {name} = req.params;

    const esta_moseli = publications.filter((post) => {
        return post.author === name;
    });


    if (!name){
         res.status(STATUS_ERROR).json({error: "No se recibió el nombre del autor"});
    } else if (esta_moseli) {
        // let i = 0;
        // let esta_moseli = [];
        // while (i < publications.length){
        //     if (publications[i].author === name){
        //         // console.log("----->",publications[i])
        //         esta_moseli.push(publications[i]);
        //         publications.splice(i, 1);
        //     } else {
        //         i++;
        //     }
        // }
        // console.log("----->",name_chck)
        publications = publications.filter((post) => post.author !== name);
        res.status(200).json(esta_moseli);
    }

    res.status(404).json({error: "No se recibió el nombre correcto necesario para eliminar las publicaciones del autor"});


})


//NO MODIFICAR EL CODIGO DE ABAJO. SE USA PARA EXPORTAR EL SERVIDOR Y CORRER LOS TESTS
module.exports = { publications, server };

