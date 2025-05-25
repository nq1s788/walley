package com.walley.walley;

import com.walley.walley.controllers.MainController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

@SpringBootApplication
public class WalleyApplication {

	public static void main(String[] args) throws IOException {

		String url = "http://localhost:8080/users/create?email=test@example.com&password=123456";
		HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
		con.setRequestMethod("POST");
		int status = con.getResponseCode();
		System.out.println("Response code: " + status);
		con.disconnect();
	}

}
