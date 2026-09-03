package com.walley.walley.repo;

import com.walley.walley.models.UserStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStatRepository extends CrudRepository<UserStat, String> {
    UserStat findByEmail(String email);
}
