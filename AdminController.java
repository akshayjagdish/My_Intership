package com.example.ecommerce.controller;

import com.example.ecommerce.domain.AppUser;
import com.example.ecommerce.domain.CustomerOrder;
import com.example.ecommerce.domain.OrderStatus;
import com.example.ecommerce.service.OrderService;
import com.example.ecommerce.service.ReportService;
import com.example.ecommerce.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;
    private final OrderService orderService;
    private final ReportService reportService;

    public AdminController(UserService userService, OrderService orderService, ReportService reportService) {
        this.userService = userService;
        this.orderService = orderService;
        this.reportService = reportService;
    }

    @GetMapping("/users")
    public List<AppUser> users() {
        return userService.allUsers();
    }

    @PostMapping("/users/admins")
    public AppUser createAdmin(@Valid @RequestBody AdminUserRequest request) {
        return userService.createAdmin(request.name(), request.email(), request.password());
    }

    @GetMapping("/orders")
    public List<CustomerOrder> orders() {
        return orderService.allOrders();
    }

    @PatchMapping("/orders/{id}/status")
    public CustomerOrder updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
        return orderService.updateStatus(id, request.status());
    }

    @GetMapping("/reports/dashboard")
    public Map<String, Object> dashboard() {
        return reportService.dashboard();
    }

    public record AdminUserRequest(@NotBlank String name, @Email @NotBlank String email, @Size(min = 6) String password) {
    }

    public record StatusRequest(@NotNull OrderStatus status) {
    }
}
