const API_URL = "http://localhost:8080/api/properties";

const LAND_TYPES = ["οικόπεδο", "αγροτεμάχιο", "γη"];
const COMMERCIAL_TYPES = [
	"γραφείο",
	"κατάστημα",
	"αποθήκη",
	"βιομηχανικός χώρος",
	"βιοτεχνικός χώρος",
	"ξενοδοχείο",
	"κτίριο επαγγελματικών χώρων",
	"αίθουσα",
	"εκθεσιακός χώρος διαμερισμάτων"
];

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function isEmpty(value) {
	if (value == null) {
		return true;
	}
	if (typeof value === "number" && !Number.isFinite(value)) {
		return true;
	}
	if (typeof value === "string" && value.trim() === "") {
		return true;
	}
	return false;
}

function displayValue(value) {
	if (isEmpty(value)) {
		return "—";
	}
	return String(value);
}

function formatBoolean(value) {
	if (value === true) {
		return "Ναι";
	}
	if (value === false) {
		return "Όχι";
	}
	return "—";
}

function formatPrice(price) {
	if (isEmpty(price)) {
		return "—";
	}
	const parsed = Number(price);
	if (!Number.isFinite(parsed)) {
		return "—";
	}
	return parsed.toLocaleString("el-GR") + "€";
}

function formatArea(area) {
	if (isEmpty(area)) {
		return "—";
	}
	const parsed = Number(area);
	if (!Number.isFinite(parsed)) {
		return "—";
	}
	return parsed.toLocaleString("el-GR") + " τ.μ.";
}

function formatLandArea(property) {
	if (!isEmpty(property.squareMeters)) {
		return formatArea(property.squareMeters);
	}
	if (!isEmpty(property.plotArea)) {
		return formatArea(property.plotArea);
	}
	return "—";
}

function isPositiveInteger(value) {
	return /^[1-9]\d*$/.test(value);
}

function normalizeType(value) {
	return String(value || "").trim().toLowerCase();
}

function getPropertyKind(property) {
	const type = normalizeType(property.propertyType);
	if (LAND_TYPES.indexOf(type) !== -1) {
		return "land";
	}
	if (COMMERCIAL_TYPES.indexOf(type) !== -1) {
		return "commercial";
	}
	return "housing";
}

function kindLabel(kind) {
	if (kind === "land") {
		return "Γη";
	}
	if (kind === "commercial") {
		return "Επαγγελματική στέγη";
	}
	return "Κατοικία";
}

function fieldHtml(label, value) {
	return "<div class=\"details-field\"><dt>" + escapeHtml(label) + "</dt><dd>" + escapeHtml(value) + "</dd></div>";
}

function notesHtml(value) {
	return "<div class=\"details-field details-field--wide\"><dt>Σημειώσεις</dt><dd class=\"details-notes\">" + escapeHtml(value) + "</dd></div>";
}

function sectionHtml(title, inner) {
	if (!inner) {
		return "";
	}
	return "<section class=\"details-section\"><h2>" + escapeHtml(title) + "</h2><dl class=\"details-grid\">" + inner + "</dl></section>";
}

function photoPlaceholderHtml() {
	return "<div class=\"details-photo\" aria-hidden=\"true\">" +
		"<svg viewBox=\"0 0 48 36\" xmlns=\"http://www.w3.org/2000/svg\">" +
		"<rect x=\"1\" y=\"1\" width=\"46\" height=\"34\" rx=\"4\" fill=\"#e8eef5\" stroke=\"#c5d0dc\"/>" +
		"<path d=\"M10 24V16.5L24 8l14 8.5V24H10z\" fill=\"#d3deea\"/>" +
		"<path d=\"M18 24v-7h12v7\" fill=\"#c0cedb\"/>" +
		"</svg>" +
		"<span>Φωτογραφία ακινήτου</span>" +
		"</div>";
}

function basicsHtml(property) {
	return fieldHtml("Κωδικός", displayValue(property.id)) +
		fieldHtml("Τίτλος", displayValue(property.title)) +
		fieldHtml("Πώληση / Ενοικίαση", displayValue(property.transactionType)) +
		fieldHtml("Υποκατηγορία", displayValue(property.propertyType)) +
		fieldHtml("Περιοχή", displayValue(property.location)) +
		fieldHtml("Τιμή", formatPrice(property.price));
}

function housingSections(property) {
	const features =
		fieldHtml("Τ.μ.", formatArea(property.squareMeters)) +
		fieldHtml("Υπνοδωμάτια", displayValue(property.bedrooms)) +
		fieldHtml("Μπάνια", displayValue(property.bathrooms)) +
		fieldHtml("Όροφος", displayValue(property.floor)) +
		fieldHtml("Έτος κατασκευής", displayValue(property.yearBuilt)) +
		fieldHtml("Θέρμανση", displayValue(property.heating)) +
		fieldHtml("Ενεργειακή κλάση", displayValue(property.energyClass));

	const amenities =
		fieldHtml("Επιπλωμένο", formatBoolean(property.furnished)) +
		fieldHtml("Parking", formatBoolean(property.parking)) +
		fieldHtml("Αποθήκη", formatBoolean(property.storage)) +
		fieldHtml("Ανακαινισμένο", formatBoolean(property.renovated));

	let extra =
		fieldHtml("Προσανατολισμός", displayValue(property.orientation)) +
		fieldHtml("Θέα", displayValue(property.view)) +
		fieldHtml("Τ.μ. μπαλκονιού", formatArea(property.balconyArea));

	if (!isEmpty(property.plotArea)) {
		extra += fieldHtml("Τ.μ. οικοπέδου", formatArea(property.plotArea));
	}

	return sectionHtml("Βασικά στοιχεία", basicsHtml(property)) +
		sectionHtml("Χαρακτηριστικά", features) +
		sectionHtml("Παροχές", amenities) +
		sectionHtml("Επιπλέον στοιχεία", extra);
}

function landSections(property) {
	const features =
		fieldHtml("Εμβαδόν", formatLandArea(property)) +
		fieldHtml("Προσανατολισμός", displayValue(property.orientation)) +
		fieldHtml("Θέα", displayValue(property.view));

	const extra = isEmpty(property.notes) ? "" : notesHtml(displayValue(property.notes));

	return sectionHtml("Βασικά στοιχεία", basicsHtml(property)) +
		sectionHtml("Χαρακτηριστικά", features) +
		sectionHtml("Επιπλέον στοιχεία", extra);
}

function commercialSections(property) {
	const features =
		fieldHtml("Τ.μ.", formatArea(property.squareMeters)) +
		fieldHtml("Όροφος", displayValue(property.floor)) +
		fieldHtml("Έτος κατασκευής", displayValue(property.yearBuilt)) +
		fieldHtml("Μπάνια", displayValue(property.bathrooms)) +
		fieldHtml("Θέρμανση", displayValue(property.heating)) +
		fieldHtml("Ενεργειακή κλάση", displayValue(property.energyClass));

	const amenities =
		fieldHtml("Parking", formatBoolean(property.parking)) +
		fieldHtml("Αποθήκη", formatBoolean(property.storage)) +
		fieldHtml("Ανακαινισμένο", formatBoolean(property.renovated));

	const extra =
		fieldHtml("Προσανατολισμός", displayValue(property.orientation)) +
		fieldHtml("Θέα", displayValue(property.view)) +
		(isEmpty(property.notes) ? notesHtml("—") : notesHtml(displayValue(property.notes)));

	return sectionHtml("Βασικά στοιχεία", basicsHtml(property)) +
		sectionHtml("Χαρακτηριστικά", features) +
		sectionHtml("Παροχές", amenities) +
		sectionHtml("Επιπλέον στοιχεία", extra);
}

function renderProperty(property) {
	const heading = document.getElementById("details-heading");
	const title = displayValue(property.title);
	const kind = getPropertyKind(property);
	heading.textContent = title === "—" ? "Λεπτομέρειες ακινήτου" : title;
	document.title = (title === "—" ? "Ακίνητο " + property.id : title) + " | EstateDesk";

	let sections = housingSections(property);
	if (kind === "land") {
		sections = landSections(property);
	} else if (kind === "commercial") {
		sections = commercialSections(property);
	}

	return "<div class=\"details-hero\">" + photoPlaceholderHtml() +
		"<div class=\"details-hero-copy\">" +
		"<p class=\"details-kind\">" + escapeHtml(kindLabel(kind)) + "</p>" +
		"<p class=\"details-hero-id\">Κωδικός " + escapeHtml(displayValue(property.id)) + "</p>" +
		"<p class=\"details-hero-price\">" + escapeHtml(formatPrice(property.price)) + "</p>" +
		"<p class=\"details-hero-meta\">" + escapeHtml(displayValue(property.transactionType)) +
		" · " + escapeHtml(displayValue(property.propertyType)) + "</p>" +
		"<p class=\"details-hero-location\">" + escapeHtml(displayValue(property.location)) + "</p>" +
		"</div></div>" +
		sections;
}

function showMessage(message) {
	const container = document.getElementById("property-details-content");
	container.innerHTML = "<p class=\"placeholder-text\">" + escapeHtml(message) + "</p>";
	document.getElementById("property-details-actions").hidden = true;
}

function showActionError(message) {
	const error = document.getElementById("property-action-error");
	error.textContent = message;
	error.hidden = false;
}

function hideActionError() {
	const error = document.getElementById("property-action-error");
	error.textContent = "";
	error.hidden = true;
}

function showDetailActions(propertyId) {
	const actions = document.getElementById("property-details-actions");
	const editButton = document.getElementById("edit-property-button");
	editButton.href = "new-property.html?id=" + propertyId;
	actions.hidden = false;
}

async function deleteCurrentProperty(propertyId) {
	hideActionError();
	const confirmed = window.confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το ακίνητο;");
	if (!confirmed) {
		return;
	}

	try {
		const response = await fetch(API_URL + "/" + propertyId, {
			method: "DELETE"
		});

		if (response.status === 404) {
			showActionError("Δεν βρέθηκε το ακίνητο.");
			return;
		}

		if (!response.ok) {
			showActionError("Αδυναμία διαγραφής του ακινήτου.");
			return;
		}

		window.location.href = "properties.html";
	} catch (error) {
		console.error("Failed to delete property:", error);
		showActionError("Αδυναμία διαγραφής του ακινήτου.");
	}
}

async function loadPropertyDetails() {
	const params = new URLSearchParams(window.location.search);
	const propertyId = (params.get("id") || "").trim();

	if (!propertyId) {
		showMessage("Δεν δόθηκε κωδικός ακινήτου.");
		return;
	}

	if (!isPositiveInteger(propertyId)) {
		showMessage("Δεν βρέθηκε το ακίνητο.");
		return;
	}

	const container = document.getElementById("property-details-content");

	try {
		const response = await fetch(API_URL + "/" + propertyId);

		if (response.status === 404) {
			showMessage("Δεν βρέθηκε το ακίνητο.");
			return;
		}

		if (!response.ok) {
			showMessage("Αδυναμία φόρτωσης του ακινήτου.");
			return;
		}

		const property = await response.json();
		container.innerHTML = renderProperty(property);
		showDetailActions(property.id);
		document.getElementById("delete-property-button").onclick = function () {
			deleteCurrentProperty(property.id);
		};
	} catch (error) {
		console.error("Failed to load property details:", error);
		showMessage("Αδυναμία φόρτωσης του ακινήτου.");
	}
}

loadPropertyDetails();
