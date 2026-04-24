package com.ticketnow.backend;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TicketInventoryService ticketInventoryService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<Booking> bookings = bookingRepository.findAll();

        int totalTicketsSold = bookings.stream().mapToInt(Booking::getNumberOfTickets).sum();

        double totalRevenue = bookings.stream().mapToDouble(b -> {
            double price = ticketInventoryService.getEventPrice(b.getEventId() != null ? b.getEventId() : 1L);
            return price * b.getNumberOfTickets();
        }).sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", bookings.size());
        stats.put("totalTicketsSold", totalTicketsSold);
        stats.put("totalRevenue", totalRevenue);
        stats.put("bookings", bookings);
        stats.put("availableTickets", ticketInventoryService.getAllAvailableTickets());
        stats.put("eventNames", ticketInventoryService.getAllEventNames());

        return ResponseEntity.ok(stats);
    }
}
