package com.example.ecommerce.controller;

import com.example.ecommerce.domain.AppUser;
import com.example.ecommerce.domain.CustomerOrder;
import com.example.ecommerce.domain.Payment;
import com.example.ecommerce.domain.Role;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.service.OrderService;
import com.example.ecommerce.service.PaymentService;
import com.example.ecommerce.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;
    private final OrderService orderService;
    private final UserService userService;

    public PaymentController(PaymentService paymentService, OrderService orderService, UserService userService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Payment pay(Authentication authentication, @Valid @RequestBody PaymentRequest request) {
        AppUser user = userService.byEmail(authentication.getName());
        CustomerOrder order = orderService.byId(request.orderId());
        boolean admin = user.getRoles().contains(Role.ADMIN);
        if (!admin && !order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found");
        }
        return paymentService.pay(request.orderId(), request.provider(), request.approve());
    }

    public record PaymentRequest(@NotNull Long orderId, @NotBlank String provider, boolean approve) {
    }
}
