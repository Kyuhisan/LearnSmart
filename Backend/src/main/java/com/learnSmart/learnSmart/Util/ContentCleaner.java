package com.learnSmart.learnSmart.Util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ContentCleaner {

    public static String cleanMarkdown(String text) {
        if (text == null) {
            return "";
        }

        return text
                .replaceAll("\\*\\*(.*?)\\*\\*", "$1")
                .replaceAll("\\*(.*?)\\*", "$1")
                .replace("## ", "")
                .trim();
    }


    public static Object cleanContent(Object value) {
        if (value instanceof String str) {
            return cleanMarkdown(str);
        }

        if (value instanceof List<?> list) {
            return list.stream()
                    .map(ContentCleaner::cleanContent)
                    .toList();
        }

        if (value instanceof Map<?, ?> map) {
            Map<String, Object> cleaned = new HashMap<>();

            map.forEach((k, v) -> {
               cleaned.put((String) k, cleanContent(v));
            });

            return cleaned;
        }
        return value;
    }
}
