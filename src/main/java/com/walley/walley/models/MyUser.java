package com.walley.walley.models;

import javax.persistence.*;


//Класс создаёт табличку с пользователями..

@Entity
@Table(name = "users")
public class MyUser {
    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String login;

    @Column(name = "password", nullable = false)
    private String password;

    public MyUser(String login, String password) {
        this.login = login;
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

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }
}
