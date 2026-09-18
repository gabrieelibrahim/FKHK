const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.MAIL_FROM || "FKHK <noreply@fkhk.com>";

exports.sendNewArticleNotification = async (subscribers, article) => {
  if (!subscribers.length) return;

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const articleUrl = `${frontendUrl}/articles/${article.slug}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;margin-top:24px">
    <tr><td style="background:#2C5857;padding:32px 24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:22px">Artikel Baru</h1>
    </td></tr>
    <tr><td style="padding:32px 24px">
      <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:20px">${article.title}</h2>
      <p style="color:#666;line-height:1.6;margin:0 0 20px">${article.excerpt || article.content.substring(0, 200) + "..."}</p>
      <a href="${articleUrl}" style="display:inline-block;padding:12px 24px;background:#2C5857;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Baca Selengkapnya</a>
    </td></tr>
    <tr><td style="padding:16px 24px 24px;text-align:center;color:#999;font-size:12px">
      <p style="margin:0">© ${new Date().getFullYear()} FKHK — Forum Kajian Hukum Keluarga</p>
      <p style="margin:4px 0 0">Jika tidak ingin menerima email ini lagi, <a href="${frontendUrl}/unsubscribe" style="color:#999">berhenti berlangganan</a></p>
    </td></tr>
  </table>
</body>
</html>`;

  const batchSize = 50;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map((s) =>
        transporter.sendMail({
          from: FROM,
          to: s.email,
          subject: `📝 ${article.title}`,
          html,
        }).catch((err) => console.error("Mail error to", s.email, err.message))
      )
    );
  }
};

exports.sendNewEventNotification = async (subscribers, event) => {
  if (!subscribers.length) return;

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const eventUrl = `${frontendUrl}/events/${event.slug}`;
  const dateStr = new Date(event.dateTime).toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;margin-top:24px">
    <tr><td style="background:#2C5857;padding:32px 24px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:22px">Kegiatan Baru</h1>
    </td></tr>
    <tr><td style="padding:32px 24px">
      <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:20px">${event.title}</h2>
      <p style="color:#666;line-height:1.6;margin:0 0 8px"><strong>Tanggal:</strong> ${dateStr}</p>
      ${event.location ? `<p style="color:#666;margin:0 0 8px"><strong>Lokasi:</strong> ${event.location}</p>` : ""}
      ${event.onlineUrl ? `<p style="color:#666;margin:0 0 20px"><strong>Online:</strong> <a href="${event.onlineUrl}" style="color:#2C5857">${event.onlineUrl}</a></p>` : ""}
      <p style="color:#666;line-height:1.6;margin:0 0 20px">${event.description.substring(0, 200)}...</p>
      <a href="${eventUrl}" style="display:inline-block;padding:12px 24px;background:#2C5857;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Lihat Kegiatan</a>
    </td></tr>
    <tr><td style="padding:16px 24px 24px;text-align:center;color:#999;font-size:12px">
      <p style="margin:0">© ${new Date().getFullYear()} FKHK — Forum Kajian Hukum Keluarga</p>
      <p style="margin:4px 0 0">Jika tidak ingin menerima email ini lagi, <a href="${frontendUrl}/unsubscribe" style="color:#999">berhenti berlangganan</a></p>
    </td></tr>
  </table>
</body>
</html>`;

  const batchSize = 50;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    await Promise.allSettled(
      batch.map((s) =>
        transporter.sendMail({
          from: FROM,
          to: s.email,
          subject: `📅 ${event.title}`,
          html,
        }).catch((err) => console.error("Mail error to", s.email, err.message))
      )
    );
  }
};
