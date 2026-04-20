package com.ticketnow.backend;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    // Store available tickets (in a real app, this would be in a database)
    private static int availableTickets = 100;

    @PostMapping("/book")
    public BookingResponse bookTickets(@RequestBody BookingRequest request) {
        // Validate required fields
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return new BookingResponse(false, "Name is required", null, availableTickets);
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new BookingResponse(false, "Email is required", null, availableTickets);
        }

        if (request.getDepartment() == null || request.getDepartment().trim().isEmpty()) {
            return new BookingResponse(false, "Department is required", null, availableTickets);
        }

        // Validate ticket count
        if (request.getNumberOfTickets() <= 0) {
            return new BookingResponse(false, "Number of tickets must be greater than 0", null, availableTickets);
        }

        // Check if requested tickets exceed available tickets
        if (request.getNumberOfTickets() > availableTickets) {
            return new BookingResponse(
                false, 
                "Not enough tickets available. Only " + availableTickets + " tickets remaining.",
                null,
                availableTickets
            );
        }

        // Process booking
        availableTickets -= request.getNumberOfTickets();

        // Create Booking entity and save to database
        Booking booking = new Booking(
            request.getName(),
            request.getEmail(),
            request.getDepartment(),
            request.getNumberOfTickets()
        );
        
        Booking savedBooking = bookingRepository.save(booking);

        BookingResponse response = new BookingResponse(
            true,
            "Booking successful! " + request.getNumberOfTickets() + " tickets booked for " + request.getName() + ". Booking ID: " + savedBooking.getId(),
            savedBooking,
            availableTickets
        );

        return response;
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
