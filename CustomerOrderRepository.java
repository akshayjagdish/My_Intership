package com.example.ecommerce.repository;

import com.example.ecommerce.domain.AppUser;
import com.example.ecommerce.domain.CustomerOrder;
import com.example.ecommerce.domain.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByUserOrderByCreatedAtDesc(AppUser user);

    List<CustomerOrder> findByStatus(OrderStatus status);

    @Query("select coalesce(sum(o.total), 0) from CustomerOrder o where o.status <> com.example.ecommerce.domain.OrderStatus.CANCELLED")
    BigDecimal totalRevenue();

    long countByCreatedAtBetween(Instant start, Instant end);
}
