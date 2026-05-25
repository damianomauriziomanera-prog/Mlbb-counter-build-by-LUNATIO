import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, message, email } = req.body;
  
  if (!type || !message) {
    return res.status(400).json({ success: false, error: "Type and message are required" });
  }

  // Credenziali prelevate automaticamente da Vercel Environment Variables
  const TARGET_EMAIL = "animegaminglunatio@gmail.com";
  const AUTH_EMAIL = "damianomaurizio.manera@gmail.com";
  const EMAIL_PASS = process.env.GMAIL_APP_PASSWORD;

  if (!EMAIL_PASS) {
    console.warn("GMAIL_APP_PASSWORD mancante su Vercel!");
    return res.json({ 
      success: true, 
      mock: true, 
      notice: "Variabile GMAIL_APP_PASSWORD non configurata su Vercel." 
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: AUTH_EMAIL,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: AUTH_EMAIL, 
      to: TARGET_EMAIL, 
      replyTo: email || undefined,
      subject: `[MLBB Builder Bug Report] - ${type}`,
      text: `Nuova segnalazione bug ricevuta!\n\nCategoria: ${type}\nEmail utente: ${email || "Non fornita"}\n\nDescrizione:\n${message}`,
      html: `
        <h2>Nuova segnalazione bug (MLBB Builder)</h2>
        <p><strong>Categoria:</strong> ${type}</p>
        <p><strong>Email Utente:</strong> ${email || "Non fornita"}</p>
        <hr />
        <h3>Descrizione:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true });
  } catch (error: any) {
    console.error("Errore nell'invio della segnalazione bug:", error);
    
    let errorMessage = "Impossibile inviare l'email dal server.";
    if (error && error.message && error.message.includes("535-5.7.8")) {
        errorMessage = "Credenziali GMAIL_APP_PASSWORD rifiutate da Google.";
    }

    return res.status(500).json({ success: false, error: errorMessage });
  }
}
