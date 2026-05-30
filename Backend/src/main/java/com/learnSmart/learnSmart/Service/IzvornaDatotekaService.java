package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

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
}
