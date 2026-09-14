const API_URL = "http://localhost:8080/api/properties";
const LAND_TYPES = ["Οικόπεδο", "Αγροτεμάχιο"];

function displayValue(value) {
	if (value == null || value === "") {
		return "—";
	}
	return String(value);
}

function formatPrice(price) {
	if (price == null || price === "") {
		return "—";
	}
	const parsed = Number(price);
	if (!Number.isFinite(parsed)) {
		return displayValue(price);
	}
	return parsed.toLocaleString("el-GR") + "€";
}

function formatArea(squareMeters) {
	if (squareMeters == null || squareMeters === "") {
		return "—";
	}
	const parsed = Number(squareMeters);
	if (!Number.isFinite(parsed)) {
		return displayValue(squareMeters);
	}
	return parsed.toLocaleString("el-GR");
}

function isLandProperty(property) {
	return LAND_TYPES.indexOf(property.propertyType) !== -1;
}

function roomValue(property, value) {
	if (isLandProperty(property)) {
		return "—";
	}
	if (value == null || value === "") {
		return "—";
	}
	return String(value);
}

function createPropertyRow(property) {
	const row = document.createElement("tr");
	row.innerHTML =
		"<td><a class=\"property-id-link\" href=\"property-details.html?id=" + property.id + "\">" + property.id + "</a></td>" +
		"<td><div class=\"property-thumb\" aria-hidden=\"true\"><svg viewBox=\"0 0 48 36\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"1\" y=\"1\" width=\"46\" height=\"34\" rx=\"4\" fill=\"#e8eef5\" stroke=\"#c5d0dc\"/><path d=\"M10 24V16.5L24 8l14 8.5V24H10z\" fill=\"#d3deea\"/><path d=\"M18 24v-7h12v7\" fill=\"#c0cedb\"/></svg></div></td>" +
		"<td>" + displayValue(property.location) + "</td>" +
		"<td>" + displayValue(property.propertyType) + "</td>" +
		"<td>" + displayValue(property.transactionType) + "</td>" +
		"<td>" + formatPrice(property.price) + "</td>" +
		"<td>" + formatArea(property.squareMeters) + "</td>" +
		"<td>" + roomValue(property, property.bedrooms) + "</td>" +
		"<td>" + roomValue(property, property.bathrooms) + "</td>";
	return row;
}

function renderProperties(container, properties, emptyMessage) {
	if (!properties || properties.length === 0) {
		container.innerHTML = "<p class=\"placeholder-text\">" + emptyMessage + "</p>";
		return;
	}

	const table = document.createElement("table");
	table.className = "properties-table";
	table.innerHTML =
		"<thead><tr>" +
			"<th>Κωδικός</th>" +
			"<th>Εικόνα</th>" +
			"<th>Περιοχή</th>" +
			"<th>Υποκατηγορία</th>" +
			"<th>Πώληση / Ενοικίαση</th>" +
			"<th>Τιμή</th>" +
			"<th>Τ.μ.</th>" +
			"<th>Υπνοδωμάτια</th>" +
			"<th>Μπάνια</th>" +
		"</tr></thead>";

	const tbody = document.createElement("tbody");
	properties.forEach(function (property) {
		tbody.appendChild(createPropertyRow(property));
	});
	table.appendChild(tbody);

	container.innerHTML = "";
	container.appendChild(table);
}

function isPositiveInteger(value) {
	return /^[1-9]\d*$/.test(value);
}

async function loadProperties() {
	const container = document.getElementById("properties-container");

	try {
		const response = await fetch(API_URL);

		if (!response.ok) {
			container.innerHTML = "<p class=\"placeholder-text\">Αδυναμία φόρτωσης ακινήτων.</p>";
			return;
		}

		const properties = await response.json();
		renderProperties(container, properties, "Δεν υπάρχουν ακίνητα.");
	} catch (error) {
		console.error("Failed to load properties:", error);
		container.innerHTML = "<p class=\"placeholder-text\">Αδυναμία φόρτωσης ακινήτων.</p>";
	}
}

async function searchPropertyById(propertyId) {
	const container = document.getElementById("properties-container");

	try {
		const response = await fetch(API_URL + "/" + propertyId);

		if (response.status === 404) {
			container.innerHTML = "<p class=\"placeholder-text\">Δεν βρέθηκε ακίνητο με αυτό το ID.</p>";
			return;
		}

		if (!response.ok) {
			container.innerHTML = "<p class=\"placeholder-text\">Αδυναμία φόρτωσης ακινήτων.</p>";
			return;
		}

		const property = await response.json();
		renderProperties(container, [property], "Δεν βρέθηκε ακίνητο με αυτό το ID.");
	} catch (error) {
		console.error("Failed to search property:", error);
		container.innerHTML = "<p class=\"placeholder-text\">Αδυναμία φόρτωσης ακινήτων.</p>";
	}
}

const propertyIdSearchForm = document.getElementById("property-id-search-form");
const propertyIdSearchInput = document.getElementById("property-id-search");

propertyIdSearchForm.addEventListener("submit", function (event) {
	event.preventDefault();
	const propertyId = propertyIdSearchInput.value.trim();
	if (!isPositiveInteger(propertyId)) {
		return;
	}
	searchPropertyById(propertyId);
});

document.getElementById("property-id-clear").addEventListener("click", function () {
	propertyIdSearchInput.value = "";
	loadProperties();
});

loadProperties();
