package com.walley.walley.models;

import jakarta.persistence.*;

import java.time.Duration;

@Entity
@Table(name = "user_setting")
public class UserSetting {
    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @OneToOne
    @MapsId
    @JoinColumn(name = "email")
    private MyUser user;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "avatarURL", nullable = false)
    private String avatarUrl = "src/main/resources/static/pic/user1.jpg";

    @Column(name = "workDuration", nullable = false)
    private Duration workDuration = Duration.ofSeconds(20 * 60);

    @Column(name = "breakDuration", nullable = false)
    private Duration breakDuration = Duration.ofSeconds(5 * 60);

    ///@Version
    ///private Long version;

    public UserSetting() {
    }

    public void setUser(MyUser user) {
        this.user = user;
    }

    public UserSetting(MyUser user) {
        this.username = user.getEmail(); // Предполагается, что username равен email
        this.user = user;
        this.email = user.getEmail();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Duration getWorkDuration() {
        return workDuration;
    }

    public void setWorkDuration(Duration workDuration) {
        this.workDuration = workDuration;
    }

    public Duration getBreakDuration() {
        return breakDuration;
    }

    public void setBreakDuration(Duration breakDuration) {
        this.breakDuration = breakDuration;
    }
}