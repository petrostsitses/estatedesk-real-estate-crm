package com.realestate.real_estate_api.service;

import com.realestate.real_estate_api.dto.PropertyDTO;
import com.realestate.real_estate_api.entity.Property;
import com.realestate.real_estate_api.exception.PropertyNotFoundException;
import com.realestate.real_estate_api.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PropertyService {

	private final PropertyRepository propertyRepository;

	public PropertyService(PropertyRepository propertyRepository) {
		this.propertyRepository = propertyRepository;
	}

	public List<PropertyDTO> getAllProperties(
			String location,
			String propertyType,
			BigDecimal minPrice,
			BigDecimal maxPrice) {

		if (location != null && location.isBlank()) {
			location = null;
		}
		if (propertyType != null && propertyType.isBlank()) {
			propertyType = null;
		}

		List<Property> properties = propertyRepository.search(location, propertyType, minPrice, maxPrice);
		List<PropertyDTO> propertyDTOs = new ArrayList<>();

		for (Property property : properties) {
			propertyDTOs.add(toDTO(property));
		}

		return propertyDTOs;
	}

	public PropertyDTO getPropertyById(Long id) {
		Property property = propertyRepository.findById(id)
				.orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));
		return toDTO(property);
	}

	public PropertyDTO createProperty(PropertyDTO propertyDTO) {
		Property property = toEntity(propertyDTO);
		Property savedProperty = propertyRepository.save(property);
		return toDTO(savedProperty);
	}

	public PropertyDTO updateProperty(Long id, PropertyDTO propertyDTO) {
		Property existingProperty = propertyRepository.findById(id)
				.orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));

		existingProperty.setTitle(propertyDTO.getTitle());
		existingProperty.setDescription(propertyDTO.getDescription());
		existingProperty.setPrice(propertyDTO.getPrice());
		existingProperty.setLocation(propertyDTO.getLocation());
		existingProperty.setPropertyType(propertyDTO.getPropertyType());
		existingProperty.setBedrooms(propertyDTO.getBedrooms());
		existingProperty.setBathrooms(propertyDTO.getBathrooms());
		existingProperty.setSquareMeters(propertyDTO.getSquareMeters());
		copyExtendedFields(propertyDTO, existingProperty);

		Property updatedProperty = propertyRepository.save(existingProperty);
		return toDTO(updatedProperty);
	}

	public void deleteProperty(Long id) {
		Property existingProperty = propertyRepository.findById(id)
				.orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));
		propertyRepository.delete(existingProperty);
	}

	private PropertyDTO toDTO(Property property) {
		PropertyDTO propertyDTO = new PropertyDTO();
		propertyDTO.setId(property.getId());
		propertyDTO.setTitle(property.getTitle());
		propertyDTO.setDescription(property.getDescription());
		propertyDTO.setPrice(property.getPrice());
		propertyDTO.setLocation(property.getLocation());
		propertyDTO.setPropertyType(property.getPropertyType());
		propertyDTO.setBedrooms(property.getBedrooms());
		propertyDTO.setBathrooms(property.getBathrooms());
		propertyDTO.setSquareMeters(property.getSquareMeters());
		propertyDTO.setFloor(property.getFloor());
		propertyDTO.setYearBuilt(property.getYearBuilt());
		propertyDTO.setHeating(property.getHeating());
		propertyDTO.setEnergyClass(property.getEnergyClass());
		propertyDTO.setFurnished(property.getFurnished());
		propertyDTO.setParking(property.getParking());
		propertyDTO.setStorage(property.getStorage());
		propertyDTO.setRenovated(property.getRenovated());
		propertyDTO.setOrientation(property.getOrientation());
		propertyDTO.setView(property.getView());
		propertyDTO.setBalconyArea(property.getBalconyArea());
		propertyDTO.setPlotArea(property.getPlotArea());
		propertyDTO.setNotes(property.getNotes());
		propertyDTO.setTransactionType(property.getTransactionType());
		return propertyDTO;
	}

	private Property toEntity(PropertyDTO propertyDTO) {
		Property property = new Property();
		property.setTitle(propertyDTO.getTitle());
		property.setDescription(propertyDTO.getDescription());
		property.setPrice(propertyDTO.getPrice());
		property.setLocation(propertyDTO.getLocation());
		property.setPropertyType(propertyDTO.getPropertyType());
		property.setBedrooms(propertyDTO.getBedrooms());
		property.setBathrooms(propertyDTO.getBathrooms());
		property.setSquareMeters(propertyDTO.getSquareMeters());
		copyExtendedFields(propertyDTO, property);
		return property;
	}

	private void copyExtendedFields(PropertyDTO propertyDTO, Property property) {
		property.setFloor(propertyDTO.getFloor());
		property.setYearBuilt(propertyDTO.getYearBuilt());
		property.setHeating(propertyDTO.getHeating());
		property.setEnergyClass(propertyDTO.getEnergyClass());
		property.setFurnished(propertyDTO.getFurnished());
		property.setParking(propertyDTO.getParking());
		property.setStorage(propertyDTO.getStorage());
		property.setRenovated(propertyDTO.getRenovated());
		property.setOrientation(propertyDTO.getOrientation());
		property.setView(propertyDTO.getView());
		property.setBalconyArea(propertyDTO.getBalconyArea());
		property.setPlotArea(propertyDTO.getPlotArea());
		property.setNotes(propertyDTO.getNotes());
		property.setTransactionType(propertyDTO.getTransactionType());
	}
}
