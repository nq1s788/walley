package com.walley.walley.controllers;

import com.walley.walley.models.Walls;
import com.walley.walley.repo.WallsRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

@Controller
public class BoardController {
    private final WallsRepository wallsRepository;

    @Autowired
    public BoardController(WallsRepository wallsRepository) {
        this.wallsRepository = wallsRepository;
    }
    @PostMapping("/board/{id}")
    public String boardMain(@PathVariable Long id, HttpSession session, Model model) {
        return "board";
    }

    @GetMapping("/board/{id}")
    public String getBoard(@PathVariable Long id, Model model) {
        return "board";
    }

}
