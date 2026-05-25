import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add body parser for JSON
  app.use(express.json());

  // Email route for Bug Reporting
  app.post("/api/report-bug", async (req, res) => {
    const { type, message, email } = req.body;
    
    // Validate request
    if (!type || !message) {
      return res.status(400).json({ success: false, error: "Type and message are required" });
    }

    try {
      // Configuration via environment variables. The user will need to supply GMAIL_APP_PASSWORD.
      // Defaulting to the requested email as sender and recipient.
      const TARGET_EMAIL = "animegaminglunatio@gmail.com";
      const AUTH_EMAIL = "damianomaurizio.manera@gmail.com";
      const EMAIL_PASS = process.env.GMAIL_APP_PASSWORD;

      if (!EMAIL_PASS) {
        // Return a mock success if running in dev preview without credentials
        // so the UI can proceed, but log it on the server
        console.warn("GMAIL_APP_PASSWORD is not set. Simulating bug report success.");
        return res.json({ 
          success: true, 
          mock: true, 
          notice: "L'email non è stata realmente inviata perché manca GMAIL_APP_PASSWORD nell'ambiente, ma il sistema funziona." 
        });
      }

      // Create a transporter using Gmail
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
        replyTo: email || undefined, // Allow replying to the user who reported if they provided an email
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
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending bug report:", error);
      
      let errorMessage = "Impossibile inviare l'email.";
      
      // Specifically handle Gmail authorization errors (535-5.7.8 Username and Password not accepted)
      if (error && error.message && error.message.includes("535-5.7.8")) {
          errorMessage = "Errore di configurazione del server email. Contatta l'amministratore del sistema.";
      }

      res.status(500).json({ success: false, error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
