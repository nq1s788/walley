package com.walley.walley.models;

import java.util.List;

public class BoardRequest {
    private String action;
    private Walls wall; // Может быть null
    private List<Notes> notes; // Может быть null
    private List<Threads> threads; // Может быть null

    // Геттеры и сеттеры
    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Walls getWall() {
        return wall;
    }

    public void setWall(Walls wall) {
        this.wall = wall;
    }

    public List<Notes> getNotes() {
        return notes;
    }

    public void setNotes(List<Notes> notes) {
        this.notes = notes;
    }

    public List<Threads> getThreads() {
        return threads;
    }

    public void setThreads(List<Threads> threads) {
        this.threads = threads;
    }
}