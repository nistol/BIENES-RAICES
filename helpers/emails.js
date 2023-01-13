import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    const {email,nombre,token} = datos

    // enviar mail

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject:'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
        <p>${nombre} , comprueba tu cuenta en BienesRaices.com</p>
        
        <p>Tu cuenta ya esta lista, por favor haz click en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>
        
        <p>Si tu no creaste esta cuenta ignora el mensaje</p>`

        
    })
}
const emailRecuperar = async (datos) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  const {email,nombre,token} = datos

  // enviar mail

  await transport.sendMail({
      from: 'BienesRaices.com',
      to: email,
      subject:'Restablece tu Password en BienesRaices.com',
      text: 'Restablece tu Password en BienesRaices.com',
      html: `
      <p>${nombre} , Haz solicitado reestablecer tu password  en BienesRaices.com</p>
      
      <p>Sigue el siguiente enlace para generar un password nuevo:
      <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recuperar/${token}">Reestablecer Password</a></p>
      
      <p>Si tu no no solicitaste el cambio ignora el mensaje</p>`

      
  })
}
export {emailRegistro,emailRecuperar}