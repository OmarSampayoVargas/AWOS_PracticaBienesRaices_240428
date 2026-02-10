import express from 'express';

//crea una instancia del contenedor web 
const app = express();

const PORT = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
    res.json({
        status:200,
        message: "Bienvenido a mi API de Bienes Raíces"
    })
})


app.post("/createUser", (req, res) => {

    console.log("Se esta procesando una peticion del tipo POST")
    const nuevoUsuario = {
        nombre:"Omar de jesus Sampayo Vargas",
        correo:"240429@utxicotepec.edu.mx"
        }
        res.json({
            status: 200,
            message: `Se ha solicitado la creacion de un nuevo usuario con nombre: ${nuevoUsuario.nombre} y correo: ${nuevoUsuario.correo}`
        })
    })


app.put("/actualizarOferta/", (req, res) => {
    console.log("Se esta procesando una peticion del tipo PUT");
    const mejorOfertaCompra = 
    {
        clienteID: 5158,
        propiedad:1305,
        montoOfertado: "$125,300.00"
    }
    const nuevaOferta = 
    {
        clienteID: 1578,
        propiedad: 1305,
        montoOfertado: "$130,000.00"
    }
    res.json({
        status: 200,
        message: `Se ha actualizado la mejor oferta, de un valor de: ${mejorOfertaCompra.montoOfertado} a: ${nuevaOferta.montoOfertado} por el cliente :${mejorOfertaCompra.clienteID}`
    })       
})

app.patch("/actualizarPassword/:nuevaPassword", (req, res) => {
    const usuario = {
        nombre: "Borrego Adrian",
        correo: "borrego.adrian@utxicotepec.edu.mx",
        password: "12345678"
    }
    res.json({
        status: 200,
        message: `la contraseña ${usuario.password} ha sido actualizada a: ${nuevaPassword}`
    })
})

app.delete("/borrarPropiedad/:id", (req, res) => {
    console.log("Se esta procesando una peticion del tipo DELETE");
    res.json({
        status: 200,
        message: `Se ha eliminado la propiedad con el id: ${id}`
    })

})

app.listen(PORT, () => {
    console.log(`Servidor esta iniciado en el puerto ${PORT}`)
})
