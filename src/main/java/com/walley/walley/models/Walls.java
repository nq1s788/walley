package com.walley.walley.models;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "walls")
public class Walls {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wallID", nullable = false, unique = true)
    private Long id;

    @Column(name = "email")
    private String email;

    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email", insertable = false, updatable = false)
    private MyUser user;

    @Column(name = "title")
    private String title;
    @Column(name = "createdAt")
    private java.sql.Timestamp createdAt;
    @Column(name = "background")
    private String background = "#4F4242";
    @Column(name = "font")
    private String font ="Montserrat";
    @Column(name = "inPackage")
    private boolean inPackage = false;

    public Walls() {
        Date currentDate = new Date();
        createdAt = new Timestamp(currentDate.getTime());
    }

    public Walls(String email) {
        this.email = email;
        Date currentDate = new Date();
        createdAt = new Timestamp(currentDate.getTime());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public MyUser getUser() {
        return user;
    }

    public void setUser(MyUser user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public String getBackground() {
        return background;
    }

    public void setBackground(String background) {
        this.background = background;
    }

    public String getFont() {
        return font;
    }

    public void setFont(String font) {
        this.font = font;
    }

    public boolean isInPackage() {
        return inPackage;
    }

    public void setInPackage(boolean inPackage) {
        this.inPackage = inPackage;
    }
}
