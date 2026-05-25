package com.learnSmart.learnSmart.Service.Transcript;

import com.learnSmart.learnSmart.Service.SupaBaseConnectionService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;

@Service
@RequiredArgsConstructor
public class PdfTranscriptService {
    private final SupaBaseConnectionService connectionService;

    public String extractFromPdf(String fileURL) throws IOException {
        URL url = URI.create(fileURL).toURL();
        HttpURLConnection connection = connectionService.createConnection(url);

        try (
                InputStream inputStream = connection.getInputStream();
                PDDocument pdDocument = Loader.loadPDF(inputStream.readAllBytes())
        ) {
            PDFTextStripper pdfTextStripper = new PDFTextStripper();
            return pdfTextStripper.getText(pdDocument);
        } finally {
            connection.disconnect();
        }
    }
}
