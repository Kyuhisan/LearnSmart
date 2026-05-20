package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.Model.Predmet;
import com.learnSmart.learnSmart.Model.Vsebina;
import com.learnSmart.learnSmart.Repository.PredmetRepository;
import com.learnSmart.learnSmart.Repository.VsebinaRepository;
import com.learnSmart.learnSmart.Service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/content")
public class VsebinaController {
    private final StorageService storageService;
    private final PredmetRepository predmetRepository;
    private final VsebinaRepository vsebinaRepository;

    public VsebinaController(StorageService storageService,  PredmetRepository predmetRepository, VsebinaRepository vsebinaRepository) {
        this.storageService = storageService;
        this.predmetRepository = predmetRepository;
        this.vsebinaRepository = vsebinaRepository;
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

    private void buildVsebina(Predmet predmet, String naziv, String tip, String ucniStil, String url, Integer vrstniRed) {
        Vsebina vsebina = new Vsebina();
        vsebina.setPredmet(predmet);
        vsebina.setNaziv(naziv);
        vsebina.setTip(tip);
        vsebina.setUcniStil(ucniStil);
        vsebina.setUrl(url);
        vsebina.setVrstniRed(vrstniRed);

        vsebinaRepository.save(vsebina);
    }

    @PostMapping(value = {"/upload"}, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("predmetId") UUID predmetId,
            @RequestParam("naziv") String naziv,
            @RequestParam(value = "ucniStil", required = false) String ucniStil,
            @RequestParam(value = "vrstniRed", required = false)  Integer vrstniRed
    ) {
        try {
            Predmet predmet = predmetRepository.findById(predmetId).orElseThrow(() -> new IllegalArgumentException("Subject does not exist."));
            String url = storageService.upload(file, predmetId);
            String tip = determineType(file);
            buildVsebina(predmet, naziv, tip, ucniStil, url, vrstniRed);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
