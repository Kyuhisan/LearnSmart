package com.learnSmart.learnSmart.Controller;

import com.learnSmart.learnSmart.DTO.VsebinaPredmet.VsebinaPredmetResponseDTO;
import com.learnSmart.learnSmart.DTO.VsebinaPredmet.VsebinaPredmetUpdateDTO;
import com.learnSmart.learnSmart.Model.VsebinaPredmet;
import com.learnSmart.learnSmart.Service.VsebinaPredmetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/{vsebinaPredmetId}")
    public ResponseEntity<Void> updateVsebinaPredmet(@PathVariable UUID vsebinaPredmetId, @RequestBody VsebinaPredmetUpdateDTO dto) {
        vsebinaPredmetService.updateVsebinaPredmet(vsebinaPredmetId, dto.getVsebina());
        return ResponseEntity.ok().build();
    }
}
