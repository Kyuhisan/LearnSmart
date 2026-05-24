package com.learnSmart.learnSmart.DTO.Upload;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuppressFBWarnings({"EI_EXPOSE_REP", "EI_EXPOSE_REP2"})
public class UploadResponseDTO {
    private boolean success;
    private List<Map<String, Object>> files;
    private String error;

    public static UploadResponseDTO success(List<Map<String, Object>> files){
        UploadResponseDTO response = new UploadResponseDTO();
        response.setSuccess(true);
        response.setFiles(files);

        return response;
    }

    public static UploadResponseDTO error(String error){
        UploadResponseDTO response = new UploadResponseDTO();
        response.setSuccess(false);
        response.setError(error);

        return response;
    }
}
