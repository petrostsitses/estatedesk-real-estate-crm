package com.realestate.real_estate_api.repository;

import com.realestate.real_estate_api.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}
