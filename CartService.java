package com.example.ecommerce.service;

import com.example.ecommerce.domain.AppUser;
import com.example.ecommerce.domain.Cart;
import com.example.ecommerce.domain.CartItem;
import com.example.ecommerce.domain.Product;
import com.example.ecommerce.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final ProductService productService;

    public CartService(CartRepository cartRepository, ProductService productService) {
        this.cartRepository = cartRepository;
        this.productService = productService;
    }

    @Transactional
    public Cart getOrCreate(AppUser user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    @Transactional
    public Cart addItem(AppUser user, Long productId, int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        Cart cart = getOrCreate(user);
        Product product = productService.byId(productId);
        CartItem item = cart.getItems().stream()
                .filter(existing -> existing.getProduct().getId().equals(productId))
                .findFirst()
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    cart.getItems().add(newItem);
                    return newItem;
                });
        int newQuantity = item.getQuantity() + quantity;
        if (product.getInventory() < newQuantity) {
            throw new IllegalArgumentException("Requested quantity exceeds available inventory");
        }
        item.setQuantity(newQuantity);
        return cart;
    }

    @Transactional
    public Cart updateItem(AppUser user, Long productId, int quantity) {
        if (quantity < 1) {
            return removeItem(user, productId);
        }
        Cart cart = getOrCreate(user);
        CartItem item = cart.getItems().stream()
                .filter(existing -> existing.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Product is not in cart"));
        if (item.getProduct().getInventory() < quantity) {
            throw new IllegalArgumentException("Requested quantity exceeds available inventory");
        }
        item.setQuantity(quantity);
        return cart;
    }

    @Transactional
    public Cart removeItem(AppUser user, Long productId) {
        Cart cart = getOrCreate(user);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return cart;
    }

    @Transactional
    public void clear(Cart cart) {
        cart.getItems().clear();
    }
}
