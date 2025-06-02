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
public class FoldersController {
    @Autowired
    private AppService service;
    private final WallsRepository wallsRepository;

    @Autowired
    public FoldersController(WallsRepository wallsRepository) {
        this.wallsRepository = wallsRepository;
    }


    @GetMapping("/folders")
    public String gardenMain(HttpSession session, Model model) {
        MyUser user = (MyUser) session.getAttribute("user");
        UserSetting userSetting = (UserSetting) session.getAttribute("userSetting");
        UserStat userStat = (UserStat) session.getAttribute("userStat");
        UserTimer userTimer = (UserTimer) session.getAttribute("userTimer");
        if (user != null) {
            List<Walls> boards = wallsRepository.findAllByEmail(user.getEmail());
            model.addAttribute("boards", boards);
            model.addAttribute("user", user);
            model.addAttribute("userSetting", userSetting);
            model.addAttribute("userStat", userStat);
            model.addAttribute("userTimer", userTimer);

        }
        return "folders";
    }


    @PostMapping("/folders")
    public String goToNextPages(@RequestParam String action,
                                @RequestParam(required = false) String title,
                                HttpSession session,
                                Model model) {
        if ("garden".equals(action)) {
            return "redirect:/garden";
        } else if ("create".equals(action)) {
            MyUser currUser = (MyUser) session.getAttribute("user");
            String email = currUser.getEmail();
            Walls wall = new Walls(email);
            wall.setTitle(title);
            wall.setUser(currUser);
            wallsRepository.save(wall);
            return "redirect:/folders";
        } else if ("toBoard".equals(action)) {
            MyUser user = (MyUser) session.getAttribute("user");
            List<Walls> boards = wallsRepository.findAllByEmail(user.getEmail());
            Walls foundWall = boards.stream()
                    .filter(wall -> wall.getTitle().equals(title)) // Сравнение с помощью equals
                    .findFirst() // Получаем первый найденный элемент
                    .orElse(null); // Если не найдено, возвращаем null

            if (foundWall != null) {
                Long id = foundWall.getId(); // Получаем идентификатор
                return "redirect:/board/" + id; // Переход на страницу доски
            }
        }
        return "folders";
    }
}
