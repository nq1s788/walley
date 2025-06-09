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
import org.springframework.web.bind.annotation.RequestParam;

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
            Optional<Walls> optionalWall = wallsRepository.findById(id);
            if (optionalWall.isPresent()) {
                Walls wall = optionalWall.get();
                List<Notes> notes = notesRepository.findAllByWallId(wall.getId());
                List<Threads> threads = threadsRepository.findAllByWallId(wall.getId());
                Long lastWallId = notesRepository.findMaxId();
                Long lastThreadId = threadsRepository.findMaxId();
                System.out.println(wall);
                model.addAttribute("wall", wall);
                model.addAttribute("notes", notes);
                model.addAttribute("threads", threads);
                model.addAttribute("lastId", lastWallId);
                model.addAttribute("lastThreadId", lastThreadId);

                model.addAttribute("user", user);
            }
        }
        return "board";
    }
    @PostMapping("/board/{id}")
    public String boardMain(@PathVariable Long id, HttpSession session, Model model,
                            @RequestParam(required = false) String action,
                            @RequestParam(required = false) Walls wall,
                            @RequestParam(required = false) List<Notes> notes,
                            @RequestParam(required = false) List<Threads> threads) {
        if ("garden".equals(action)) {
            return "redirect:/garden";
        } if ("folders".equals(action)) {
            return "redirect:/folders";
        }
        if ("update".equals(action)) {
            System.out.println("дошли до обновления");
            System.out.println(wall.getTitle());
            MyUser user = (MyUser) session.getAttribute("user");
            Walls old_wall = (Walls) session.getAttribute("wall");
            old_wall.setTitle(wall.getTitle());
            old_wall.setBackground(wall.getBackground());
            old_wall.setFont(wall.getFont());
            wallsRepository.save(old_wall);

            List<Notes> old_notes = (List<Notes>) session.getAttribute("notes");
            for (Notes old_note : old_notes) {
                Boolean is_deleted = true;
                for (Notes new_note : notes) {
                    if (old_note.getId().equals(new_note.getId())) {
                        is_deleted = false;
                        old_note.setColor(new_note.getColor());
                        old_note.setContent(new_note.getContent());
                        old_note.setDataX(new_note.getDataX());
                        old_note.setDataY(new_note.getDataY());
                        old_note.setIstime(new_note.isIstime());
                        old_note.setHeadline(new_note.isHeadline());
                        notesRepository.save(old_note);
                    }
                }
                if (is_deleted) {
                    notesRepository.deleteById(old_note.getId());
                }
            }
            for (Notes new_note : notes) {
                Boolean is_new = true;
                for (Notes old_note : old_notes) {
                    if (new_note.getId().equals(old_note.getId())) {
                        is_new = false;
                    }
                }
                if (is_new) {
                    notesRepository.save(new_note);
                }
            }

            List<Threads> old_threads = (List<Threads>) session.getAttribute("threads");
            for (Threads old_thread : old_threads) {
                Boolean is_deleted = true;
                for (Threads new_thread : threads) {
                    if (old_thread.getId().equals(new_thread.getId())) {
                        is_deleted = false;
                    }
                }
                if (is_deleted) {
                    threadsRepository.deleteById(old_thread.getId());
                }
            }
            for (Threads new_thread : threads) {
                Boolean is_new = true;
                for (Threads old_thread : old_threads) {
                    if (new_thread.getId().equals(old_thread.getId())) {
                        is_new = false;
                    }
                }
                if (is_new) {
                    threadsRepository.save(new_thread);
                }
            }
        }
        return "board";
    }





}
