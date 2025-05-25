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
    //private AppService service;
    private MyUserRepository userRepository;
    //обработка перехода на главную страницу
    @GetMapping("/")
    public String greeting( Model model) {
        model.addAttribute("title", "Walley — Вход");
        return "index";
    }

    @PostMapping("/")
    public String addUser(@RequestParam String email, String password, Model model) {
        MyUser user = new MyUser(email, password);
        if (true) {
            userRepository.save(user);
            return "new user is saved";
        } else {
            return "redirect:/garden";
        }
    }

}