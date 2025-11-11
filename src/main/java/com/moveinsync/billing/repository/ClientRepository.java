package com.moveinsync.billing.repository;

import com.moveinsync.billing.model.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByClientCode(String clientCode);
    Optional<Client> findByEmail(String email);
    boolean existsByClientCode(String clientCode);
}
