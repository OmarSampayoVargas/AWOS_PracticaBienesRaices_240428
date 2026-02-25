import express from "express";
import {
  formularioLogin,
  formularioRegistro,
  formularioRecuperacion
} from "../controllers/usuarioController.js";

const router = express.Router();

// GET (PUG)
router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.get("/recuperarPassword", formularioRecuperacion);

// POST
router.post("/createUser", (req, res) => {
  console.log("Se está procesando la petición del tipo POST");

  const body = req.body || {};

  const nuevoUsuario = {
    nombre: body.nombre || "Omar de jesus sampayo Vargas",
    correo: body.correo || "omasampayovar@gmail.com",
  };

  res.json({
    status: 200,
    message: `Se ha solicitado la creación del usuario con el nombre ${nuevoUsuario.nombre} y el correo ${nuevoUsuario.correo}`,
  });
});

// ✅ POST para recuperar password (para que el form action funcione)
router.post("/recuperar", (req, res) => {
  console.log("Se está procesando recuperación de contraseña");

  const { emailUsuario } = req.body || {};

  res.json({
    status: 200,
    message: `Solicitud de recuperación enviada para: ${emailUsuario}`,
  });
});

// PUT
router.put("/actualizarOferta", (req, res) => {
  console.log("Se está procesando la petición del tipo PUT");

  const ofertaCompra = {
    clienteID: 2401,
    propiedad: 1305,
    montoOfertado: "$125,300.00",
  };

  const nuevaOferta = {
    clienteID: 1586,
    propiedad: 1305,
    montoOfertado: "$130,000.00",
  };

  res.json({
    status: 200,
    message: `Se ha actualizado la mejor oferta de ${ofertaCompra.montoOfertado} a ${nuevaOferta.montoOfertado} por el cliente con ID ${nuevaOferta.clienteID}`,
  });
});

// PATCH
router.patch("/actualizarPassword/:nuevaPassword", (req, res) => {
  console.log("Se está procesando la petición del tipo PATCH");

  const { nuevaPassword } = req.params;

  res.json({
    status: 200,
    message: `Se ha actualizado la contraseña a ${nuevaPassword}`,
  });
});

// DELETE
router.delete("/borrarPropiedad/:id", (req, res) => {
  console.log("Se está procesando la petición del tipo DELETE");

  const { id } = req.params;

  res.json({
    status: 200,
    message: `Se ha eliminado la propiedad con el ID ${id}`,
  });
});

export default router;