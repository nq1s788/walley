package com.walley.walley.models;

import jakarta.persistence.*;

@Entity
@Table(name = "threads")
public class Threads {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "threadID", nullable = false, unique = true)
    private Long id;

    @Column(name = "wallID")
    private Long wallId;

    @ManyToOne
    @JoinColumn(name = "wallID", referencedColumnName = "wallID", insertable = false, updatable = false)
    private Walls wall;

    @Column(name = "noteID1")
    private int noteId1;
    @Column(name = "noteID2")
    private int noteId2;

    public Threads() {
    }

    public Threads(Walls wall) {
        this.wall = wall;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Walls getWall() {
        return wall;
    }

    public void setWall(Walls wall) {
        this.wall = wall;
    }

    public int getNoteId1() {
        return noteId1;
    }

    public void setNoteId1(int noteId1) {
        this.noteId1 = noteId1;
    }

    public int getNoteId2() {
        return noteId2;
    }

    public void setNoteId2(int noteId2) {
        this.noteId2 = noteId2;
    }
}

