package com.walley.walley.controllers;

import com.walley.walley.models.*;
import com.walley.walley.repo.NotesRepository;
import com.walley.walley.repo.ThreadsRepository;
import com.walley.walley.repo.WallsRepository;
import com.walley.walley.services.AppService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Optional;

@Controller
public class BoardController {
    @Autowired
    private AppService service;
    @Autowired
    private final WallsRepository wallsRepository;
    private final NotesRepository notesRepository;
    private final ThreadsRepository threadsRepository;

    @Autowired
    public BoardController(WallsRepository wallsRepository, NotesRepository notesRepository, ThreadsRepository threadsRepository) {
        this.wallsRepository = wallsRepository;
        this.notesRepository = notesRepository;
        this.threadsRepository = threadsRepository;
    }
    @GetMapping("/board/{id}")
    public String getBoard(@PathVariable Long id, HttpSession session, Model model) {
        MyUser user = (MyUser) session.getAttribute("user");
        if (user != null) {
            Walls wall = wallsRepository.findByWallId(id);
            List<Notes> notes = notesRepository.findAllByWallId(wall.getId());
            List<Threads> threads = threadsRepository.findAllByWallId(wall.getId());
            System.out.println(wall);
            model.addAttribute("wall", wall);
            model.addAttribute("notes", notes);
            model.addAttribute("threads", threads);
            model.addAttribute("user", user);
        }
        return "board/{id}";
    }
    @PostMapping("/board/{id}")
    public String boardMain(@PathVariable Long id, HttpSession session, Model model) {
        return "board/{id}";
    }



}
