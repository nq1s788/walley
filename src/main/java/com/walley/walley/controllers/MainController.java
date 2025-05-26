package com.walley.walley.controllers;

import com.walley.walley.models.MyUser;
import com.walley.walley.models.UserSetting;
import com.walley.walley.models.UserStat;
import com.walley.walley.models.UserTimer;
import com.walley.walley.repo.MyUserRepository;
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

    @Autowired
    public MainController(MyUserRepository userRepository) {
        this.userRepository = userRepository;
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
            //сохраняем всех по репозиториям
            userRepository.save(user);
            session.setAttribute("user", user);
            session.setAttribute("user", userSetting);
            session.setAttribute("user", userStat);
            session.setAttribute("user", userTimer);

            return "garden"; // Перенаправление после успешной регистрации
        } else if ("login".equals(action)) {
            if (!service.validateUser(email, password)) {
                model.addAttribute("error", "Неверный логин или пароль");
                return "index"; // Вернуться на страницу с ошибкой
            }
            session.setAttribute("user", userRepository.findByEmail(email));
            return "garden"; // Перенаправление на страницу после входа
        }
        return "index"; // На всякий случай
    }
    /* старый постмэппинг
    @PostMapping("/")
    public String addUser(@RequestParam String email, @RequestParam String password, Model model) {
        MyUser user = new MyUser(email, password);
        if (service.userExists(email)) {
            if (!service.validateUser(email, password)) {
                model.addAttribute("error", "Неверный логин или пароль");
                return "index"; // Return to the login page with an error
            }
            return "redirect:/garden";

        } else {
            userRepository.save(user);
            return "new user is saved";
        }
    }
*/
    /*@GetMapping("/meow")
    public String getUser(MyUser user) {
        return "meow";
    }*/



}