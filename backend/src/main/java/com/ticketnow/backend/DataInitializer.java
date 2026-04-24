package com.ticketnow.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        // Seed admin user if not already present
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User("admin", "admin@ticketnow.com", "admin123", "ADMIN");
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin / admin123");
        }
    }
}
