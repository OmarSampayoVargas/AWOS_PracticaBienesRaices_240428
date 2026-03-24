import dotenv from "dotenv";
dotenv.config();

import "dotenv/config";
import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { connectDB } from "./config/db.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import csurf from "@dr.pogodin/csurf";

const app = express();
const PORT = process.env.PORT || 40428;

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "BienesRaices_240428_csrf_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(csurf());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/auth", usuarioRoutes);

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).render("templates/mesaje", {
      pagina: "Error de seguridad",
      title: "Error CSRF",
      msg: "El formulario expiró o fue manipulado. Recarga la página.",
    });
  }

  next(err);
});

await connectDB();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});