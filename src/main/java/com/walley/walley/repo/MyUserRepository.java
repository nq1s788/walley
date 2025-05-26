package com.walley.walley.repo;

import com.walley.walley.models.MyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface MyUserRepository extends CrudRepository<MyUser, String> {
    MyUser findByEmail(String email);
}
