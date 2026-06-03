package com.learnSmart.learnSmart.Service;

import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IzvornaDatotekaServiceTest {

    @Mock private IzvornaDatotekaRepository izvornaDatotekaRepository;
    @Mock private StorageService storageService;

    @InjectMocks
    private IzvornaDatotekaService izvornaDatotekaService;

    private UUID fileId;
    private UUID profesorId;
    private UUID drugProfId;
    private Predmet predmet;
    private IzvornaDatoteka datoteka;

    @BeforeEach
    void setUp() {
        fileId     = UUID.randomUUID();
        profesorId = UUID.randomUUID();
        drugProfId = UUID.randomUUID();

        predmet = new Predmet();
        predmet.setId(UUID.randomUUID());
        predmet.setNaziv("Test Module");
        predmet.setUciteljId(profesorId);

        datoteka = new IzvornaDatoteka();
        datoteka.setId(fileId);
        datoteka.setImeDatoteke("test.pdf");
        datoteka.setUrl("https://storage/test.pdf");
        datoteka.setTip("PDF");
        datoteka.setPredmet(predmet);
    }

    // ── deleteFile ────────────────────────────────────────────────────────────

    @Test
    void deleteFile_deletesSuccessfully() throws IOException {
        when(izvornaDatotekaRepository.findById(fileId)).thenReturn(Optional.of(datoteka));
        doNothing().when(storageService).deleteFile(datoteka.getUrl());
        doNothing().when(izvornaDatotekaRepository).deleteById(fileId);

        assertDoesNotThrow(() -> izvornaDatotekaService.deleteFile(fileId, profesorId));

        verify(storageService, times(1)).deleteFile(datoteka.getUrl());
        verify(izvornaDatotekaRepository, times(1)).deleteById(fileId);
    }

    @Test
    void deleteFile_throwsWhenFileNotFound() throws IOException {
        when(izvornaDatotekaRepository.findById(fileId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> izvornaDatotekaService.deleteFile(fileId, profesorId));

        verify(storageService, never()).deleteFile(any());
        verify(izvornaDatotekaRepository, never()).deleteById(any());
    }

    @Test
    void deleteFile_throwsWhenWrongOwner() throws IOException {
        when(izvornaDatotekaRepository.findById(fileId)).thenReturn(Optional.of(datoteka));

        assertThrows(IllegalArgumentException.class,
                () -> izvornaDatotekaService.deleteFile(fileId, drugProfId));

        verify(storageService, never()).deleteFile(any());
        verify(izvornaDatotekaRepository, never()).deleteById(any());
    }

    // ── calculateHash ─────────────────────────────────────────────────────────

    @Test
    void calculateHash_returnsSha256Hash() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "hello world".getBytes());

        String hash = izvornaDatotekaService.calculateHash(file);

        assertNotNull(hash);
        assertEquals(64, hash.length()); // SHA-256 = 64 hex znakov
    }

    @Test
    void calculateHash_returnsSameHashForSameContent() {
        MockMultipartFile file1 = new MockMultipartFile(
                "file", "a.pdf", "application/pdf", "same content".getBytes());
        MockMultipartFile file2 = new MockMultipartFile(
                "file", "b.pdf", "application/pdf", "same content".getBytes());

        String hash1 = izvornaDatotekaService.calculateHash(file1);
        String hash2 = izvornaDatotekaService.calculateHash(file2);

        assertEquals(hash1, hash2);
    }

    @Test
    void calculateHash_returnsDifferentHashForDifferentContent() {
        MockMultipartFile file1 = new MockMultipartFile(
                "file", "a.pdf", "application/pdf", "content A".getBytes());
        MockMultipartFile file2 = new MockMultipartFile(
                "file", "b.pdf", "application/pdf", "content B".getBytes());

        String hash1 = izvornaDatotekaService.calculateHash(file1);
        String hash2 = izvornaDatotekaService.calculateHash(file2);

        assertNotEquals(hash1, hash2);
    }

    @Test
    void calculateHash_handlesEmptyFile() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "empty.pdf", "application/pdf", new byte[0]);

        String hash = izvornaDatotekaService.calculateHash(file);

        assertNotNull(hash);
        assertEquals(64, hash.length());
    }
}