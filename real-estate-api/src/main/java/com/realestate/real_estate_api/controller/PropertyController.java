package com.realestate.real_estate_api.controller;

import com.realestate.real_estate_api.dto.PropertyDTO;
import com.realestate.real_estate_api.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "Properties", description = "CRUD and search endpoints for real estate properties")
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

	private final PropertyService propertyService;

	public PropertyController(PropertyService propertyService) {
		this.propertyService = propertyService;
	}

	@Operation(summary = "Get all properties or search with filters")
	@GetMapping
	public List<PropertyDTO> getAllProperties(
			@Parameter(description = "Filter by location")
			@RequestParam(required = false) String location,
			@Parameter(description = "Filter by property type")
			@RequestParam(required = false) String propertyType,
			@Parameter(description = "Minimum price")
			@RequestParam(required = false) BigDecimal minPrice,
			@Parameter(description = "Maximum price")
			@RequestParam(required = false) BigDecimal maxPrice) {
		return propertyService.getAllProperties(location, propertyType, minPrice, maxPrice);
	}

	@Operation(summary = "Get property by ID")
	@GetMapping("/{id}")
	public PropertyDTO getPropertyById(
			@Parameter(description = "Property ID")
			@PathVariable Long id) {
		return propertyService.getPropertyById(id);
	}

	@Operation(summary = "Create a new property")
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public PropertyDTO createProperty(@Valid @RequestBody PropertyDTO propertyDTO) {
		return propertyService.createProperty(propertyDTO);
	}

	@Operation(summary = "Update an existing property")
	@PutMapping("/{id}")
	public PropertyDTO updateProperty(
			@Parameter(description = "Property ID")
			@PathVariable Long id,
			@Valid @RequestBody PropertyDTO propertyDTO) {
		return propertyService.updateProperty(id, propertyDTO);
	}

	@Operation(summary = "Delete a property")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteProperty(
			@Parameter(description = "Property ID")
			@PathVariable Long id) {
		propertyService.deleteProperty(id);
		return ResponseEntity.noContent().build();
	}
}
