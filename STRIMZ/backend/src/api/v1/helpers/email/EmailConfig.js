const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendMail = async (receiver, text, html, subject) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Strimz <onboarding@resend.dev>",
      to: [receiver],
      subject: subject ?? "Email Verification",
      html: html || undefined,
      text: text || undefined,
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return { success: false };
    }

    console.log("[Email] Sent to", receiver, "id:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("[Email] Send failed:", error);
    return { success: false };
  }
};