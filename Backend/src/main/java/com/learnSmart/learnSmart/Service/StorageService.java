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

    private static final String API_KEY_HEADER = "apikey";
    private static final String STORAGE_PATH = "/storage/v1/object/";

    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set(API_KEY_HEADER, supabaseServiceKey);
        headers.setBearerAuth(supabaseServiceKey);

        return headers;
    }

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

    /** Strips all non-alphanumeric characters from a user-supplied file extension. */
    private String sanitizeExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) return "";
        String raw = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        String safe = raw.replaceAll("[^a-zA-Z0-9]", "");
        return safe.isEmpty() ? "" : "." + safe;
    }

    private String buildPath(MultipartFile file, UUID predmetId) {
        String ext = sanitizeExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + ext;
        return "modules/" + predmetId + "/" + fileName;
    }

    private void uploadToSupabase(MultipartFile file, String path, String bucket) throws IOException {
        String uploadUrl = supabaseUrl + STORAGE_PATH + bucket + "/" + path;
        String contentType = file.getContentType();

        if (contentType == null) {
            throw new IOException("Cannot determine file type");
        }

        HttpHeaders headers = createHeaders();
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
        Path fileNamePath = filePath.getFileName();

        if (fileNamePath == null) {
            throw new IllegalArgumentException("Invalid file path.");
        }

        String ext = sanitizeExtension(fileNamePath.toString());
        String fileName = UUID.randomUUID() + ext;
        String path = "modules/" + predmetId + "/" + fileName;
        String bucket = "learnsmart-media";

        HttpHeaders headers = createHeaders();
        headers.setContentType(MediaType.parseMediaType(mimeType));

        byte[] bytes = Files.readAllBytes(filePath);
        HttpEntity<byte[]> request = new HttpEntity<>(bytes, headers);
        restTemplate.exchange(
                supabaseUrl + STORAGE_PATH + bucket + "/" + path,
                HttpMethod.POST,
                request,
                byte[].class
        );
        return buildPublicURL(bucket, path);
    }

    private String buildPublicURL(String bucket, String path) {
        return supabaseUrl + STORAGE_PATH + bucket + "/" + path;
    }

    public String upload(MultipartFile file, UUID predmetId) throws IOException {
        validateFile(file);
        String bucket = resolveBucket(file.getContentType());
        String path = buildPath(file, predmetId);
        uploadToSupabase(file, path, bucket);
        return buildPublicURL(bucket, path);
    }

    public void deleteFile(String fileUrl) throws IOException {
        String prefix = supabaseUrl + STORAGE_PATH;

        if (!fileUrl.startsWith(prefix)) {
            throw new IllegalArgumentException("Invalid Supabase file url.");
        }

        String bucketAndPath = fileUrl.substring(prefix.length());
        int slashIndex = bucketAndPath.indexOf("/");

        if (slashIndex == -1) {
            throw new IllegalArgumentException("Invalid Supabase file url.");
        }

        String bucket = bucketAndPath.substring(0, slashIndex);
        String path = bucketAndPath.substring(slashIndex + 1);

        String deleteUrl = supabaseUrl + STORAGE_PATH + bucket + "/" + path;

        HttpHeaders headers = createHeaders();
        HttpEntity<Void> request = new HttpEntity<>(headers);

        restTemplate.exchange(
                deleteUrl,
                HttpMethod.DELETE,
                request,
                Void.class
        );
    }

}
