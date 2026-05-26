package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.VsebinaPredmet.VsebinaPredmetResponseDTO;
import com.learnSmart.learnSmart.Repository.VsebinaPredmetRepository;
import com.learnSmart.learnSmart.Service.VsebinaPredmetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/moduli/{predmetId}/vsebina")
@RequiredArgsConstructor
public class VsebinaPredmetController {
    private final VsebinaPredmetService vsebinaPredmetService;

    @GetMapping
    public ResponseEntity<List<VsebinaPredmetResponseDTO>> getVsebinaPredmet(@PathVariable UUID predmetId){
        return ResponseEntity.ok(vsebinaPredmetService.getVsebinaPredmeta(predmetId));
    }
}
