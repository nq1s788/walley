package com.walley.walley.repo;

import com.walley.walley.models.Walls;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface WallsRepository extends CrudRepository<Walls, Long> {
    List<Walls> findAllByEmail(String email);
}