package com.walley.walley.controllers;

import com.walley.walley.repo.MyUserRepository;
import com.walley.walley.services.AppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class GardenController {
    @Autowired
    private AppService service;
    private final MyUserRepository userRepository;

    public GardenController(MyUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/garden")
    public String gardenMain(Model model) {
        return "garden";
    }
    @PostMapping("/garden")
    public String goToNextPages(@RequestParam String action,
                             Model model) {
        if ("settings".equals(action)) {
            return "settings";
        }
        if ("folders".equals(action)) {
            return "folders";
        }
        return "garden";

    }
}

