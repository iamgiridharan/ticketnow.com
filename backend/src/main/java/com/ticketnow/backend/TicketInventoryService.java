package com.ticketnow.backend;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class TicketInventoryService {

    private final Map<Long, Integer> eventTickets = new HashMap<>();
    private final Map<Long, String> eventNames = new HashMap<>();
    private final Map<Long, Double> eventPrices = new HashMap<>();

    public TicketInventoryService() {
        eventTickets.put(1L, 100);
        eventTickets.put(2L, 500);
        eventTickets.put(3L, 200);
        eventTickets.put(4L, 300);

        eventNames.put(1L, "Tech Conference 2024");
        eventNames.put(2L, "Summer Music Festival");
        eventNames.put(3L, "Jazz Night Live");
        eventNames.put(4L, "Art & Design Expo");

        eventPrices.put(1L, 50.0);
        eventPrices.put(2L, 75.0);
        eventPrices.put(3L, 40.0);
        eventPrices.put(4L, 30.0);
    }

    public int getAvailableTickets(Long eventId) {
        return eventTickets.getOrDefault(eventId, 0);
    }

    public boolean deductTickets(Long eventId, int count) {
        int available = getAvailableTickets(eventId);
        if (count > available) return false;
        eventTickets.put(eventId, available - count);
        return true;
    }

    public String getEventName(Long eventId) {
        return eventNames.getOrDefault(eventId, "Unknown Event");
    }

    public double getEventPrice(Long eventId) {
        return eventPrices.getOrDefault(eventId, 0.0);
    }

    public Map<Long, Integer> getAllAvailableTickets() {
        return Collections.unmodifiableMap(eventTickets);
    }

    public Map<Long, String> getAllEventNames() {
        return Collections.unmodifiableMap(eventNames);
    }

    public Map<Long, Double> getAllEventPrices() {
        return Collections.unmodifiableMap(eventPrices);
    }
}
