package com.learnSmart.learnSmart.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${SUPABASE_URL}")
    private String supabaseUrl;

    @Value("${SUPABASE_SERVICE_KEY}")
    private String supabaseServiceKey;

    private RestTemplate restTemplate = new RestTemplate();


    private void validateFile(MultipartFile file) {
        String mimeType = file.getContentType();

        if (mimeType == null || (!mimeType.equals("application/pdf") && !mimeType.startsWith("video/") && !mimeType.startsWith("image/") && !mimeType.startsWith("audio/"))) {
            throw new IllegalArgumentException("Unsupported file type: " + mimeType);
        }

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

    private void uploadToSupabase(MultipartFile file, String path, String bucket) throws IOException {
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + path;
        String contentType = file.getContentType();

        if (contentType == null) {
            throw new IOException("Cannot determine file type");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseServiceKey);
        headers.set("Authorization", "Bearer " + supabaseServiceKey);
        headers.setContentType(MediaType.parseMediaType(contentType));

        HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);
        restTemplate.exchange(
                uploadUrl,
                HttpMethod.POST,
                request,
                byte[].class
        );
    }

    public String uploadFile(Path filePath, String mimeType, UUID predmetId) throws IOException {
        String extension = filePath.getFileName().toString();
        extension = extension.contains(".") ? extension.substring(extension.lastIndexOf(".")) : "";
        String fileName = UUID.randomUUID() + extension; // <--- we can change the name if we want to
        String path = "modules/" + predmetId + "/" + fileName;
        String bucket = "learnsmart-media";

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseServiceKey);
        headers.set("Authorization", "Bearer " + supabaseServiceKey);
        headers.setContentType(MediaType.parseMediaType(mimeType));

        byte[] bytes = Files.readAllBytes(filePath);
        HttpEntity<byte[]> request = new HttpEntity<>(bytes, headers);
        restTemplate.exchange(
                supabaseUrl + "/storage/v1/object/" + bucket + "/" +path,
                HttpMethod.POST,
                request,
                byte[].class
        );
        return buildPublicURL(bucket, path);
    }

    private String buildPublicURL(String bucket, String path) {
        return supabaseUrl + "/storage/v1/object/" + bucket + "/" + path;
    }

    public String upload(MultipartFile file, UUID predmetId) throws IOException {
        validateFile(file);
        String bucket = resolveBucket(file.getContentType());
        String path = buildPath(file, predmetId);
        uploadToSupabase(file, path, bucket);
        return buildPublicURL(bucket, path);
    }

}
