package com.walley.walley.repo;

import com.walley.walley.models.Notes;
import com.walley.walley.models.Threads;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThreadsRepository extends CrudRepository<Threads, Long> {
    @Query(value = "SELECT * FROM threads WHERE wallid = :wallId", nativeQuery = true)
    List<Threads> findThreadsByWallIdNative(@Param("wallId") Long wallId);

    @Query("SELECT MAX(n.id) FROM Threads n")
    Long findMaxId();
}
