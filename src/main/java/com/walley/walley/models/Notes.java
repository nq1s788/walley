package com.walley.walley.models;

import jakarta.persistence.*;

@Entity
@Table(name = "notes")
public class Notes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wallId", nullable = false, unique = true)
    private Long id;

    @Column(name = "class")
    private String NoteClass;
    @Column(name = "dataX")
    private int dataX;
    @Column(name = "dataY")
    private int dataY;
    @Column(name = "color")
    private String color = "#F5CBA7";
    @Column(name = "h")
    private boolean IsHeadline = true;
    @Column(name = "t")
    private boolean Istime = true;

    public Notes() {
    }

    public Notes(String noteClass) {
        NoteClass = noteClass;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNoteClass() {
        return NoteClass;
    }

    public void setNoteClass(String noteClass) {
        NoteClass = noteClass;
    }

    public int getDataX() {
        return dataX;
    }

    public void setDataX(int dataX) {
        this.dataX = dataX;
    }

    public int getDataY() {
        return dataY;
    }

    public void setDataY(int dataY) {
        this.dataY = dataY;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isHeadline() {
        return IsHeadline;
    }

    public void setHeadline(boolean headline) {
        IsHeadline = headline;
    }

    public boolean isIstime() {
        return Istime;
    }

    public void setIstime(boolean istime) {
        Istime = istime;
    }
}
