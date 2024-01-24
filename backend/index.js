import  Express  from 'express';
import { nanoid } from 'nanoid';
import {writeFile,readFile} from 'node:fs/promises';
import cors from "cors";


const app = Express();

//middleware 
app.use(Express.json());

//evita los cors para leer entorno front y back
app.use(cors());


// creamos el servidor en el puerto 5000
app.listen(5000, console.log("¡Servidor encendido!"))

//agregamos el middleware al servidor 
app.use(Express.json());

// funcion para obtener repertorio.json
const getRepertorio = async () => {
    const fsResponse = await readFile ("repertorio.json","utf-8");
    const repertorio = JSON.parse(fsResponse);
    return repertorio;
}


// primera peticion con GET en el puerto
app.get("/canciones", async (req, res) => {
    const repertorio = await getRepertorio();
    res.json(repertorio);
})

// segunda peticion con GET en el puerto filtrando por ID
app.get ("/canciones/:id", async (req, res) => {
    const id = req.params.id;
    const repertorio = await getRepertorio();
    const repertorios = repertorio.find(repertorio => repertorio.id === id);

    if (!repertorios) {
        res.status(404).json({message: "repertorios not found"})
    }
    res.json(repertorios)
})


// este metodo permite recibir datos del formulario del front y agregarlo a repertorio.json
app.post ("/canciones", async (req, res) => {
    const {id,titulo,artista,tono} = req.body;
    const newRepertorio = {
        id: nanoid(),
        titulo: titulo,
        artista: artista,
        tono: tono
    }
    let repertorio = await getRepertorio();
    repertorio.push(newRepertorio);
    await writeFile("repertorio.json", JSON.stringify(repertorio));
    res.status(201).json(newRepertorio)
})

// ver que hace esta funcion 
app.put("/canciones/:id", async (req, res) => {
    const id = req.params.id;

    let repertorio = await getRepertorio();
    const repertorios = repertorio.find(repertorio => repertorio.id === id);

    if (!repertorios) {
        res.status(404).json({message: "repertorios not found"})
    }
    repertorio = repertorio.map((repertorio) => {
        if (repertorio.id === id) {
            return {
                ...repertorio,done: !repertorio.done
            }
        }
        return repertorios;
    });

    await writeFile("repertorio.json", JSON.stringify(repertorio));

    res.json(repertorio)
})

//peticion para eliminar datos 
app.delete ("/canciones/:id", async (req, res) => {
    const id = req.params.id;

    let repertorio = await getRepertorio();
    const repertorios = repertorio.find(repertorio => repertorio.id === id);

    if (!repertorios) {
        res.status(404).json({message: "repertorios not found"})
    }

    repertorio = repertorio.filter((repertorio) => repertorio.id !== id);
    await writeFile("repertorio.json", JSON.stringify(repertorio));
})
