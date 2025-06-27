const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'flashlearn34@gmail.com',
        pass: 'bozy rqwk ycrs hdna'
    }
});

const enviarAlertaVazamento = (destinatario, local) => {
    const mailOptions = {
        from: '"HomeSync" <flashlearn34@gmail.com>',
        to: destinatario,
        subject: '⚠️ Vazamento de Gás Detectado!',
        text: `Atenção! Vazamento de gás detectado no local: ${local || 'Não informado'}.`,
        html: `
            <h2 style="color:red;">⚠️ Vazamento de Gás Detectado!</h2>
            <p><strong>Local:</strong> ${local || 'Não informado'}</p>
            <p>Verifique sua residência o quanto antes.</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
        } else {
            console.log('Alerta de vazamento enviado para', destinatario, '-', info.response);
        }
    });
};

async function enviarEmailRecuperacao(emailDestino, nomeUsuario, novaSenha) {
  const mailOptions = {
    from: '"HomeSync" <flashlearn34@gmail.com>',
    to: emailDestino,
    subject: 'Recuperação de senha - HomeSync',
    text: `Olá ${nomeUsuario},\n\nSua nova senha é: ${novaSenha}\n\nRecomendamos que você altere essa senha após o login.\n\nAtenciosamente,\nEquipe HomeSync`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail de recuperação enviado para:', emailDestino);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
}

module.exports = { 
    enviarAlertaVazamento,
    enviarEmailRecuperacao
 };
