var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/report-bug", async (req, res) => {
    const { type, message, email } = req.body;
    if (!type || !message) {
      return res.status(400).json({ success: false, error: "Type and message are required" });
    }
    try {
      const TARGET_EMAIL = "animegaminglunatio@gmail.com";
      const AUTH_EMAIL = "damianomaurizio.manera@gmail.com";
      const EMAIL_PASS = process.env.GMAIL_APP_PASSWORD;
      if (!EMAIL_PASS) {
        console.warn("GMAIL_APP_PASSWORD is not set. Simulating bug report success.");
        return res.json({
          success: true,
          mock: true,
          notice: "L'email non \xE8 stata realmente inviata perch\xE9 manca GMAIL_APP_PASSWORD nell'ambiente, ma il sistema funziona."
        });
      }
      const transporter = import_nodemailer.default.createTransport({
        service: "gmail",
        auth: {
          user: AUTH_EMAIL,
          pass: EMAIL_PASS
        }
      });
      const mailOptions = {
        from: AUTH_EMAIL,
        to: TARGET_EMAIL,
        replyTo: email || void 0,
        // Allow replying to the user who reported if they provided an email
        subject: `[MLBB Builder Bug Report] - ${type}`,
        text: `Nuova segnalazione bug ricevuta!

Categoria: ${type}
Email utente: ${email || "Non fornita"}

Descrizione:
${message}`,
        html: `
          <h2>Nuova segnalazione bug (MLBB Builder)</h2>
          <p><strong>Categoria:</strong> ${type}</p>
          <p><strong>Email Utente:</strong> ${email || "Non fornita"}</p>
          <hr />
          <h3>Descrizione:</h3>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `
      };
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending bug report:", error);
      let errorMessage = "Impossibile inviare l'email.";
      if (error && error.message && error.message.includes("535-5.7.8")) {
        errorMessage = "Errore di configurazione del server email. Contatta l'amministratore del sistema.";
      }
      res.status(500).json({ success: false, error: errorMessage });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
