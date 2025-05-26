package com.walley.walley.controllers;

import com.walley.walley.repo.MyUserRepository;
import com.walley.walley.services.AppService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class FoldersController {
    @Autowired
    private AppService service;
    @Autowired
    private final MyUserRepository userRepository;

    public FoldersController(MyUserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @GetMapping("/folders")
    public String gardenMain(HttpSession session, Model model) {
        return "folders";
    }

    @PostMapping("/folders")
    public String goToNextPages(@RequestParam String action,
                                HttpSession session,
                                Model model) {
        if ("garden".equals(action)) {
            return "garden";
        }
        return "folders";
    }
}
