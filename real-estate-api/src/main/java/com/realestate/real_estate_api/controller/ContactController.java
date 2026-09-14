package com.realestate.real_estate_api.controller;

import com.realestate.real_estate_api.entity.Contact;
import com.realestate.real_estate_api.service.ContactService;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Contacts", description = "CRUD endpoints for real estate office contacts")
@RestController
@RequestMapping("/api/contacts")
public class ContactController {

	private final ContactService contactService;

	public ContactController(ContactService contactService) {
		this.contactService = contactService;
	}

	@Operation(summary = "Get all contacts")
	@GetMapping
	public List<Contact> getAllContacts() {
		return contactService.getAllContacts();
	}

	@Operation(summary = "Get contact by ID")
	@GetMapping("/{id}")
	public Contact getContactById(
			@Parameter(description = "Contact ID")
			@PathVariable Long id) {
		return contactService.getContactById(id);
	}

	@Operation(summary = "Create a new contact")
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Contact createContact(@Valid @RequestBody Contact contact) {
		return contactService.createContact(contact);
	}

	@Operation(summary = "Update an existing contact")
	@PutMapping("/{id}")
	public Contact updateContact(
			@Parameter(description = "Contact ID")
			@PathVariable Long id,
			@Valid @RequestBody Contact contact) {
		return contactService.updateContact(id, contact);
	}

	@Operation(summary = "Delete a contact")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteContact(
			@Parameter(description = "Contact ID")
			@PathVariable Long id) {
		contactService.deleteContact(id);
		return ResponseEntity.noContent().build();
	}
}
