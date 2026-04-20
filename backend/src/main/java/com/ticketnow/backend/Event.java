package com.ticketnow.backend;

public class Event {
    private Long id;
    private String name;
    private String department;
    private String date;
    private String time;
    private String venue;
    private Double price;
    private Integer availableTickets;

    public Event() {
    }

    public Event(Long id, String name, String department, String date, String time, String venue, Double price, Integer availableTickets) {
        this.id = id;
        this.name = name;
        this.department = department;
        this.date = date;
        this.time = time;
        this.venue = venue;
        this.price = price;
        this.availableTickets = availableTickets;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getAvailableTickets() {
        return availableTickets;
    }

    public void setAvailableTickets(Integer availableTickets) {
        this.availableTickets = availableTickets;
    }
}
