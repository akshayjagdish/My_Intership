package com.example.ecommerce.controller;

import com.example.ecommerce.domain.AppUser;
import com.example.ecommerce.domain.CustomerOrder;
import com.example.ecommerce.domain.Role;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.service.OrderService;
import com.example.ecommerce.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerOrder checkout(Authentication authentication, @Valid @RequestBody CheckoutRequest request) {
        return orderService.checkout(currentUser(authentication), request.shippingAddress());
    }

    @GetMapping
    public List<CustomerOrder> myOrders(Authentication authentication) {
        return orderService.myOrders(currentUser(authentication));
    }

    @GetMapping("/{id}")
    public CustomerOrder one(Authentication authentication, @PathVariable Long id) {
        AppUser user = currentUser(authentication);
        CustomerOrder order = orderService.byId(id);
        boolean admin = user.getRoles().contains(Role.ADMIN);
        if (!admin && !order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found");
        }
        return order;
    }

    private AppUser currentUser(Authentication authentication) {
        return userService.byEmail(authentication.getName());
    }

    public record CheckoutRequest(@NotBlank String shippingAddress) {
    }
}
