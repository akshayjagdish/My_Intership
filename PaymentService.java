package com.example.ecommerce.service;

import com.example.ecommerce.domain.CustomerOrder;
import com.example.ecommerce.domain.OrderStatus;
import com.example.ecommerce.domain.Payment;
import com.example.ecommerce.domain.PaymentStatus;
import com.example.ecommerce.exception.BusinessException;
import com.example.ecommerce.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderService orderService;

    public PaymentService(PaymentRepository paymentRepository, OrderService orderService) {
        this.paymentRepository = paymentRepository;
        this.orderService = orderService;
    }

    @Transactional
    public Payment pay(Long orderId, String provider, boolean approve) {
        CustomerOrder order = orderService.byId(orderId);
        if (order.getPayment() != null) {
            throw new BusinessException("Order already has a payment");
        }
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotal());
        payment.setProvider(provider);
        payment.setTransactionReference(UUID.randomUUID().toString());
        payment.setStatus(approve ? PaymentStatus.APPROVED : PaymentStatus.DECLINED);
        order.setPayment(payment);
        if (approve) {
            order.setStatus(OrderStatus.PAID);
        }
        return paymentRepository.save(payment);
    }
}
