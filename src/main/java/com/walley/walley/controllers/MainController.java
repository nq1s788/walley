package com.walley.walley.controllers;

import com.walley.walley.models.MyUser;
import com.walley.walley.models.UserSetting;
import com.walley.walley.models.UserStat;
import com.walley.walley.models.UserTimer;
import com.walley.walley.repo.MyUserRepository;
import com.walley.walley.repo.UserSettingRepository;
import com.walley.walley.repo.UserStatRepository;
import com.walley.walley.repo.UserTimerRepository;
import com.walley.walley.services.AppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpSession;


//Контроллер отслеживает все переходы пользователя между страницами
@Controller
public class MainController {

    @Autowired
    private AppService service;
    private final MyUserRepository userRepository;
    private final UserSettingRepository userSettingRepository;
    private final UserStatRepository userStatRepository;
    private final UserTimerRepository userTimerRepository;

    @Autowired
    public MainController(MyUserRepository userRepository, UserSettingRepository userSettingRepository,
                          UserStatRepository userStatRepository, UserTimerRepository userTimerRepository) {
        this.userRepository = userRepository;
        this.userSettingRepository = userSettingRepository;
        this.userStatRepository = userStatRepository;
        this.userTimerRepository = userTimerRepository;
    }
    //обработка перехода на главную страницу

    @GetMapping("/")
    public String greeting( Model model) {
        //model.addAttribute("title", "проверка гетмэппинга");
        return "index";
    }

    @PostMapping("/") // Используйте один адрес для обработки
    public String handleSubmit(@RequestParam String action,
                               @RequestParam String email,
                               @RequestParam String password,
                               HttpSession session,
                               Model model) {
        if ("register".equals(action)) {
            if (service.userExists(email)) {
                model.addAttribute("error", "Пользователь уже существует");
                return "index"; // Вернуться на страницу с ошибкой
            }
            MyUser user = new MyUser(email, password);
            UserSetting userSetting = new UserSetting(email);
            UserStat userStat = new UserStat(email);
            UserTimer userTimer = new UserTimer(email);
            userRepository.save(user);
            userSettingRepository.save(userSetting);
            userStatRepository.save(userStat);
            userTimerRepository.save(userTimer);
            session.setAttribute("user", user);
            session.setAttribute("userSetting", userSetting);
            session.setAttribute("userStat", userStat);
            session.setAttribute("userTimer", userTimer);

            return "redirect:/garden"; // Перенаправление после успешной регистрации
        } else if ("login".equals(action)) {
            if (!service.validateUser(email, password)) {
                model.addAttribute("error", "Неверный логин или пароль");
                return "index"; // Вернуться на страницу с ошибкой
            }
            session.setAttribute("user", userRepository.findByEmail(email));
            session.setAttribute("userSetting", userSettingRepository.findByEmail(email));
            session.setAttribute("userStat", userStatRepository.findByEmail(email));
            session.setAttribute("userTimer", userTimerRepository.findByEmail(email));
            return "redirect:/garden"; // Перенаправление на страницу после входа
        }
        return "index"; // На всякий случай
    }
}