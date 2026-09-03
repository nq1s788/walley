package com.walley.walley.repo;

import com.walley.walley.models.Notes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotesRepository extends CrudRepository<Notes, Long> {
    @Query(value = "SELECT * FROM notes WHERE wallid = :wallId", nativeQuery = true)
    List<Notes> findNotesByWallIdNative(@Param("wallId") Long wallId);

    @Query("SELECT MAX(n.id) FROM Notes n")
    Long findMaxId();
}
