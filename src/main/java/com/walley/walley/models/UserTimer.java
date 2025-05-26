package com.walley.walley.models;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "user_timer")
public class UserTimer {
    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @OneToOne
    @MapsId
    @JoinColumn(name = "email")
    private MyUser user;

    @Column(name = "isRunning")
    private boolean isRunnig = false;
    @Column(name = "isWork")
    private boolean isWork = false;
    @Column(name = "timerStart")
    private java.sql.Timestamp timeStart;

    public UserTimer(String email) {
        this.email = email;
        Date currentDate = new Date();
        timeStart = new Timestamp(currentDate.getTime());
    }

    public UserTimer() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isRunnig() {
        return isRunnig;
    }

    public void setRunnig(boolean runnig) {
        isRunnig = runnig;
    }

    public boolean isWork() {
        return isWork;
    }

    public void setWork(boolean work) {
        isWork = work;
    }

    public Timestamp getTimeStart() {
        return timeStart;
    }

    public void setTimeStart(Timestamp timeStart) {
        this.timeStart = timeStart;
    }
}
