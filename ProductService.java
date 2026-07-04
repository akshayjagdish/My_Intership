package com.example.ecommerce.service;

import com.example.ecommerce.domain.Category;
import com.example.ecommerce.domain.Product;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    @Transactional
    public Product create(Product product, Long categoryId) {
        if (categoryId != null) {
            product.setCategory(categoryService.byId(categoryId));
        }
        return productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public Product byId(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Transactional(readOnly = true)
    public Page<Product> search(String query, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, Boolean active, Pageable pageable) {
        return productRepository.findAll(spec(query, categoryId, minPrice, maxPrice, active), pageable);
    }

    @Transactional
    public Product update(Long id, Product request, Long categoryId) {
        Product product = byId(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setInventory(request.getInventory());
        product.setActive(request.isActive());
        product.setCategory(categoryId == null ? null : categoryService.byId(categoryId));
        return product;
    }

    @Transactional
    public void delete(Long id) {
        Product product = byId(id);
        product.setActive(false);
    }

    @Transactional
    public void reserve(Product product, int quantity) {
        if (!product.isActive()) {
            throw new IllegalArgumentException("Product is inactive: " + product.getName());
        }
        if (product.getInventory() < quantity) {
            throw new IllegalArgumentException("Insufficient inventory for " + product.getName());
        }
        product.setInventory(product.getInventory() - quantity);
    }

    private Specification<Product> spec(String query, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, Boolean active) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (query != null && !query.isBlank()) {
                String like = "%" + query.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (active != null) {
                predicates.add(cb.equal(root.get("active"), active));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
