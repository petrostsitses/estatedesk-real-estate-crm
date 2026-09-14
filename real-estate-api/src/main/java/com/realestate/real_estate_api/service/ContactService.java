package com.realestate.real_estate_api.service;

import com.realestate.real_estate_api.entity.Contact;
import com.realestate.real_estate_api.exception.ContactNotFoundException;
import com.realestate.real_estate_api.repository.ContactRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

	private final ContactRepository contactRepository;

	public ContactService(ContactRepository contactRepository) {
		this.contactRepository = contactRepository;
	}

	public List<Contact> getAllContacts() {
		return contactRepository.findAll();
	}

	public Contact getContactById(Long id) {
		return contactRepository.findById(id)
				.orElseThrow(() -> new ContactNotFoundException("Contact not found with id: " + id));
	}

	public Contact createContact(Contact contact) {
		return contactRepository.save(contact);
	}

	public Contact updateContact(Long id, Contact contact) {
		Contact existingContact = contactRepository.findById(id)
				.orElseThrow(() -> new ContactNotFoundException("Contact not found with id: " + id));

		existingContact.setFirstName(contact.getFirstName());
		existingContact.setLastName(contact.getLastName());
		existingContact.setPhone(contact.getPhone());
		existingContact.setEmail(contact.getEmail());
		existingContact.setContactType(contact.getContactType());
		existingContact.setNotes(contact.getNotes());

		return contactRepository.save(existingContact);
	}

	public void deleteContact(Long id) {
		Contact existingContact = contactRepository.findById(id)
				.orElseThrow(() -> new ContactNotFoundException("Contact not found with id: " + id));
		contactRepository.delete(existingContact);
	}
}
