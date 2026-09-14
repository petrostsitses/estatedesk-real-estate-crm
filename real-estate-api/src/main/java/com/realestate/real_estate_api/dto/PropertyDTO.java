package com.realestate.real_estate_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class PropertyDTO {

	private Long id;

	@NotBlank(message = "Title is required")
	private String title;

	@NotBlank(message = "Description is required")
	private String description;

	@Positive(message = "Price must be positive")
	private BigDecimal price;

	@NotBlank(message = "Location is required")
	private String location;

	private String propertyType;

	@PositiveOrZero(message = "Bedrooms must be zero or positive")
	private Integer bedrooms;

	@PositiveOrZero(message = "Bathrooms must be zero or positive")
	private Integer bathrooms;

	@Positive(message = "Square meters must be positive")
	private Double squareMeters;

	private String floor;

	private Integer yearBuilt;

	private String heating;

	private String energyClass;

	private Boolean furnished;

	private Boolean parking;

	private Boolean storage;

	private Boolean renovated;

	private String orientation;

	private String view;

	private Double balconyArea;

	private Double plotArea;

	private String notes;

	private String transactionType;

	public PropertyDTO() {
	}

	public PropertyDTO(Long id, String title, String description, BigDecimal price, String location,
			String propertyType, Integer bedrooms, Integer bathrooms, Double squareMeters) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.price = price;
		this.location = location;
		this.propertyType = propertyType;
		this.bedrooms = bedrooms;
		this.bathrooms = bathrooms;
		this.squareMeters = squareMeters;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getPropertyType() {
		return propertyType;
	}

	public void setPropertyType(String propertyType) {
		this.propertyType = propertyType;
	}

	public Integer getBedrooms() {
		return bedrooms;
	}

	public void setBedrooms(Integer bedrooms) {
		this.bedrooms = bedrooms;
	}

	public Integer getBathrooms() {
		return bathrooms;
	}

	public void setBathrooms(Integer bathrooms) {
		this.bathrooms = bathrooms;
	}

	public Double getSquareMeters() {
		return squareMeters;
	}

	public void setSquareMeters(Double squareMeters) {
		this.squareMeters = squareMeters;
	}

	public String getFloor() {
		return floor;
	}

	public void setFloor(String floor) {
		this.floor = floor;
	}

	public Integer getYearBuilt() {
		return yearBuilt;
	}

	public void setYearBuilt(Integer yearBuilt) {
		this.yearBuilt = yearBuilt;
	}

	public String getHeating() {
		return heating;
	}

	public void setHeating(String heating) {
		this.heating = heating;
	}

	public String getEnergyClass() {
		return energyClass;
	}

	public void setEnergyClass(String energyClass) {
		this.energyClass = energyClass;
	}

	public Boolean getFurnished() {
		return furnished;
	}

	public void setFurnished(Boolean furnished) {
		this.furnished = furnished;
	}

	public Boolean getParking() {
		return parking;
	}

	public void setParking(Boolean parking) {
		this.parking = parking;
	}

	public Boolean getStorage() {
		return storage;
	}

	public void setStorage(Boolean storage) {
		this.storage = storage;
	}

	public Boolean getRenovated() {
		return renovated;
	}

	public void setRenovated(Boolean renovated) {
		this.renovated = renovated;
	}

	public String getOrientation() {
		return orientation;
	}

	public void setOrientation(String orientation) {
		this.orientation = orientation;
	}

	public String getView() {
		return view;
	}

	public void setView(String view) {
		this.view = view;
	}

	public Double getBalconyArea() {
		return balconyArea;
	}

	public void setBalconyArea(Double balconyArea) {
		this.balconyArea = balconyArea;
	}

	public Double getPlotArea() {
		return plotArea;
	}

	public void setPlotArea(Double plotArea) {
		this.plotArea = plotArea;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
	}
}
