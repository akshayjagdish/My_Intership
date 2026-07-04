package com.example.ecommerce.config;

import com.example.ecommerce.domain.Category;
import com.example.ecommerce.domain.Product;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedData(UserService userService, CategoryRepository categoryRepository, ProductRepository productRepository) {
        return args -> {
            String adminEmail = "admin@example.com";
            try {
                userService.byEmail(adminEmail);
            } catch (RuntimeException exception) {
                userService.createAdmin("Store Admin", adminEmail, "admin123");
            }

            Category electronics = categoryRepository.findByNameIgnoreCase("Electronics")
                    .orElseGet(() -> {
                        Category category = new Category();
                        category.setName("Electronics");
                        category.setDescription("Gadgets and accessories");
                        return categoryRepository.save(category);
                    });

            if (productRepository.findAll().isEmpty()) {
                Product keyboard = new Product();
                keyboard.setName("Mechanical Keyboard");
                keyboard.setDescription("Hot-swappable keyboard with tactile switches");
                keyboard.setPrice(new BigDecimal("89.99"));
                keyboard.setInventory(25);
                keyboard.setCategory(electronics);
                productRepository.save(keyboard);
            }
        };
    }
}
