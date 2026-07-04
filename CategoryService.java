package com.example.ecommerce.service;

import com.example.ecommerce.domain.Category;
import com.example.ecommerce.exception.BusinessException;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Category create(Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new BusinessException("Category already exists");
        }
        return categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Category byId(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    @Transactional
    public Category update(Long id, Category request) {
        Category category = byId(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return category;
    }

    @Transactional
    public void delete(Long id) {
        categoryRepository.delete(byId(id));
    }
}
