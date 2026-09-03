package com.walley.walley;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.walley.walley.models")
@EnableJpaRepositories("com.walley.walley.repo")
public class WalleyApplication {

	public static void main(String[] args) {
		///пожалуйста
		SpringApplication.run(WalleyApplication.class, args);
	}
}