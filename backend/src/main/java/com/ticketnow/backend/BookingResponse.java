package com.ticketnow.backend;

public class BookingResponse {
    private boolean success;
    private String message;
    private Object data;
    private int remainingTickets;

    // Constructors
    public BookingResponse() {}

    public BookingResponse(boolean success, String message, Object data, int remainingTickets) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.remainingTickets = remainingTickets;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public int getRemainingTickets() {
        return remainingTickets;
    }

    public void setRemainingTickets(int remainingTickets) {
        this.remainingTickets = remainingTickets;
    }
}
