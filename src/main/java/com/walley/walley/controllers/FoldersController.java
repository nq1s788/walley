package com.walley.walley.controllers;

import com.walley.walley.models.*;
import com.walley.walley.repo.*;
import com.walley.walley.services.AppService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Controller
public class FoldersController {
    @Autowired
    private AppService service;
    @Autowired
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
    public ResponseEntity<?> goToNextPages(@RequestParam(required = false) String action,
                                           @RequestParam(required = false) Long wallid,
                                           @RequestParam(required = false) String title,
                                           HttpSession session) {
        MyUser currUser = (MyUser) session.getAttribute("user");
        if ("garden".equals(action)) {
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/garden")).build();
        }

        if ("create".equals(action)) {
            Walls wall = new Walls(currUser);
            wall.setTitle(title);
            wallsRepository.save(wall);

            // Получаем обновленный список досок
            List<Walls> boards = wallsRepository.findAllByEmail(currUser.getEmail());

            // Возвращаем список досок
            return ResponseEntity.ok(boards);
        }

        if ("toBoard".equals(action)) {
            if (wallid != null) {
                return ResponseEntity.ok(wallid);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Доска не найдена");
            }
        }

        if ("delete".equals(action)) {
            System.out.println("добрались до делита");
            if (wallid != null) {
                wallsRepository.deleteById(wallid);
                List<Walls> boards = wallsRepository.findAllByEmail(currUser.getEmail());
                return ResponseEntity.ok(boards);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Доска не найдена");
            }
        }

        if ("rename".equals(action)) {
            if (wallid != null) {
                Optional<Walls> optionalBoard = wallsRepository.findById(wallid);
                if (optionalBoard.isPresent()) {
                    Walls board = optionalBoard.get();
                    board.setTitle(title);
                    wallsRepository.save(board);
                    List<Walls> boards = wallsRepository.findAllByEmail(currUser.getEmail());
                    return ResponseEntity.ok(boards);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Доска не найдена");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Доска не найдена");
            }
        }

        return ResponseEntity.badRequest().body("Неверный запрос");
    }


    /* @PostMapping("/folders")
    public String goToNextPages(@RequestParam String action,
                                @RequestParam(required = false) String title,
                                HttpSession session,
                                Model model) {
        if ("garden".equals(action)) {
            return "redirect:/garden";
        }
        if ("create".equals(action)) {
            MyUser currUser = (MyUser) session.getAttribute("user");
            String email = currUser.getEmail();
            Walls wall = new Walls(email);
            wall.setTitle(title);
            wall.setUser(currUser);
            wallsRepository.save(wall);
            System.out.println(title);
            List<Walls> boards = wallsRepository.findAllByEmail(currUser.getEmail());
            model.addAttribute("boards", boards);
            session.setAttribute("boards", boards);
            return "folders";

        }
        if ("toBoard".equals(action)) {
            System.out.println("дошли до toboard в контроллере");
            MyUser user = (MyUser) session.getAttribute("user");
            List<Walls> boards = wallsRepository.findAllByEmail(user.getEmail());
            Walls foundWall = boards.stream()
                    .filter(wall -> wall.getTitle().equals(title))
                    .findFirst()
                    .orElse(null);

            if (foundWall != null) {
                Long id = foundWall.getId();
                model.addAttribute("id", id);// Получаем идентификатор
                return "redirect:/board/" + id; // Переход на страницу доски
            } else {
                System.out.println("Доска не найдена с заголовком: " + title);
                return "redirect:/folders"; // Или возвращаем на folders, если доска не найдена
            }
        }
        return "folders";
    }
     */
}
