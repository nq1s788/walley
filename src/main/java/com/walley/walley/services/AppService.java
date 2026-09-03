package com.walley.walley.services;


import com.walley.walley.models.MyUser;
import com.walley.walley.repo.MyUserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

@Service
public class AppService {
    private MyUserRepository repository;

    public AppService(MyUserRepository repository) {
        this.repository = repository;
    }
    //public AppService() {}

    public void addUser(MyUser user) {
        repository.save(user);
    }

    @PostConstruct
    public void init() {
        MyUser user = new MyUser("example@example.com", "securepassword");
        addUser(user);
    }

    public boolean userExists(String email) {
        return repository.findByEmail(email) != null;
    }

    public boolean validateUser(String email, String password) {
        MyUser user = repository.findByEmail(email);
        return user != null && user.getPassword().equals(password);
    }

}
