package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

@Service
public class TranscriptService {

    @Value("${SUPABASE_SERVICE_KEY}")
    private String supabaseServiceKey;

    private final IzvornaDatotekaRepository izvornaDatotekaRepository;

    public TranscriptService(IzvornaDatotekaRepository izvornaDatotekaRepository) {
        this.izvornaDatotekaRepository = izvornaDatotekaRepository;
    }

    private String extractFromPdf(String fileURL) throws IOException {
        URL url = new URL(fileURL);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("apikey", supabaseServiceKey);
        connection.setRequestProperty("Authorization", "Bearer " + supabaseServiceKey);

        InputStream inputStream = connection.getInputStream();
        PDDocument pdDocument = Loader.loadPDF(inputStream.readAllBytes());
        PDFTextStripper pdfTextStripper = new PDFTextStripper();
        String text = pdfTextStripper.getText(pdDocument);
        pdDocument.close();
        return text;
    }




    private void extractFromMp3() {}
    private void extractFromMp4() {}


    public String extractTranscript(String fileURL, String tip) throws IOException {
        if (tip.equals("PDF")) {
            return extractFromPdf(fileURL);
        } else {
            return null;
        }
    }

    @Async
    public void processTranscript(UUID izvornaDatotekaId, String fileURL, String tip) {
        try {
            String transcript = extractTranscript(fileURL, tip);

            IzvornaDatoteka datoteka = izvornaDatotekaRepository.findById(izvornaDatotekaId).orElseThrow(() -> new IllegalArgumentException("File does not exist"));
            datoteka.setManjsiTranscript(transcript);
            datoteka.setProcessingStatus("done");
            izvornaDatotekaRepository.save(datoteka);
        } catch(Exception e) {
            System.out.println("Transcipt failed: " + e.getMessage());
            e.printStackTrace();

            izvornaDatotekaRepository.findById(izvornaDatotekaId).ifPresent(d -> {
                d.setProcessingStatus("failed");
                izvornaDatotekaRepository.save(d);
            });
        }
    }
}
