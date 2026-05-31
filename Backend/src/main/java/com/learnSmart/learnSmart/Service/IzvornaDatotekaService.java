package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.MessageDigest;
import java.util.UUID;

@SuppressFBWarnings(value = "EI_EXPOSE_REP2", justification = "Spring dependency injection.")
@Service
@RequiredArgsConstructor
public class IzvornaDatotekaService {

    private final IzvornaDatotekaRepository izvornaDatotekaRepository;
    private final StorageService storageService;

    public void deleteFile(UUID fileId, UUID profesorId) throws IOException {
        IzvornaDatoteka file = izvornaDatotekaRepository.findById(fileId).orElseThrow(() -> new IllegalArgumentException("File not found."));

        if (!file.getPredmet().getUciteljId().equals(profesorId)) {
            throw new IllegalArgumentException("Access denied.");
        }

        storageService.deleteFile(file.getUrl());
        izvornaDatotekaRepository.deleteById(fileId);
    }

    public String calculateHash(MultipartFile file) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(file.getBytes());
            StringBuilder sb = new StringBuilder();

            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }

            return sb.toString();

        } catch (Exception e) {
            throw new RuntimeException("Falied to calculate hash.", e);
        }
    }
}
