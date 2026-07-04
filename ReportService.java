package com.example.ecommerce.service;

import com.example.ecommerce.repository.CustomerOrderRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@Service
public class ReportService {
    private final CustomerOrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final AppUserRepository userRepository;

    public ReportService(CustomerOrderRepository orderRepository, ProductRepository productRepository, AppUserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> dashboard() {
        Instant now = Instant.now();
        BigDecimal revenue = orderRepository.totalRevenue();
        return Map.of(
                "users", userRepository.count(),
                "products", productRepository.count(),
                "orders", orderRepository.count(),
                "ordersLast30Days", orderRepository.countByCreatedAtBetween(now.minus(30, ChronoUnit.DAYS), now),
                "revenue", revenue
        );
    }
}
