package com.walley.walley.controllers;

import com.walley.walley.models.Walls;
import com.walley.walley.repo.WallsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@Controller
public class BoardController {
    private final WallsRepository wallsRepository;

    @Autowired
    public BoardController(WallsRepository wallsRepository) {
        this.wallsRepository = wallsRepository;
    }

    // Метод для отображения страницы доски по ID
    @GetMapping("/board")
    public String getBoardById(@PathVariable Long id, Model model) {
        Optional<Walls> wall = wallsRepository.findById(id);

        model.addAttribute("wall", wall); // Передаем данные о доске в модель
        return "board"; // Возвращаем имя шаблона
    }

}
