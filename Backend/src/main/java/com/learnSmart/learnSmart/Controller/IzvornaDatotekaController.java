package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.IzvornaDatotekaRequest;
import com.learnSmart.learnSmart.DTO.Upload.IzvornaDatotekaResponseDTO;
import com.learnSmart.learnSmart.DTO.Upload.UploadResponseDTO;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import com.learnSmart.learnSmart.Service.IzvornaDatotekaService;
import com.learnSmart.learnSmart.Service.StorageService;
import com.learnSmart.learnSmart.Service.Transcript.TranscriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.*;


@RestController
@RequestMapping("/content")
@RequiredArgsConstructor
public class IzvornaDatotekaController {
    private final StorageService storageService;
    private final PredmetRepository predmetRepository;
    private final IzvornaDatotekaRepository izvornaDatotekaRepository;
    private final TranscriptService transcriptService;
    private final IzvornaDatotekaService izvornaDatotekaService;


    private String determineType(MultipartFile file) {
        String mimeType = file.getContentType();
        String tip;

        if (mimeType != null && mimeType.equals("application/pdf")) {
            tip = "PDF";
        } else if (mimeType != null && mimeType.startsWith("video/")) {
            tip = "VIDEO";
        } else if (mimeType != null && mimeType.startsWith("audio/")) {
            tip = "AUDIO";
        } else {
            tip = "IMG";
        }
        return tip;
    }

    private IzvornaDatoteka buildVsebina(IzvornaDatotekaRequest req) {
        IzvornaDatoteka izvornaDatoteka = new IzvornaDatoteka();
        izvornaDatoteka.setPredmet(req.getPredmet());
        izvornaDatoteka.setImeDatoteke(req.getImeDatoteke());
        izvornaDatoteka.setUrl(req.getUrl());
        izvornaDatoteka.setTip(req.getTip());
        izvornaDatoteka.setVelikostBytes(req.getVelikostBytes());
        izvornaDatoteka.setProcessingStatus(req.getProcessingStatus());
        izvornaDatoteka.setUstvarjenOb(req.getUstvarjenOb());
        izvornaDatoteka.setManjsiTranscript(req.getManjsiTranscript());
        izvornaDatoteka.setHash(req.getHash());

        return izvornaDatotekaRepository.save(izvornaDatoteka);
    }

    @GetMapping("/moje")
    public ResponseEntity<List<IzvornaDatotekaResponseDTO>> getMoje(@AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());
        List<IzvornaDatotekaResponseDTO> result = izvornaDatotekaRepository
                .findByPredmet_UciteljIdOrderByUstvarjenObDesc(uciteljId)
                .stream()
                .map(d -> new IzvornaDatotekaResponseDTO(
                        d.getId(),
                        d.getImeDatoteke(),
                        d.getUrl(),
                        d.getTip(),
                        d.getVelikostBytes(),
                        d.getProcessingStatus(),
                        d.getUstvarjenOb(),
                        d.getPredmet().getId(),
                        d.getPredmet().getNaziv()
                ))
                .toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = {"/upload"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResponseDTO> upload(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") List<MultipartFile> files,
            @RequestParam("predmetId") UUID predmetId
    ) {
        try {
            UUID uciteljId = UUID.fromString(jwt.getSubject());
            Predmet predmet = predmetRepository.findById(predmetId).orElseThrow(() -> new IllegalArgumentException("Subject does not exist."));
            if (!predmet.getUciteljId().equals(uciteljId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(UploadResponseDTO.error("Access denied."));
            }

            List<Map<String, Object>> uploadedFiles = new ArrayList<>();

            for (MultipartFile file : files) {
                String hash = izvornaDatotekaService.calculateHash(file);

                if (izvornaDatotekaRepository.findByPredmetIdAndHash(predmetId, hash).isPresent()) {
                    throw new IllegalArgumentException("File already exists.");
                }

                String imeDatoteke = file.getOriginalFilename();
                String url = storageService.upload(file, predmetId);
                String tip = determineType(file);
                Long velikostBytes = file.getSize();

                IzvornaDatotekaRequest req = new IzvornaDatotekaRequest();
                req.setPredmet(predmet);
                req.setImeDatoteke(imeDatoteke);
                req.setUrl(url);
                req.setTip(tip);
                req.setVelikostBytes(velikostBytes);
                req.setProcessingStatus("pending");
                req.setUstvarjenOb(OffsetDateTime.now());
                req.setManjsiTranscript(null);
                req.setHash(hash);
                IzvornaDatoteka izvornaDatoteka = buildVsebina(req);

                transcriptService.processTranscript(izvornaDatoteka.getId(), url, tip);

                uploadedFiles.add(Map.of(
                        "fileName", imeDatoteke,
                        "url", url
                ));
            }

            return ResponseEntity.ok(UploadResponseDTO.success(uploadedFiles));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(UploadResponseDTO.error(e.getMessage()));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(UploadResponseDTO.error(e.getMessage()));
        }
    }

    @GetMapping("/predmet/{predmetId}/visual")
    public ResponseEntity<List<IzvornaDatotekaResponseDTO>> getVisualContent(@PathVariable UUID predmetId) {
        List<IzvornaDatotekaResponseDTO> result = izvornaDatotekaRepository
                .findByPredmetId(predmetId)
                .stream()
                .filter(d ->
                        "IMG".equals(d.getTip()) ||
                        "VIDEO".equals(d.getTip())
                )
                .map(d -> new IzvornaDatotekaResponseDTO(
                        d.getId(),
                        d.getImeDatoteke(),
                        d.getUrl(),
                        d.getTip(),
                        d.getVelikostBytes(),
                        d.getProcessingStatus(),
                        d.getUstvarjenOb(),
                        d.getPredmet().getId(),
                        d.getPredmet().getNaziv()
                )).toList();
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> delete(@PathVariable UUID fileId, @AuthenticationPrincipal Jwt jwt) {
        UUID uciteljId = UUID.fromString(jwt.getSubject());

        try {
            izvornaDatotekaService.deleteFile(fileId, uciteljId);

            return ResponseEntity.noContent().build();
        } catch(Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
