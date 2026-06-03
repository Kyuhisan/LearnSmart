package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.Upload.IzvornaDatotekaResponseDTO;
import com.learnSmart.learnSmart.DTO.Upload.UploadResponseDTO;
import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import com.learnSmart.learnSmart.Service.IzvornaDatotekaService;
import com.learnSmart.learnSmart.Service.StorageService;
import com.learnSmart.learnSmart.Service.Transcript.TranscriptService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.OffsetDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IzvornaDatotekaControllerTest {

    @Mock private StorageService storageService;
    @Mock private PredmetRepository predmetRepository;
    @Mock private IzvornaDatotekaRepository izvornaDatotekaRepository;
    @Mock private TranscriptService transcriptService;
    @Mock private IzvornaDatotekaService izvornaDatotekaService;
    @Mock private Jwt jwt;

    @InjectMocks
    private IzvornaDatotekaController izvornaDatotekaController;

    private UUID uciteljId;
    private UUID predmetId;
    private UUID fileId;
    private Predmet predmet;
    private IzvornaDatoteka datoteka;
    private IzvornaDatotekaResponseDTO datotekaDTO;

    @BeforeEach
    void setUp() {
        uciteljId = UUID.randomUUID();
        predmetId = UUID.randomUUID();
        fileId    = UUID.randomUUID();

        predmet = new Predmet();
        predmet.setId(predmetId);
        predmet.setNaziv("Test Module");
        predmet.setUciteljId(uciteljId);

        datoteka = new IzvornaDatoteka();
        datoteka.setId(fileId);
        datoteka.setImeDatoteke("test.pdf");
        datoteka.setUrl("https://storage/test.pdf");
        datoteka.setTip("PDF");
        datoteka.setVelikostBytes(1024L);
        datoteka.setProcessingStatus("pending");
        datoteka.setUstvarjenOb(OffsetDateTime.now());
        datoteka.setPredmet(predmet);

        datotekaDTO = new IzvornaDatotekaResponseDTO(
                fileId, "test.pdf", "https://storage/test.pdf",
                "PDF", 1024L, "pending",
                OffsetDateTime.now(), predmetId, "Test Module"
        );
    }

    // ── getMoje ───────────────────────────────────────────────────────────────

    @Test
    void getMoje_returnsFiles() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(izvornaDatotekaRepository.findByPredmet_UciteljIdOrderByUstvarjenObDesc(uciteljId))
                .thenReturn(List.of(datoteka));

        ResponseEntity<List<IzvornaDatotekaResponseDTO>> response =
                izvornaDatotekaController.getMoje(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals("test.pdf", response.getBody().get(0).getImeDatoteke());
    }

    @Test
    void getMoje_returnsEmptyWhenNoFiles() {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(izvornaDatotekaRepository.findByPredmet_UciteljIdOrderByUstvarjenObDesc(uciteljId))
                .thenReturn(List.of());

        ResponseEntity<List<IzvornaDatotekaResponseDTO>> response =
                izvornaDatotekaController.getMoje(jwt);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }

    // ── upload ────────────────────────────────────────────────────────────────

    @Test
    void upload_uploadsPdfFile() throws Exception {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "content".getBytes());

        when(izvornaDatotekaService.calculateHash(file)).thenReturn("abc123");
        when(izvornaDatotekaRepository.findByPredmetIdAndHash(predmetId, "abc123"))
                .thenReturn(Optional.empty());
        when(storageService.upload(file, predmetId)).thenReturn("https://storage/test.pdf");
        when(izvornaDatotekaRepository.save(any())).thenReturn(datoteka);
        doNothing().when(transcriptService).processTranscript(any(), any(), any());

        ResponseEntity<UploadResponseDTO> response =
                izvornaDatotekaController.upload(jwt, List.of(file), predmetId);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
    }

    @Test
    void upload_returnsErrorWhenModuleNotFound() throws Exception {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.empty());

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "content".getBytes());

        ResponseEntity<UploadResponseDTO> response =
                izvornaDatotekaController.upload(jwt, List.of(file), predmetId);

        assertEquals(400, response.getStatusCode().value());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void upload_returns403WhenWrongOwner() throws Exception {
        UUID drugUciteljId = UUID.randomUUID();
        when(jwt.getSubject()).thenReturn(drugUciteljId.toString());
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "content".getBytes());

        ResponseEntity<UploadResponseDTO> response =
                izvornaDatotekaController.upload(jwt, List.of(file), predmetId);

        assertEquals(403, response.getStatusCode().value());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void upload_returnsErrorWhenDuplicateFile() throws Exception {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "content".getBytes());

        when(izvornaDatotekaService.calculateHash(file)).thenReturn("abc123");
        when(izvornaDatotekaRepository.findByPredmetIdAndHash(predmetId, "abc123"))
                .thenReturn(Optional.of(datoteka));

        ResponseEntity<UploadResponseDTO> response =
                izvornaDatotekaController.upload(jwt, List.of(file), predmetId);

        assertEquals(400, response.getStatusCode().value());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void upload_detectsVideoType() throws Exception {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.mp4", "video/mp4", "content".getBytes());

        when(izvornaDatotekaService.calculateHash(file)).thenReturn("vid123");
        when(izvornaDatotekaRepository.findByPredmetIdAndHash(predmetId, "vid123"))
                .thenReturn(Optional.empty());
        when(storageService.upload(file, predmetId)).thenReturn("https://storage/test.mp4");

        IzvornaDatoteka videoDatoteka = new IzvornaDatoteka();
        videoDatoteka.setId(UUID.randomUUID());
        videoDatoteka.setImeDatoteke("test.mp4");
        videoDatoteka.setUrl("https://storage/test.mp4");
        videoDatoteka.setTip("VIDEO");
        videoDatoteka.setVelikostBytes(5000L);
        videoDatoteka.setProcessingStatus("pending");
        videoDatoteka.setUstvarjenOb(OffsetDateTime.now());
        videoDatoteka.setPredmet(predmet);

        when(izvornaDatotekaRepository.save(any())).thenReturn(videoDatoteka);
        doNothing().when(transcriptService).processTranscript(any(), any(), any());

        ResponseEntity<UploadResponseDTO> response =
                izvornaDatotekaController.upload(jwt, List.of(file), predmetId);

        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void upload_detectsAudioType() throws Exception {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        when(predmetRepository.findById(predmetId)).thenReturn(Optional.of(predmet));

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.mp3", "audio/mpeg", "content".getBytes());

        when(izvornaDatotekaService.calculateHash(file)).thenReturn("aud123");
        when(izvornaDatotekaRepository.findByPredmetIdAndHash(predmetId, "aud123"))
                .thenReturn(Optional.empty());
        when(storageService.upload(file, predmetId)).thenReturn("https://storage/test.mp3");

        IzvornaDatoteka audioDatoteka = new IzvornaDatoteka();
        audioDatoteka.setId(UUID.randomUUID());
        audioDatoteka.setImeDatoteke("test.mp3");
        audioDatoteka.setUrl("https://storage/test.mp3");
        audioDatoteka.setTip("AUDIO");
        audioDatoteka.setVelikostBytes(2000L);
        audioDatoteka.setProcessingStatus("pending");
        audioDatoteka.setUstvarjenOb(OffsetDateTime.now());
        audioDatoteka.setPredmet(predmet);

        when(izvornaDatotekaRepository.save(any())).thenReturn(audioDatoteka);
        doNothing().when(transcriptService).processTranscript(any(), any(), any());

        ResponseEntity<UploadResponseDTO> response =
                izvornaDatotekaController.upload(jwt, List.of(file), predmetId);

        assertEquals(200, response.getStatusCode().value());
    }

    // ── getVisualContent ──────────────────────────────────────────────────────

    @Test
    void getVisualContent_returnsImgAndVideo() {
        IzvornaDatoteka img = new IzvornaDatoteka();
        img.setId(UUID.randomUUID()); img.setImeDatoteke("img.png");
        img.setUrl("https://storage/img.png"); img.setTip("IMG");
        img.setVelikostBytes(512L); img.setProcessingStatus("done");
        img.setUstvarjenOb(OffsetDateTime.now()); img.setPredmet(predmet);

        IzvornaDatoteka video = new IzvornaDatoteka();
        video.setId(UUID.randomUUID()); video.setImeDatoteke("vid.mp4");
        video.setUrl("https://storage/vid.mp4"); video.setTip("VIDEO");
        video.setVelikostBytes(5000L); video.setProcessingStatus("done");
        video.setUstvarjenOb(OffsetDateTime.now()); video.setPredmet(predmet);

        IzvornaDatoteka pdf = new IzvornaDatoteka();
        pdf.setId(UUID.randomUUID()); pdf.setImeDatoteke("doc.pdf");
        pdf.setUrl("https://storage/doc.pdf"); pdf.setTip("PDF");
        pdf.setVelikostBytes(1024L); pdf.setProcessingStatus("done");
        pdf.setUstvarjenOb(OffsetDateTime.now()); pdf.setPredmet(predmet);

        when(izvornaDatotekaRepository.findByPredmetId(predmetId))
                .thenReturn(List.of(img, video, pdf));

        ResponseEntity<List<IzvornaDatotekaResponseDTO>> response =
                izvornaDatotekaController.getVisualContent(predmetId);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().stream()
                .allMatch(d -> "IMG".equals(d.getTip()) || "VIDEO".equals(d.getTip())));
    }

    @Test
    void getVisualContent_returnsEmptyWhenNone() {
        when(izvornaDatotekaRepository.findByPredmetId(predmetId)).thenReturn(List.of());

        ResponseEntity<List<IzvornaDatotekaResponseDTO>> response =
                izvornaDatotekaController.getVisualContent(predmetId);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void getVisualContent_filtersPdfOut() {
        when(izvornaDatotekaRepository.findByPredmetId(predmetId))
                .thenReturn(List.of(datoteka)); // datoteka je PDF

        ResponseEntity<List<IzvornaDatotekaResponseDTO>> response =
                izvornaDatotekaController.getVisualContent(predmetId);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }

    // ── delete ────────────────────────────────────────────────────────────────

    @Test
    void delete_deletesFile() throws Exception {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        doNothing().when(izvornaDatotekaService).deleteFile(fileId, uciteljId);

        ResponseEntity<Void> response = izvornaDatotekaController.delete(fileId, jwt);

        assertEquals(204, response.getStatusCode().value());
        verify(izvornaDatotekaService, times(1)).deleteFile(fileId, uciteljId);
    }

    @Test
    void delete_returns500OnError() throws Exception {
        when(jwt.getSubject()).thenReturn(uciteljId.toString());
        doThrow(new RuntimeException("Storage error"))
                .when(izvornaDatotekaService).deleteFile(fileId, uciteljId);

        ResponseEntity<Void> response = izvornaDatotekaController.delete(fileId, jwt);

        assertEquals(500, response.getStatusCode().value());
    }
}