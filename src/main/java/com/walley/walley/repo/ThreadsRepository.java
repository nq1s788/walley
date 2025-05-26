package com.walley.walley.repo;

import com.walley.walley.models.Threads;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ThreadsRepository extends CrudRepository<Threads, Long> {}
