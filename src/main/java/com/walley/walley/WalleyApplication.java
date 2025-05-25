package com.walley.walley;

import com.walley.walley.controllers.MainController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
public class WalleyApplication {

	public static void main(String[] args) {

		URL url = new URL("http://localhost:8080/");  // your Spring Boot URL
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();

		connection.setRequestMethod("POST");
		connection.setDoOutput(true); // Enable sending data
		connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

		// Build form data
		String formData = "action=register&email=test@example.com&password=123456";

		// Send request
		try (OutputStream os = connection.getOutputStream()) {
			byte[] input = formData.getBytes(StandardCharsets.UTF_8);
			os.write(input, 0, input.length);
		}

		// Read response
		int responseCode = connection.getResponseCode();
		System.out.println("Response Code: " + responseCode);

		if (responseCode == HttpURLConnection.HTTP_OK ||
				responseCode == HttpURLConnection.HTTP_MOVED_TEMP) {
			System.out.println("User created or redirected successfully.");
		} else {
			System.out.println("Failed to create user.");
		}

		connection.disconnect();
	}

}
