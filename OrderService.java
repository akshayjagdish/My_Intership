package com.example.ecommerce.service;

import com.example.ecommerce.domain.AppUser;
import com.example.ecommerce.domain.Cart;
import com.example.ecommerce.domain.CustomerOrder;
import com.example.ecommerce.domain.OrderItem;
import com.example.ecommerce.domain.OrderStatus;
import com.example.ecommerce.exception.BusinessException;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.CustomerOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {
    private final CustomerOrderRepository orderRepository;
    private final CartService cartService;
    private final ProductService productService;

    public OrderService(CustomerOrderRepository orderRepository, CartService cartService, ProductService productService) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.productService = productService;
    }

    @Transactional
    public CustomerOrder checkout(AppUser user, String shippingAddress) {
        Cart cart = cartService.getOrCreate(user);
        if (cart.getItems().isEmpty()) {
            throw new BusinessException("Cart is empty");
        }

        CustomerOrder order = new CustomerOrder();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);

        cart.getItems().forEach(cartItem -> {
            productService.reserve(cartItem.getProduct(), cartItem.getQuantity());
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getProduct().getPrice());
            order.getItems().add(orderItem);
        });

        BigDecimal total = order.getItems().stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotal(total);
        CustomerOrder saved = orderRepository.save(order);
        cartService.clear(cart);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<CustomerOrder> myOrders(AppUser user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional(readOnly = true)
    public List<CustomerOrder> allOrders() {
        return orderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public CustomerOrder byId(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Transactional
    public CustomerOrder updateStatus(Long id, OrderStatus status) {
        CustomerOrder order = byId(id);
        order.setStatus(status);
        return order;
    }
}
