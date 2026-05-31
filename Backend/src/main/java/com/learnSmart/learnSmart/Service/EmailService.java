package com.learnSmart.learnSmart.Service;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void poslji(String to, String tip, String naslov, String sporocilo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "LearnSmart");
            helper.setTo(to);
            helper.setSubject(naslov);
            helper.setText(buildHtml(tip, naslov, sporocilo), true);
            mailSender.send(message);
            log.info("Email poslan na {}: {}", to, naslov);
        } catch (Exception e) {
            log.error("Napaka pri pošiljanju emaila na {}: {}", to, e.getMessage());
        }
    }
    @SuppressFBWarnings("VA_FORMAT_STRING_USES_NEWLINE")
    private String buildHtml(String tip, String naslov, String sporocilo) {
        String tagColor = switch (tip) {
            case "QUIZ"   -> "#e85d5d";
            case "MODULE" -> "#f5c842";
            default       -> "#888888";
        };

        return """
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background:#f5f0e8;font-family:'Arial',sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 0;">
                    <tr>
                      <td align="center">
                        <table width="560" cellpadding="0" cellspacing="0" style="background:#fffdf7;border:3px solid #1a1a1a;border-radius:4px;overflow:hidden;box-shadow:4px 4px 0px #1a1a1a;">

                          <!-- HEADER -->
                          <tr>
                            <td style="background:#f5c842;padding:16px 24px;border-bottom:3px solid #1a1a1a;">
                              <span style="font-size:16px;font-weight:900;color:#1a1a1a;letter-spacing:2px;">LEARNSMART</span>
                            </td>
                          </tr>

                          <!-- NOTIFICATION ROW -->
                          <tr>
                            <td style="padding:24px;">
                              <div style="border:2px solid #1a1a1a;border-radius:4px;background:#fffdf7;box-shadow:3px 3px 0px #1a1a1a;padding:16px;">

                                <!-- dot + tag -->
                                <div style="margin-bottom:8px;">
                                  <span style="display:inline-block;width:8px;height:8px;border-radius:50%%;background:%s;margin-right:6px;vertical-align:middle;"></span>
                                  <span style="display:inline-block;background:#fffdf7;border:2px solid #1a1a1a;font-size:10px;font-weight:900;padding:2px 8px;letter-spacing:1px;color:#1a1a1a;vertical-align:middle;">%s</span>
                                </div>

                                <!-- title -->
                                <div style="font-size:14px;font-weight:900;color:#1a1a1a;margin-bottom:6px;">%s</div>

                                <!-- body -->
                                <div style="font-size:12px;color:#888888;font-family:'Courier New',monospace;line-height:1.6;">%s</div>

                              </div>
                            </td>
                          </tr>

                          <!-- FOOTER -->
                          <tr>
                            <td style="background:#f5f0e8;padding:12px 24px;border-top:2px solid #1a1a1a;">
                              <span style="font-size:10px;color:#999999;letter-spacing:0.5px;font-family:'Courier New',monospace;">LEARNSMART — Automatic platform notification</span>
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(tagColor, tip, naslov, sporocilo);
    }
}