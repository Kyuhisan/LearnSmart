package com.learnSmart.learnSmart.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class SupaBaseConnectionService {

    @Value("${SUPABASE_SERVICE_KEY}")
    private String supabaseServiceKey;

    public HttpURLConnection createConnection(URL url) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("apikey", supabaseServiceKey);
        connection.setRequestProperty("Authorization", "Bearer " + supabaseServiceKey);
        return connection;
    }

    @SuppressWarnings("java:S5445")
    public Path downloadFile(String fileURL, String prefix) throws IOException {
        URL url = URI.create(fileURL).toURL();
        HttpURLConnection connection = createConnection(url);

        String extension = ".tmp";
        String path = url.getPath();
        int dotIndex = path.lastIndexOf('.');

        if (dotIndex != -1) {
            extension = path.substring(dotIndex);
        }

        Path tmpFile = Files.createTempFile(prefix, extension);

        try {
            Files.copy(
                    connection.getInputStream(),
                    tmpFile,
                    StandardCopyOption.REPLACE_EXISTING);

            return tmpFile;
        } finally {
            connection.disconnect();
        }
    }
}
