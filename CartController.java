package com.example.ecommerce.controller;

import com.example.ecommerce.domain.AppUser;
import com.example.ecommerce.domain.Cart;
import com.example.ecommerce.service.CartService;
import com.example.ecommerce.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    @GetMapping
    public Cart get(Authentication authentication) {
        return cartService.getOrCreate(currentUser(authentication));
    }

    @PostMapping("/items")
    public Cart addItem(Authentication authentication, @Valid @RequestBody CartItemRequest request) {
        return cartService.addItem(currentUser(authentication), request.productId(), request.quantity());
    }

    @PutMapping("/items/{productId}")
    public Cart updateItem(Authentication authentication, @PathVariable Long productId, @Valid @RequestBody QuantityRequest request) {
        return cartService.updateItem(currentUser(authentication), productId, request.quantity());
    }

    @DeleteMapping("/items/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(Authentication authentication, @PathVariable Long productId) {
        cartService.removeItem(currentUser(authentication), productId);
    }

    private AppUser currentUser(Authentication authentication) {
        return userService.byEmail(authentication.getName());
    }

    public record CartItemRequest(@NotNull Long productId, @Min(1) int quantity) {
    }

    public record QuantityRequest(@Min(0) int quantity) {
    }
}
