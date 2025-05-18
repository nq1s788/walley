package com.walley.walley.repo;

import com.walley.walley.models.MyUser;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface MyUserRepository extends CrudRepository<MyUser, Long>{
    Optional <MyUser> findByName(String username);
}
