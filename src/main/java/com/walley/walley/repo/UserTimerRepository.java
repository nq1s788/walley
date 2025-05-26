package com.walley.walley.repo;

import com.walley.walley.models.UserTimer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserTimerRepository extends CrudRepository<UserTimer, String> {
    UserTimer findByEmail(String email);
}
