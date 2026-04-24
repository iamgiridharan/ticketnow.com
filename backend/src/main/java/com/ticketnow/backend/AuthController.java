package com.ticketnow.backend;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Username is required", null, null, null));
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Password is required", null, null, null));
        }

        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(401)
                    .body(new AuthResponse(false, "Invalid username or password", null, null, null));
        }

        User user = userOpt.get();
        return ResponseEntity.ok(
                new AuthResponse(true, "Login successful", user.getUsername(), user.getEmail(), user.getRole()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Username is required", null, null, null));
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Email is required", null, null, null));
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Password must be at least 6 characters", null, null, null));
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Username already taken", null, null, null));
        }

        User user = new User(request.getUsername(), request.getEmail(), request.getPassword(), "USER");
        userRepository.save(user);
        return ResponseEntity.ok(
                new AuthResponse(true, "Registration successful! Please log in.", user.getUsername(), user.getEmail(), user.getRole()));
    }
}
