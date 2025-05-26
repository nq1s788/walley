package com.walley.walley.repo;

import com.walley.walley.models.MyUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MyUserRepository extends JpaRepository<MyUser, String>{
    MyUser findByEmail(String email);
}
