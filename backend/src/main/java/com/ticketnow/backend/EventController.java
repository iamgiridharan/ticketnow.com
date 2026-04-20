package com.ticketnow.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {
    
    @GetMapping("/events")
    public Event getEvent() {
        return new Event(
            1L,
            "Tech Conference 2023",
            "Computer Science",
            "2023-10-15",
            "10:00 AM",
            "Convention Center",
            50.0,
            100
        );
    }
}
