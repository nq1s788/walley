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

import java.time.Duration;
import java.util.List;

@Controller
public class SettingController {
    @Autowired
    private AppService service;
    private final MyUserRepository userRepository;
    private final UserSettingRepository userSettingRepository;
    private final UserStatRepository userStatRepository;

    @Autowired
    public SettingController(MyUserRepository userRepository,
                             UserSettingRepository userSettingRepository,
                             UserStatRepository userStatRepository) {
        this.userRepository = userRepository;
        this.userSettingRepository = userSettingRepository;
        this.userStatRepository = userStatRepository;
    }


    @GetMapping("/settings")
    public String setting(HttpSession session, Model model) {
        MyUser user = (MyUser) session.getAttribute("user");
        UserSetting setting = (UserSetting) session.getAttribute("userSetting");
        System.out.println(setting.getUsername());
        UserStat stat = (UserStat) session.getAttribute("userStat");
        UserTimer timer = (UserTimer) session.getAttribute("userTimer");
        if (user != null) {
            model.addAttribute("user", user);
            model.addAttribute("userSetting", setting);
            model.addAttribute("userStat", stat);
            model.addAttribute("userTimer", timer);
        }
        return "settings";
    }


    @PostMapping("/settings")
    public String megaActions(@RequestParam String action,
                              @RequestParam(required = false) String username,
                              @RequestParam(required = false) String password,
                              @RequestParam(required = false) Integer workInput,
                              @RequestParam(required = false) Integer restInput,
                                HttpSession session,
                                Model model) {
        MyUser user = (MyUser) session.getAttribute("user");
        UserSetting setting = (UserSetting) session.getAttribute("userSetting");
        UserStat stat = (UserStat) session.getAttribute("userStat");
        if ("garden".equals(action)) {
            return "redirect:/garden";
        } else if ("save".equals(action)) {
            if (password != null) {
                if(!password.isBlank()) {
                    user.setPassword(password);
                }
            }
            if (workInput != null && restInput != null) {
                setting.setWorkDuration(Duration.ofMinutes(workInput));
                setting.setBreakDuration(Duration.ofMinutes(restInput));
            }
            if (username != null && !username.isBlank()) {
                setting.setUsername(username);
            }
            userRepository.save(user);
            session.setAttribute("user", user);
            session.setAttribute("userSetting", setting);
            model.addAttribute("message", "Настройки сохранены.");
        } else if ("reset".equals(action)) {
            stat.setTotalBreakMinutes(0);
            stat.setTotalWorkMinutes(0);
            userRepository.save(user);
            session.setAttribute("user", user);
            session.setAttribute("userStat", stat);
            model.addAttribute("message", "Прогресс сброшен.");
        }
        return "settings";
    }
}
