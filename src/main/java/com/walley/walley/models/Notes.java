package com.walley.walley.models;

import javax.persistence.*;

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
    private String color;
    @Column(name = "h")
    private String Headline;
}
