package com.moveinsync.billing.service;

import com.moveinsync.billing.dto.ClientDTO;
import com.moveinsync.billing.exception.ResourceNotFoundException;
import com.moveinsync.billing.model.entity.Client;
import com.moveinsync.billing.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService {

    private final ClientRepository clientRepository;

    @Transactional
    @CacheEvict(value = "clients", allEntries = true)
    public ClientDTO createClient(ClientDTO dto) {
        log.info("Creating client: {}", dto.getClientCode());

        Client client = Client.builder()
                .clientCode(dto.getClientCode())
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .active(true)
                .build();

        Client saved = clientRepository.save(client);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "clients", key = "#id")
    public ClientDTO getClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + id));
        return mapToDTO(client);
    }

    @Transactional(readOnly = true)
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "clients", key = "#id")
    public ClientDTO updateClient(Long id, ClientDTO dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + id));

        client.setName(dto.getName());
        client.setEmail(dto.getEmail());
        client.setPhone(dto.getPhone());
        client.setAddress(dto.getAddress());

        Client updated = clientRepository.save(client);
        return mapToDTO(updated);
    }

    private ClientDTO mapToDTO(Client client) {
        return ClientDTO.builder()
                .id(client.getId())
                .clientCode(client.getClientCode())
                .name(client.getName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .address(client.getAddress())
                .active(client.getActive())
                .build();
    }
}
