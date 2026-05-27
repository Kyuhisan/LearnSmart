package com.learnSmart.learnSmart.Service.Transcript;

import com.learnSmart.learnSmart.Model.IzvornaDatoteka;
import com.learnSmart.learnSmart.Repository.IzvornaDatotekaRepository;
import com.learnSmart.learnSmart.Service.StorageService;
import com.learnSmart.learnSmart.Service.SupaBaseConnectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoTranscriptionService {

    private final IzvornaDatotekaRepository izvornaDatotekaRepository;
    private final SupaBaseConnectionService connectionService;
    private final StorageService storageService;
    private final AudioTranscriptionService audioTranscriptionService;

    private boolean hasAudioStream(Path tmpVideo) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(
                "ffprobe", "-v", "error",
                "-select_streams", "a",
                "-show_entries", "stream=codec_type",
                "-of", "default=noprint_wrappers=1:nokey=1",
                tmpVideo.toString()
        );
        pb.redirectErrorStream(true);
        Process process = pb.start();

        String output;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            output = reader.lines().collect(Collectors.joining());
        }

        process.waitFor();
        return output.contains("audio");
    }

    @SuppressWarnings("java:S5445")
    private Path extractAudioFromVideo(Path tmpVideo) throws IOException, InterruptedException {
        Path tmpAudio = Files.createTempFile("audio-", ".mp3"); //NOSONAR

        ProcessBuilder processBuilder = new ProcessBuilder(
                "ffmpeg",
                "-y",
                "-i",
                tmpVideo.toString(),
                "-vn",
                "-acodec",
                "mp3",
                tmpAudio.toString()
        );
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();


        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            String line;

            while ((line = reader.readLine()) != null) {
                log.info("FFmpeg line: {}", line);
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IOException("FFmpeg audio extraction failed.");
        }
        return tmpAudio;
    }

    private void saveAudioFile(IzvornaDatoteka videoDatoteka, String audioUrl, Path tmpAudio) throws IOException {
        if (tmpAudio == null) {
            throw new IllegalStateException("Audio path invalid.");
        }

        Path fileNamePath = tmpAudio.getFileName();

        if (fileNamePath == null) {
            throw new IllegalStateException("Audio path invalid.");
        }

        IzvornaDatoteka audioDatoteka = new IzvornaDatoteka();
        audioDatoteka.setPredmet(videoDatoteka.getPredmet());
        audioDatoteka.setImeDatoteke(fileNamePath.toString());
        audioDatoteka.setUrl(audioUrl);
        audioDatoteka.setTip("AUDIO");
        audioDatoteka.setProcessingStatus("done");
        audioDatoteka.setUstvarjenOb(OffsetDateTime.now());
        audioDatoteka.setVelikostBytes(Files.size(tmpAudio));
        audioDatoteka.setGeneriranaIz(videoDatoteka);

        izvornaDatotekaRepository.save(audioDatoteka);
    }


    public String extractFromMp4(IzvornaDatoteka videoDatoteka) throws IOException {
        UUID predmetId = videoDatoteka.getPredmet().getId();
        Path tmpVideo = connectionService.downloadFile(videoDatoteka.getUrl(), "video-");
        Path tmpAudio = null;

        try {
            if (!hasAudioStream(tmpVideo)) {
                log.info("Video {} has no audio stream, skipping transcription.", videoDatoteka.getImeDatoteke());
                return null;
            }

            tmpAudio = extractAudioFromVideo(tmpVideo);

            String audioUrl = storageService.uploadFile(tmpAudio, "audio/mpeg", predmetId);
            saveAudioFile(videoDatoteka, audioUrl, tmpAudio);
            return audioTranscriptionService.transcribeAudio(tmpAudio);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Video processing interrupted." ,e);

        } finally {
            Files.deleteIfExists(tmpVideo);

            if (tmpAudio != null) {
                Files.deleteIfExists(tmpAudio);

                Path parent = tmpVideo.getParent();
                if (parent != null) {
                    Files.deleteIfExists(parent);
                }
            }
        }
    }
}
