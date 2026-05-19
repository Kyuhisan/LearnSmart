package com.learnSmart.learnSmart.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class StorageService {

    @Value("${SUPABASE_URL}")
    private String SUPBASE_URL;

    @Value("${SUPABASE_SERVICE_KEY}")
    private String SUPABASE_SERVICE_KEY;

    private RestTemplate restTemplate = new RestTemplate();


    private void validateFile(MultipartFile file) {
        String mimeType = file.getContentType();

        if (mimeType == null || (!mimeType.equals("application/pdf") && !mimeType.equals("video/mp4") && !mimeType.startsWith("image/"))) {
            throw new IllegalArgumentException("Unsupported file type: " + mimeType);
        }

        boolean isPdf = mimeType.equals("application/pdf");
        boolean isVideo = mimeType.equals("video/mp4");
        long maxSize = isVideo ? 500L * 1024 * 1024 : 50L * 1024 * 1024;

        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException(("File size is too large." + (isVideo ? "500MB" : "50MB")));
        }
    }

    private String resolveBucket(String mimeType) {
        if (mimeType.equals("application/pdf")) {
            return "materials";
        } else {
            return "learnsmart-media";
        }
    }

    private String buildPath(MultipartFile file, UUID predmetId) {
        String originalFilename = file.getOriginalFilename();
        String ext = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID() + ext;
        return "modules/" + predmetId + "/" + fileName;
    }

    private void uploadToSupabase(MultipartFile file, String path, String bucket) throws Exception {
        String uploadUrl = SUPBASE_URL + "/storage/v1/object/" + bucket + "/" + path;

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", SUPABASE_SERVICE_KEY);
        headers.set("Authorization", "Bearer " + SUPABASE_SERVICE_KEY);
        headers.setContentType(MediaType.parseMediaType(file.getContentType()));

        HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);
        restTemplate.exchange(
                uploadUrl,
                HttpMethod.POST,
                request,
                byte[].class
        );
    }

    private String buildPublicURL(String bucket, String path) throws Exception {
        return SUPBASE_URL + "/storage/v1/object/" + bucket + "/" + path;
    }

    public String upload(MultipartFile file, UUID predmetId) throws Exception {
        validateFile(file);
        String bucket = resolveBucket(file.getContentType());
        String path = buildPath(file, predmetId);
        uploadToSupabase(file, path, bucket);
        return buildPublicURL(bucket, path);
    }

}
