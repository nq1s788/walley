package com.walley.walley.controllers;

import com.walley.walley.models.MyUser;
import com.walley.walley.repo.MyUserRepository;
import com.walley.walley.services.AppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

//Контроллер отслеживает все переходы пользователя между страницами
@Controller
public class MainController {

    @Autowired
    private AppService service;
    private MyUserRepository userRepository;
    //обработка перехода на главную страницу
    /*
    @GetMapping("/")
    public String greeting( Model model) {
        model.addAttribute("title", "Walley — Вход");
        return "index";
    }
     */
    @PostMapping("/") // Используйте один адрес для обработки
    public String handleSubmit(@RequestParam String action,
                               @RequestParam String email,
                               @RequestParam String password,
                               Model model) {
        if ("register".equals(action)) {
            if (service.userExists(email)) {
                model.addAttribute("error", "Пользователь уже существует");
                return "index"; // Вернуться на страницу с ошибкой
            }
            MyUser user = new MyUser(email, password);
            userRepository.save(user);
            return "redirect:/"; // Перенаправление после успешной регистрации
        } else if ("login".equals(action)) {
            if (!service.validateUser(email, password)) {
                model.addAttribute("error", "Неверный логин или пароль");
                return "index"; // Вернуться на страницу с ошибкой
            }
            return "redirect:/garden"; // Перенаправление на страницу после входа
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