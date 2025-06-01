package com.walley.walley.models;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class MyUser {
    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserSetting userSetting;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserStat userStat;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserTimer userTimer;

    public MyUser(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public MyUser() {
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUserSetting(UserSetting userSetting) {
        this.userSetting = userSetting;
    }

    public void setUserStat(UserStat userStat) {
        this.userStat = userStat;
    }

    public void setUserTimer(UserTimer userTimer) {
        this.userTimer = userTimer;
    }

    public UserSetting getUserSetting() {
        return userSetting;
    }

    public UserStat getUserStat() {
        return userStat;
    }

    public UserTimer getUserTimer() {
        return userTimer;
    }
}