package com.realestate.real_estate_api.repository;

import com.realestate.real_estate_api.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {

	@Query("""
			SELECT p FROM Property p
			WHERE (:location IS NULL OR p.location = :location)
			  AND (:propertyType IS NULL OR p.propertyType = :propertyType)
			  AND (:minPrice IS NULL OR p.price >= :minPrice)
			  AND (:maxPrice IS NULL OR p.price <= :maxPrice)
			""")
	List<Property> search(
			@Param("location") String location,
			@Param("propertyType") String propertyType,
			@Param("minPrice") BigDecimal minPrice,
			@Param("maxPrice") BigDecimal maxPrice);
}
