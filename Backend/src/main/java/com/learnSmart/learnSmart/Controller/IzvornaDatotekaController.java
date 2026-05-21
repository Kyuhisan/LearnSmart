package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.IzvornaDatotekaRequest;
import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import com.learnSmart.learnSmart.Service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/content")
public class IzvornaDatotekaController {
    private final StorageService storageService;
    private final PredmetRepository predmetRepository;
    private final IzvornaDatotekaRepository izvornaDatotekaRepository;

    public IzvornaDatotekaController(StorageService storageService, PredmetRepository predmetRepository, IzvornaDatotekaRepository izvornaDatotekaRepository) {
        this.storageService = storageService;
        this.predmetRepository = predmetRepository;
        this.izvornaDatotekaRepository = izvornaDatotekaRepository;
    }

    private String determineType(MultipartFile file) {
        String mimeType = file.getContentType();
        String tip;

        if (mimeType != null && mimeType.equals("application/pdf")) {
            tip = "PDF";
        } else if (mimeType != null && mimeType.equals("video/mp4")) {
            tip = "VIDEO";
        } else {
            tip = "IMG";
        }
        return tip;
    }

    private void buildVsebina(IzvornaDatotekaRequest req) {
        IzvornaDatoteka izvornaDatoteka = new IzvornaDatoteka();
        izvornaDatoteka.setPredmet(req.getPredmet());
        izvornaDatoteka.setImeDatoteke(req.getImeDatoteke());
        izvornaDatoteka.setUrl(req.getUrl());
        izvornaDatoteka.setTip(req.getTip());
        izvornaDatoteka.setVelikostBytes(req.getVelikostBytes());
        izvornaDatoteka.setProcessingStatus(req.getProcessingStatus());
        izvornaDatoteka.setUstvarjenOb(req.getUstvarjenOb());
        izvornaDatoteka.setManjsiTranscript(req.getManjsiTranscript());

        izvornaDatotekaRepository.save(izvornaDatoteka);
    }

    @PostMapping(value = {"/upload"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("predmetId") UUID predmetId
    ) {
        try {
            Predmet predmet = predmetRepository.findById(predmetId).orElseThrow(() -> new IllegalArgumentException("Subject does not exist."));
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
            buildVsebina(req);

            return ResponseEntity.ok(Map.of("url", url));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
