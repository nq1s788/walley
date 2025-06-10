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
import org.springframework.web.bind.annotation.*;

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
                System.out.println(wall.getId());
                List<Notes> notes = notesRepository.findNotesByWallIdNative(wall.getId());
                List<Threads> threads = threadsRepository.findThreadsByWallIdNative(wall.getId());
                Long lastWallId = notesRepository.findMaxId();
                Long lastThreadId = threadsRepository.findMaxId();
                System.out.println(threads.size());
                model.addAttribute("wall", wall);
                model.addAttribute("notes", notes);
                model.addAttribute("threads", threads);
                model.addAttribute("lastId", lastWallId);
                model.addAttribute("lastThreadId", lastThreadId);

                session.setAttribute("wall", wall);
                session.setAttribute("notes", notes);
                session.setAttribute("threads", threads);
                session.setAttribute("lastId", lastWallId);
                session.setAttribute("lastThreadId", lastThreadId);

                model.addAttribute("user", user);
            }
        }
        return "board";
    }
    @PostMapping("/board/{id}")
    public String boardMain(@PathVariable Long id, HttpSession session, Model model,
                            @RequestBody(required = false) BoardRequest request){
        String action = request.getAction();
        Walls wall = request.getWall();
        List<Notes> notes = request.getNotes();
        List<Threads> threads = request.getThreads();

        System.out.println("Received action: " + action);
        /*if ("garden".equals(actionBack)) {
            return "redirect:/garden";
        } if ("folders".equals(actionBack)) {
            return "redirect:/folders";
        }*/
        if ("update".equals(action)) {
            System.out.println("дошли до обновления");
            MyUser user = (MyUser) session.getAttribute("user");

            Walls wallOptional = (Walls) session.getAttribute("wall");
            System.out.println(wallOptional.getId());
            Optional<Walls> old_wall = wallsRepository.findById(wallOptional.getId());
            if (old_wall.isPresent()) {
                old_wall.get().setTitle(wall.getTitle());
                old_wall.get().setBackground(wall.getBackground());
                old_wall.get().setFont(wall.getFont());
                wallsRepository.save(old_wall.get());
                System.out.println("сохранили доску");
            }


            List<Notes> old_notes = notesRepository.findNotesByWallIdNative(old_wall.get().getId());
            if (old_notes.isEmpty()) {
                System.out.println("нет старых заметок");
            }
            for (Notes old_note : old_notes) {
                Boolean is_deleted = true;
                for (Notes new_note : notes) {
                    if (old_note.getId().equals(new_note.getId())) {
                        System.out.println("пытаемся заменить заметку");
                        is_deleted = false;
                        old_note.setColor(new_note.getColor());
                        old_note.setContent(new_note.getContent());
                        old_note.setDataX(new_note.getDataX());
                        old_note.setDataY(new_note.getDataY());
                        old_note.setIstime(new_note.isIstime());
                        old_note.setHeadline(new_note.isHeadline());
                        notesRepository.save(old_note);
                        System.out.println("заменили заметку");
                    }
                }
                if (is_deleted) {
                    System.out.println("пытаемся удалить заметку");
                    notesRepository.deleteById(old_note.getId());
                    System.out.println("удалили заметку");
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
                    System.out.println("пытаемся добавить заметку");
                    System.out.println(new_note.getId());
                    System.out.println(new_note.getNoteClass());
                    System.out.println(new_note.getContent());
                    System.out.println(new_note.getColor());
                    System.out.println(new_note.getDataX());
                    System.out.println(new_note.getDataY());
                    if (!notesRepository.existsById(new_note.getId())) {
                        new_note.setVersion(null);
                        new_note.setWall(old_wall.get());
                        System.out.println("ща положит");
                        notesRepository.save(new_note);
                    }
                    System.out.println("добавили заметку");
                }
            }

            List<Threads> old_threads = threadsRepository.findThreadsByWallIdNative(old_wall.get().getId());
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
                    if (!threadsRepository.existsById(new_thread.getId())) {
                        new_thread.setVersion(null);
                        new_thread.setWall(old_wall.get());
                        threadsRepository.save(new_thread);
                    }
                }
            }
        }
        return "board";
    }

}
