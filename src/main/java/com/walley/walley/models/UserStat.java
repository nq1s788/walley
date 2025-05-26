package com.walley.walley.models;

import javax.persistence.*;

@Entity
@Table(name = "user_stat")
public class UserStat {
    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @OneToOne
    @MapsId
    @JoinColumn(name = "email")

    @Column(name = "totalWorkMinutes", nullable = false)
    private long totalWorkMinutes = 0;
    @Column(name = "totalBreakMinutes", nullable = false)
    private long totalBreakMinutes = 0;

    public UserStat(String email) {
        this.email = email;
    }

    public UserStat() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getTotalWorkMinutes() {
        return totalWorkMinutes;
    }

    public void setTotalWorkMinutes(long totalWorkMinutes) {
        this.totalWorkMinutes = totalWorkMinutes;
    }

    public long getTotalBreakMinutes() {
        return totalBreakMinutes;
    }

    public void setTotalBreakMinutes(long totalBreakMinutes) {
        this.totalBreakMinutes = totalBreakMinutes;
    }
}
