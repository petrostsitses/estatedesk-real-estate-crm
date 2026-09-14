const API_URL = "http://localhost:8080/api/properties";

const subcategoriesByCategory = {
	"Κατοικία": ["Διαμέρισμα", "Studio", "Γκαρσονιέρα", "Μεζονέτα", "Μονοκατοικία", "Βίλα", "Loft", "Bungalow", "Κτίριο", "Συγκρότημα διαμερισμάτων", "Φάρμα / Ράντσο", "Πλωτό σπίτι", "Λοιπές κατηγορίες"],
	"Επαγγελματική στέγη": ["Γραφείο", "Κατάστημα", "Αποθήκη", "Βιομηχανικός χώρος", "Βιοτεχνικός χώρος", "Ξενοδοχείο", "Κτίριο επαγγελματικών χώρων", "Αίθουσα", "Εκθεσιακός χώρος διαμερισμάτων", "Λοιπές κατηγορίες"],
	"Γη": ["Οικόπεδο", "Αγροτεμάχιο", "Λοιπές κατηγορίες"]
};
const orientations = [
	"Επιλογή", "Ανατολικός", "Ανατολικοδυτικός", "Ανατολικομεσημβρινός", "Βόρειος",
	"Βορειοανατολικός", "Δυτικός", "Βορειοδυτικός", "Δυτικομεσημβρινός", "Μεσημβρινός",
	"Νότιος", "Νοτιοανατολικός", "Νοτιοδυτικός"
];
const views = [
	"Επιλογή", "Ναι", "Όχι", "Θάλασσα", "Βουνό", "Ανοιχτωσιά", "Πόλη", "Κάμπος", "Δάσος", "Πάρκο", "Πλατεία"
];
const housingFloors = ["Επιλογή", "Υπόγειο", "Ημιυπόγειο", "Ισόγειο", "Ημιώροφος", "1ος", "1ος υπερυψωμένος"]
	.concat(Array.from({ length: 49 }, function (_, index) { return String(index + 2) + "ος"; }));
const commercialFloors = ["Επιλογή", "Ασανσέρ", "Εσωτερικό ασανσέρ", "Ρετιρέ", "Τελευταίος όροφος", "Οροφοδιαμέρισμα"]
	.concat(housingFloors.slice(1));

const resultsContainer = document.getElementById("search-results");
const searchForm = document.getElementById("advanced-search-form");
const categorySelect = document.getElementById("search-category");
const subcategorySelect = document.getElementById("search-subcategory");
const housingFilters = document.getElementById("housing-filters");
const landFilters = document.getElementById("land-filters");
const commercialFilters = document.getElementById("commercial-filters");

let allProperties = [];

function fillSelect(select, options) {
	select.innerHTML = "";
	options.forEach(function (value) {
		const option = document.createElement("option");
		option.value = value === "Επιλογή" ? "" : value;
		option.textContent = value;
		select.appendChild(option);
	});
}

function updateSubcategories() {
	const category = categorySelect.value;
	subcategorySelect.innerHTML = "";
	const allOption = document.createElement("option");
	allOption.value = "";
	allOption.textContent = "Όλες";
	subcategorySelect.appendChild(allOption);

	if (!category) {
		subcategorySelect.disabled = true;
		subcategorySelect.value = "";
		return;
	}

	subcategorySelect.disabled = false;
	const subcategories = subcategoriesByCategory[category] || [];
	subcategories.forEach(function (value) {
		const option = document.createElement("option");
		option.value = value;
		option.textContent = value;
		subcategorySelect.appendChild(option);
	});
}

function selectedTypeGroup() {
	const category = categorySelect.value;
	if (category === "Κατοικία") {
		return "housing";
	}
	if (category === "Γη") {
		return "land";
	}
	if (category === "Επαγγελματική στέγη") {
		return "commercial";
	}
	return "";
}

function updateDynamicFilters() {
	const group = selectedTypeGroup();
	housingFilters.hidden = group !== "housing";
	landFilters.hidden = group !== "land";
	commercialFilters.hidden = group !== "commercial";
}

function parseNumber(value) {
	if (value == null) {
		return null;
	}
	const normalized = String(value).trim().replace(",", ".");
	if (!normalized) {
		return null;
	}
	const parsed = Number(normalized);
	return Number.isFinite(parsed) ? parsed : null;
}

function textValue(value) {
	return value == null ? "" : String(value).trim();
}

function containsIgnoreCase(source, query) {
	if (!query) {
		return true;
	}
	return textValue(source).toLocaleLowerCase("el").indexOf(query.toLocaleLowerCase("el")) !== -1;
}

function equalsIgnoreCase(source, query) {
	if (!query) {
		return true;
	}
	return textValue(source).toLocaleLowerCase("el") === query.toLocaleLowerCase("el");
}

function matchesMin(actual, minValue) {
	if (minValue == null) {
		return true;
	}
	if (actual == null || actual === "") {
		return false;
	}
	const parsed = Number(actual);
	return Number.isFinite(parsed) && parsed >= minValue;
}

function matchesMax(actual, maxValue) {
	if (maxValue == null) {
		return true;
	}
	if (actual == null || actual === "") {
		return false;
	}
	const parsed = Number(actual);
	return Number.isFinite(parsed) && parsed <= maxValue;
}

function matchesBoolean(actual, expected) {
	if (expected == null) {
		return true;
	}
	return actual === expected;
}

function parseBooleanFilter(selectId) {
	const value = document.getElementById(selectId).value;
	if (value === "true") {
		return true;
	}
	if (value === "false") {
		return false;
	}
	return null;
}

function createPropertyCard(property) {
	const card = document.createElement("article");
	card.className = "property-card";
	card.innerHTML =
		"<h3>" + property.title + "</h3>" +
		"<p><strong>Τοποθεσία:</strong> " + property.location + "</p>" +
		"<p><strong>Τιμή:</strong> " + property.price + " €</p>" +
		"<p><strong>Τύπος:</strong> " + property.propertyType + "</p>" +
		"<p><strong>Τ.μ.:</strong> " + property.squareMeters + "</p>" +
		"<p><strong>Υπνοδωμάτια:</strong> " + property.bedrooms + "</p>" +
		"<p><strong>Μπάνια:</strong> " + property.bathrooms + "</p>" +
		"<p class=\"property-description\">" + property.description + "</p>";
	return card;
}

function renderResults(properties, emptyMessage) {
	if (!properties || properties.length === 0) {
		resultsContainer.innerHTML = "<p class=\"placeholder-text\">" + emptyMessage + "</p>";
		return;
	}
	resultsContainer.innerHTML = "";
	properties.forEach(function (property) {
		resultsContainer.appendChild(createPropertyCard(property));
	});
}

function plotAreaValue(property) {
	if (property.plotArea != null && property.plotArea !== "") {
		return property.plotArea;
	}
	return property.squareMeters;
}

function matchesCategory(property, category) {
	if (!category) {
		return true;
	}
	const subcategories = subcategoriesByCategory[category] || [];
	return subcategories.indexOf(property.propertyType) !== -1;
}

function matchesFilters(property) {
	const transactionType = document.getElementById("search-transaction").value;
	const category = categorySelect.value;
	const subcategory = subcategorySelect.value;
	const locationQuery = textValue(document.getElementById("search-location").value);
	const minPrice = parseNumber(document.getElementById("search-min-price").value);
	const maxPrice = parseNumber(document.getElementById("search-max-price").value);
	const minSqm = parseNumber(document.getElementById("search-min-sqm").value);
	const maxSqm = parseNumber(document.getElementById("search-max-sqm").value);
	const group = selectedTypeGroup();

	if (!equalsIgnoreCase(property.transactionType, transactionType)) {
		return false;
	}
	if (subcategory) {
		if (!equalsIgnoreCase(property.propertyType, subcategory)) {
			return false;
		}
	} else if (!matchesCategory(property, category)) {
		return false;
	}
	if (!containsIgnoreCase(property.location, locationQuery)) {
		return false;
	}
	if (!matchesMin(property.price, minPrice) || !matchesMax(property.price, maxPrice)) {
		return false;
	}
	if (!matchesMin(property.squareMeters, minSqm) || !matchesMax(property.squareMeters, maxSqm)) {
		return false;
	}

	if (group === "housing") {
		const bedrooms = parseNumber(document.getElementById("search-bedrooms").value);
		const bathrooms = parseNumber(document.getElementById("search-bathrooms").value);
		const floor = document.getElementById("search-floor").value;
		const furnished = parseBooleanFilter("search-furnished");
		const parking = parseBooleanFilter("search-parking");
		if (!matchesMin(property.bedrooms, bedrooms) || !matchesMin(property.bathrooms, bathrooms)) {
			return false;
		}
		if (!equalsIgnoreCase(property.floor, floor)) {
			return false;
		}
		if (!matchesBoolean(property.furnished, furnished) || !matchesBoolean(property.parking, parking)) {
			return false;
		}
	}

	if (group === "land") {
		const minPlot = parseNumber(document.getElementById("search-min-plot").value);
		const maxPlot = parseNumber(document.getElementById("search-max-plot").value);
		const orientation = document.getElementById("search-orientation").value;
		const view = document.getElementById("search-view").value;
		const plotArea = plotAreaValue(property);
		if (!matchesMin(plotArea, minPlot) || !matchesMax(plotArea, maxPlot)) {
			return false;
		}
		if (!equalsIgnoreCase(property.orientation, orientation) || !equalsIgnoreCase(property.view, view)) {
			return false;
		}
	}

	if (group === "commercial") {
		const floor = document.getElementById("search-commercial-floor").value;
		const bathrooms = parseNumber(document.getElementById("search-commercial-bathrooms").value);
		const parking = parseBooleanFilter("search-commercial-parking");
		const storage = parseBooleanFilter("search-storage");
		const renovated = parseBooleanFilter("search-renovated");
		if (!equalsIgnoreCase(property.floor, floor) || !matchesMin(property.bathrooms, bathrooms)) {
			return false;
		}
		if (!matchesBoolean(property.parking, parking)
			|| !matchesBoolean(property.storage, storage)
			|| !matchesBoolean(property.renovated, renovated)) {
			return false;
		}
	}

	return true;
}

function applySearch() {
	const matches = allProperties.filter(matchesFilters);
	renderResults(matches, "Δεν βρέθηκαν ακίνητα με τα συγκεκριμένα κριτήρια.");
}

function clearFilters() {
	searchForm.reset();
	updateSubcategories();
	updateDynamicFilters();
	renderResults(allProperties, "Δεν βρέθηκαν ακίνητα με τα συγκεκριμένα κριτήρια.");
}

async function loadProperties() {
	try {
		const response = await fetch(API_URL);
		if (!response.ok) {
			resultsContainer.innerHTML = "<p class=\"placeholder-text\">Αδυναμία φόρτωσης ακινήτων.</p>";
			return;
		}
		allProperties = await response.json() || [];
		renderResults(allProperties, "Δεν βρέθηκαν ακίνητα με τα συγκεκριμένα κριτήρια.");
	} catch (error) {
		console.error("Failed to load properties:", error);
		resultsContainer.innerHTML = "<p class=\"placeholder-text\">Αδυναμία φόρτωσης ακινήτων.</p>";
	}
}

fillSelect(document.getElementById("search-floor"), housingFloors);
fillSelect(document.getElementById("search-commercial-floor"), commercialFloors);
fillSelect(document.getElementById("search-orientation"), orientations);
fillSelect(document.getElementById("search-view"), views);
updateSubcategories();
updateDynamicFilters();

categorySelect.addEventListener("change", function () {
	updateSubcategories();
	updateDynamicFilters();
});
searchForm.addEventListener("submit", function (event) {
	event.preventDefault();
	applySearch();
});
document.getElementById("advanced-search-clear").addEventListener("click", clearFilters);

loadProperties();
