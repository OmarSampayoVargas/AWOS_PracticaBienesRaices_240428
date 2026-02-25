import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import {connectDB} from './config/db.js';

// Crea una instancia del contenedor web 
const app = express();
const PORT = process.env.PORT ?? 40428;

//Habilitar el templete engine (PUG)
app.set("view engine", "pug");
app.set("views", "./views")

app.use(express.static("./public"))

app.use("/auth", usuarioRoutes)

await connectDB ();

app.listen(PORT, ()=> {
    console.log(`El servidor esta iniciado en el puerto ${PORT}`)
}) 