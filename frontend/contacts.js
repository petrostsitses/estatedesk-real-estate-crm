const API_URL = "http://localhost:8080/api/contacts";

const contactsContainer = document.getElementById("contacts-container");
const contactFormSection = document.getElementById("contact-form-section");
const contactForm = document.getElementById("contact-form");
const contactFormTitle = document.getElementById("contact-form-title");
const contactFormMessage = document.getElementById("contact-form-message");
const firstNameInput = document.getElementById("contact-first-name");
const lastNameInput = document.getElementById("contact-last-name");
const phoneInput = document.getElementById("contact-phone");
const emailInput = document.getElementById("contact-email");
const contactTypeSelect = document.getElementById("contact-type");
const notesInput = document.getElementById("contact-notes");
const contactSearchForm = document.getElementById("contact-search-form");
const contactSearchInput = document.getElementById("contact-search");

let editingContactId = null;
let allContacts = [];

function displayValue(value) {
	return value == null ? "" : String(value);
}

function showFormMessage(text) {
	contactFormMessage.textContent = text;
	contactFormMessage.hidden = !text;
}

function resetContactForm() {
	editingContactId = null;
	contactForm.reset();
	contactTypeSelect.value = "";
	showFormMessage("");
	contactFormTitle.textContent = "Νέα επαφή";
}

function openContactForm(contact) {
	if (contact) {
		editingContactId = contact.id;
		contactFormTitle.textContent = "Επεξεργασία επαφής";
		firstNameInput.value = displayValue(contact.firstName);
		lastNameInput.value = displayValue(contact.lastName);
		phoneInput.value = displayValue(contact.phone);
		emailInput.value = displayValue(contact.email);
		contactTypeSelect.value = displayValue(contact.contactType);
		notesInput.value = displayValue(contact.notes);
	} else {
		resetContactForm();
	}
	showFormMessage("");
	contactFormSection.hidden = false;
}

function closeContactForm() {
	resetContactForm();
	contactFormSection.hidden = true;
}

function collectContactPayload() {
	const contactType = contactTypeSelect.value.trim();
	return {
		firstName: firstNameInput.value.trim(),
		lastName: lastNameInput.value.trim(),
		phone: phoneInput.value.trim() || null,
		email: emailInput.value.trim() || null,
		contactType: contactType || null,
		notes: notesInput.value.trim() || null
	};
}

function createContactCard(contact) {
	const card = document.createElement("article");
	card.className = "property-card";
	card.dataset.id = contact.id;

	card.innerHTML =
		"<h3>" + displayValue(contact.firstName) + " " + displayValue(contact.lastName) + "</h3>" +
		"<p><strong>Τηλέφωνο:</strong> " + displayValue(contact.phone) + "</p>" +
		"<p><strong>Email:</strong> " + displayValue(contact.email) + "</p>" +
		"<p><strong>Τύπος επαφής:</strong> " + displayValue(contact.contactType) + "</p>" +
		"<p class=\"property-description\">" + displayValue(contact.notes) + "</p>" +
		"<div class=\"modal-actions\">" +
			"<button class=\"secondary-button\" type=\"button\" data-action=\"edit\">Επεξεργασία</button>" +
			"<button class=\"secondary-button\" type=\"button\" data-action=\"delete\">Διαγραφή</button>" +
		"</div>";

	return card;
}

function renderContacts(contacts, emptyMessage) {
	if (!contacts || contacts.length === 0) {
		contactsContainer.innerHTML = "<p class=\"placeholder-text\">" + emptyMessage + "</p>";
		return;
	}

	contactsContainer.innerHTML = "";
	contacts.forEach(function (contact) {
		contactsContainer.appendChild(createContactCard(contact));
	});
}

function matchesContactSearch(contact, query) {
	const haystack = [
		contact.firstName,
		contact.lastName,
		contact.phone,
		contact.email
	].map(function (value) {
		return displayValue(value).toLocaleLowerCase("el");
	}).join(" ");

	return haystack.indexOf(query) !== -1;
}

function applyContactSearch() {
	const query = contactSearchInput.value.trim().toLocaleLowerCase("el");
	if (!query) {
		renderContacts(allContacts, "Δεν υπάρχουν επαφές.");
		return;
	}

	const matches = allContacts.filter(function (contact) {
		return matchesContactSearch(contact, query);
	});
	renderContacts(matches, "Δεν βρέθηκαν επαφές.");
}

async function loadContacts() {
	try {
		const response = await fetch(API_URL);

		if (!response.ok) {
			allContacts = [];
			contactsContainer.innerHTML = "<p class=\"placeholder-text\">Αδυναμία φόρτωσης επαφών.</p>";
			return;
		}

		const contacts = await response.json();
		allContacts = contacts || [];
		applyContactSearch();
	} catch (error) {
		console.error("Failed to load contacts:", error);
		allContacts = [];
		contactsContainer.innerHTML = "<p class=\"placeholder-text\">Αδυναμία φόρτωσης επαφών.</p>";
	}
}

document.getElementById("new-contact-button").addEventListener("click", function () {
	openContactForm(null);
});

document.getElementById("cancel-contact-button").addEventListener("click", closeContactForm);

contactForm.addEventListener("submit", async function (event) {
	event.preventDefault();
	const payload = collectContactPayload();
	if (!payload.firstName || !payload.lastName) {
		showFormMessage("Συμπληρώστε όνομα και επώνυμο.");
		return;
	}

	const isEdit = editingContactId != null;
	const url = isEdit ? API_URL + "/" + editingContactId : API_URL;
	const method = isEdit ? "PUT" : "POST";

	try {
		const response = await fetch(url, {
			method: method,
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			showFormMessage("Δεν ήταν δυνατή η αποθήκευση της επαφής.");
			return;
		}

		closeContactForm();
		await loadContacts();
	} catch (error) {
		console.error("Failed to save contact:", error);
		showFormMessage("Δεν ήταν δυνατή η αποθήκευση της επαφής.");
	}
});

contactsContainer.addEventListener("click", async function (event) {
	const button = event.target.closest("button[data-action]");
	if (!button) {
		return;
	}

	const card = button.closest(".property-card");
	const contactId = card && card.dataset.id;
	if (!contactId) {
		return;
	}

	if (button.dataset.action === "edit") {
		try {
			const response = await fetch(API_URL + "/" + contactId);
			if (!response.ok) {
				return;
			}
			const contact = await response.json();
			openContactForm(contact);
		} catch (error) {
			console.error("Failed to load contact:", error);
		}
		return;
	}

	if (button.dataset.action === "delete") {
		const confirmed = window.confirm("Θέλετε σίγουρα να διαγράψετε αυτή την επαφή;");
		if (!confirmed) {
			return;
		}

		try {
			const response = await fetch(API_URL + "/" + contactId, {
				method: "DELETE"
			});
			if (!response.ok) {
				return;
			}
			closeContactForm();
			await loadContacts();
		} catch (error) {
			console.error("Failed to delete contact:", error);
		}
	}
});

contactSearchForm.addEventListener("submit", function (event) {
	event.preventDefault();
	if (!contactSearchInput.value.trim()) {
		return;
	}
	applyContactSearch();
});

document.getElementById("contact-search-clear").addEventListener("click", function () {
	contactSearchInput.value = "";
	renderContacts(allContacts, "Δεν υπάρχουν επαφές.");
});

loadContacts();
