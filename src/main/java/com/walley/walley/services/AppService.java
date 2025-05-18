package com.walley.walley.services;


import com.walley.walley.models.MyUser;
import com.walley.walley.repo.MyUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AppService {
    private MyUserRepository repository;

    public void addUser(MyUser user) {
        repository.save(user);
    }
}
