package com.example.ecommerce.service;

import com.example.ecommerce.domain.AppUser;
import com.example.ecommerce.domain.Role;
import com.example.ecommerce.exception.BusinessException;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class UserService {
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AppUser register(String name, String email, String password) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BusinessException("Email is already registered");
        }
        AppUser user = new AppUser();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(Set.of(Role.CUSTOMER));
        return userRepository.save(user);
    }

    @Transactional
    public AppUser createAdmin(String name, String email, String password) {
        AppUser user = register(name, email, password);
        user.setRoles(Set.of(Role.ADMIN, Role.CUSTOMER));
        return user;
    }

    @Transactional(readOnly = true)
    public AppUser byEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<AppUser> allUsers() {
        return userRepository.findAll();
    }
}
