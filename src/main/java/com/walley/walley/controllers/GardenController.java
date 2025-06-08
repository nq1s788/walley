package com.walley.walley.controllers;

import com.walley.walley.models.*;
import com.walley.walley.repo.MyUserRepository;
import com.walley.walley.repo.UserSettingRepository;
import com.walley.walley.repo.UserStatRepository;
import com.walley.walley.repo.UserTimerRepository;
import com.walley.walley.services.AppService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class GardenController {
    @Autowired
    private AppService service;
    private final MyUserRepository userRepository;
    private final UserSettingRepository userSettingRepository;
    private final UserStatRepository userStatRepository;
    private final UserTimerRepository userTimerRepository;

    @Autowired
    public GardenController(MyUserRepository userRepository, UserSettingRepository userSettingRepository,
                          UserStatRepository userStatRepository, UserTimerRepository userTimerRepository) {
        this.userRepository = userRepository;
        this.userSettingRepository = userSettingRepository;
        this.userStatRepository = userStatRepository;
        this.userTimerRepository = userTimerRepository;
    }


    @GetMapping("/garden")
    public String gardenMain(HttpSession session, Model model) {
        if (session.getAttribute("user") == null) {
            return "redirect:/";
        }
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
        return "garden";
    }
    @PostMapping("/garden")
    public String goToNextPages(@RequestParam String action,
                                HttpSession session,
                                Model model) {
        if ("settings".equals(action)) {
            return "redirect:/settings";
        }
        if ("folders".equals(action)) {
            return "redirect:/folders";
        }
        return "garden";

    }
}