package com.walley.walley;

import com.walley.walley.controllers.MainController;

import com.walley.walley.repo.MyUserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
@EntityScan("com.walley.walley.models")
@EnableJpaRepositories("com.walley.walley.repo")
public class WalleyApplication {

	public static void main(String[] args) {
		SpringApplication.run(WalleyApplication.class, args);
	}

}
