package com.walley.walley.controllers;

import com.walley.walley.models.*;
import com.walley.walley.repo.*;
import com.walley.walley.services.AppService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class SettingController {
    @Autowired
    private AppService service;
    private final UserSettingRepository userSettingRepository;

    @Autowired
    public SettingController(UserSettingRepository userSettingRepository) {
        this.userSettingRepository = userSettingRepository;
    }


    @GetMapping("/settings")
    public String setting(HttpSession session, Model model) {
        MyUser user = (MyUser) session.getAttribute("user");
        UserSetting userSetting = (UserSetting) session.getAttribute("userSetting");
        UserStat userStat = (UserStat) session.getAttribute("userStat");
        UserTimer userTimer = (UserTimer) session.getAttribute("userTimer");
        if (user != null) {
            model.addAttribute("user", user);
            model.addAttribute("userSetting", userSetting);
            model.addAttribute("userStat", userStat);
            model.addAttribute("userTimer", userTimer);
        }
        return "settings";
    }


    @PostMapping("/settings")
    public String goToNextPages(@RequestParam String action,
                                HttpSession session,
                                Model model) {
        return "settings";
    }
}
