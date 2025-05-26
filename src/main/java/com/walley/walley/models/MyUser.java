package com.walley.walley.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.Column;
import jakarta.persistence.Id;

@Entity
@Table(name = "users")
public class MyUser {
    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

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
}