package com.ticketnow.backend;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @Autowired
    private TicketInventoryService ticketInventoryService;

    @PostMapping("/book")
    public ResponseEntity<BookingResponse> bookTickets(@RequestBody BookingRequest request) {
        Long eventId = (request.getEventId() != null) ? request.getEventId() : 1L;
        int available = ticketInventoryService.getAvailableTickets(eventId);

        if (request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new BookingResponse(false, "Name is required", null, available));
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new BookingResponse(false, "Email is required", null, available));
        }
        if (request.getDepartment() == null || request.getDepartment().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new BookingResponse(false, "Department is required", null, available));
        }
        if (request.getNumberOfTickets() <= 0) {
            return ResponseEntity.badRequest()
                    .body(new BookingResponse(false, "Number of tickets must be greater than 0", null, available));
        }
        if (request.getNumberOfTickets() > available) {
            return ResponseEntity.badRequest()
                    .body(new BookingResponse(false,
                            "Not enough tickets. Only " + available + " remaining.", null, available));
        }

        boolean deducted = ticketInventoryService.deductTickets(eventId, request.getNumberOfTickets());
        if (!deducted) {
            return ResponseEntity.badRequest()
                    .body(new BookingResponse(false, "Booking failed. Please try again.", null, available));
        }

        int remaining = ticketInventoryService.getAvailableTickets(eventId);
        String eventName = ticketInventoryService.getEventName(eventId);

        Booking booking = new Booking(
                request.getName(),
                request.getEmail(),
                request.getDepartment(),
                request.getNumberOfTickets(),
                eventId,
                eventName);

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(new BookingResponse(
                true,
                "Booking successful! " + request.getNumberOfTickets() + " ticket(s) booked. ID: " + savedBooking.getId(),
                savedBooking,
                remaining));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> getAvailableTickets() {
        return ResponseEntity.ok(ticketInventoryService.getAllAvailableTickets());
    }
}