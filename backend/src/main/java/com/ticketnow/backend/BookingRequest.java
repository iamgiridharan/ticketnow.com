package com.ticketnow.backend;

public class BookingRequest {
    private String name;
    private String email;
    private String department;
    private int numberOfTickets;
    private Long eventId;

    // Constructors
    public BookingRequest() {}

    public BookingRequest(String name, String email, String department, int numberOfTickets, Long eventId) {
        this.name = name;
        this.email = email;
        this.department = department;
        this.numberOfTickets = numberOfTickets;
        this.eventId = eventId;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getNumberOfTickets() {
        return numberOfTickets;
    }

    public void setNumberOfTickets(int numberOfTickets) {
        this.numberOfTickets = numberOfTickets;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }
}
