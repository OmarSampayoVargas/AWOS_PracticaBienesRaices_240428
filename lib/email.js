import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const link = `http://localhost:40428/auth/confirma/${token}`;

  await transport.sendMail({
    from: '"BienesRaices_240428" <no-reply@bienesraices.com>',
    to: email,
    subject: "Bienvenid@ a la Plataforma de Bienes Raíces - Confirma tu cuenta",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.5;">
        <h2 style="color:#f59e0b;">BienesRaices_240428</h2>

        <p>Hola <b>${nombre}</b>, comprueba tu cuenta en <b>BienesRaices_240428</b>.</p>
        <hr>

        <p>Tu cuenta ya está casi lista, solo debes confirmarla en el siguiente enlace:</p>

        <p style="margin:18px 0;">
          <a href="${link}" 
             style="background:#154965;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;display:inline-block;">
             Confirmar Cuenta
          </a>
        </p>

        <p style="color:#64748b;font-size:13px;">
          Si tú no creaste esta cuenta, puedes ignorar este mensaje.
        </p>
      </div>
    `,
  });
};

const emailResetearPassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const link = `http://localhost:40428/auth/actualizarPassword/${token}`;

  await transport.sendMail({
    from: '"BienesRaices_240428" <no-reply@bienesraices.com>',
    to: email,
    subject: "Solicitud de restauración de contraseña - BienesRaices",
    html: `
      <div style="font-family: Arial, sans-serif; line-height:1.5;">
        <h2 style="color:#f59e0b;">BienesRaices_240428</h2>

        <p>Hola <b>${nombre}</b>, hemos recibido una solicitud para restaurar tu contraseña.</p>
        <hr>

        <p>Puedes restablecer tu contraseña en el siguiente enlace:</p>

        <p style="margin:18px 0;">
          <a href="${link}" 
             style="background:#154965;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;display:inline-block;">
             Restablecer contraseña
          </a>
        </p>

        <p style="color:#64748b;font-size:13px;">
          Si tú no solicitaste este cambio, puedes ignorar este correo.
        </p>
      </div>
    `,
  });
};

export { emailRegistro, emailResetearPassword };