document.addEventListener("DOMContentLoaded", function () {
	const API_URL = "http://localhost:8080/api/properties";
	let editPropertyId = null;
	let loadedProperty = null;

	// All options live here because this screen is UI-only for now.
	const optionGroups = {
		managers: ["Επιλογή", "Τσιτσές Πέτρος", "Παπαδοπούλου Μαρία", "Νικολάου Γιώργος"],
		owners: ["Επιλογή", "Δημιουργία νέας επαφής", "Ανδρέου Ελένη", "Κωνσταντίνου Δημήτρης"],
		listingTypes: ["Επιλογή", "Πώληση", "Ενοικίαση"],
		categories: ["Επιλογή", "Κατοικία", "Επαγγελματική στέγη", "Γη", "Λοιπά ακίνητα"],
		subcategories: ["Επιλογή", "Διαμέρισμα", "Studio", "Γκαρσονιέρα", "Μεζονέτα", "Μονοκατοικία", "Βίλα", "Loft", "Bungalow", "Κτίριο", "Συγκρότημα διαμερισμάτων", "Φάρμα / Ράντσο", "Πλωτό σπίτι", "Λοιπές κατηγορίες"],
		yesNo: ["Επιλογή", "Όχι", "Ναι"],
		assignments: ["Επιλογή", "Απλή", "Προφορική", "Αποκλειστική"],
		frames: ["Επιλογή", "Ξύλινα", "Αλουμινίου", "Συνθετικά", "Διπλά Τζάμια", "Τριπλά Τζάμια"],
		floorTypes: ["Επιλογή", "Μάρμαρο", "Ξύλο", "Πέτρα", "Πλακάκι", "Μωσαϊκό", "Laminate", "Μάρμαρο - Ξύλο", "Μάρμαρο – Πλακάκι", "Πέτρα – Ξύλο", "Πέτρα - Μάρμαρο", "Πλακάκι - Ξύλο", "Μωσαϊκό - Ξύλο", "Βιομηχανικό δάπεδο", "Μουσαμάς", "Παρκέ", "Τσιμέντο", "Γρανίτης", "Ψευδοπάτωμα", "Βινύλιο"],
		bedroomFloorTypes: ["Επιλογή", "Μάρμαρο", "Ξύλο", "Πέτρα", "Πλακάκι", "Μωσαϊκό", "Laminate", "Μάρμαρο - Ξύλο", "Μάρμαρο – Πλακάκι", "Πέτρα – Ξύλο", "Πέτρα - Μάρμαρο", "Πλακάκι - Ξύλο", "Μωσαϊκό - Ξύλο", "Βιομηχανικό δάπεδο", "Μουσαμάς"],
		heating: ["Επιλογή", "Ατομική θέρμανση", "Αυτόνομη θέρμανση", "Κεντρική θέρμανση", "Χωρίς θέρμανση", "Πετρέλαιο", "Φυσικό αέριο", "Υγραέριο", "Ρεύμα", "Σόμπα", "Θερμοσυσσωρευτής", "Θερμοπομπός", "Pellet", "Υπέρυθρες", "Fan coil", "Ξύλα", "Τηλεθέρμανση", "Γεωθερμική ενέργεια", "Αντλία θερμότητας", "Κλιματιστικό", "Ενδοδαπέδια θέρμανση", "Τζάκι"],
		energyClasses: ["Επιλογή", "Α+", "Α", "Β+", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Δεν απαιτείται", "Έκδοση σε εξέλιξη"],
		doors: ["Επιλογή", "Ασφαλείας", "Θωρακισμένη", "Απλή", "Τζαμαρία"],
		orientations: ["Επιλογή", "Ανατολικός", "Ανατολικοδυτικός", "Ανατολικομεσημβρινός", "Βόρειος", "Βορειοανατολικός", "Δυτικός", "Βορειοδυτικός", "Δυτικομεσημβρινός", "Μεσημβρινός", "Νότιος", "Νοτιοανατολικός", "Νοτιοδυτικός"],
		storage: ["Επιλογή", "Ναι", "Όχι", "Εσωτερική", "Εξωτερική"],
		placement: ["Γωνιακό", "Πρόσοψης", "Εσωτερικό", "Πλαϊνό", "Διαμπερές", "Φωτεινό", "Τριών Όψεων", "Τεσσάρων Όψεων"],
		views: ["Επιλογή", "Ναι", "Όχι", "Θάλασσα", "Βουνό", "Ανοιχτωσιά", "Πόλη", "Κάμπος", "Δάσος", "Πάρκο", "Πλατεία"],
		renovated: ["Επιλογή", "Ναι", "Όχι", "Μερικώς", "Πλήρως"],
		investment: ["Επιλογή", "Ναι", "Όχι"],
		buildingFloors: ["Επιλογή"].concat(Array.from({ length: 50 }, function (_, index) { return String(index + 1); })),
		furnished: ["Επιλογή", "Ναι", "Όχι", "Μερικώς επιπλωμένο", "Πλήρως επιπλωμένο"],
		detailsYesNo: ["Επιλογή", "Ναι", "Όχι"],
		pool: ["Επιλογή", "Όχι", "Εξωτερική", "Εσωτερική"],
		accessFrom: ["Επιλογή", "Άσφαλτος", "Πεζόδρομος", "Πλακόστρωτο", "Χωματόδρομος", "Θάλασσα", "Χωρίς πρόσβαση", "Άλλο"],
		zone: ["Επιλογή", "Οικιστική", "Εμπορική", "Αγροτική", "Βιομηχανική", "Ανάπλασης", "Εκτός σχεδίου"],
		parkingTypes: ["Επιλογή", "Εσωτερική", "Εξωτερική", "Εξωτερική (καλυμμένη)"],
		extraBenefits: ["Επιλογή", "All Inclusive (Ρεύμα, Νερό, Internet)", "Θερμομόνωση", "Θερμοπρόσοψη"],
		openPlanRooms: ["Επιλογή"].concat(Array.from({ length: 11 }, function (_, index) { return String(index); })),
		numbers0to20: Array.from({ length: 21 }, function (_, index) { return String(index); }),
		numbers1to20: ["Επιλογή"].concat(Array.from({ length: 20 }, function (_, index) { return String(index + 1); })),
		powerTypes: ["Επιλογή", "Μονοφασικό", "Τριφασικό", "Βιομηχανικό"],
		slopes: ["Επιλογή", "Επίπεδο", "Επικλινές", "Αμφιθεατρικό"],
		floors: ["Επιλογή", "Υπόγειο", "Ημιυπόγειο", "Ισόγειο", "Ημιώροφος", "1ος", "1ος υπερυψωμένος"].concat(Array.from({ length: 49 }, function (_, index) { return String(index + 2) + "ος"; })),
		commercialFloors: ["Επιλογή", "Ασανσέρ", "Εσωτερικό ασανσέρ", "Ρετιρέ", "Τελευταίος όροφος", "Οροφοδιαμέρισμα", "Υπόγειο", "Ημιυπόγειο", "Ισόγειο", "Ημιώροφος", "1ος", "1ος υπερυψωμένος"].concat(Array.from({ length: 49 }, function (_, index) { return String(index + 2) + "ος"; })),
		years: ["Επιλογή", "Υπό Κατασκευή"].concat(Array.from({ length: 227 }, function (_, index) { return String(2026 - index); })),
		locationRegions: ["Επιλογή", "Ιωάννινα", "Θεσσαλονίκη", "Αθήνα", "Πάτρα", "Λάρισα", "Βόλος", "Ηράκλειο", "Χανιά", "Κέρκυρα", "Καβάλα"],
		locationSubregions: ["Επιλογή"],
		locationNeighborhoods: ["Επιλογή"],
		mapAccuracy: ["Επιλογή", "Χωρίς εμφάνιση", "Ακριβής", "Προσεγγιστική"]
	};

	function populateSelect(select, options, defaultValue) {
		select.innerHTML = "";
		options.forEach(function (value) {
			const option = document.createElement("option");
			option.value = value;
			option.textContent = value;
			select.appendChild(option);
		});

		if (defaultValue) {
			select.value = defaultValue;
		}
	}

	// Populate every select from the approved lists above.
	document.querySelectorAll("select[data-options]").forEach(function (select) {
		const options = optionGroups[select.dataset.options] || [];
		populateSelect(select, options, select.dataset.default);
	});

	// Each category has its own exact list of available subcategories.
	const subcategoriesByCategory = {
		"Κατοικία": ["Επιλογή", "Διαμέρισμα", "Studio", "Γκαρσονιέρα", "Μεζονέτα", "Μονοκατοικία", "Βίλα", "Loft", "Bungalow", "Κτίριο", "Συγκρότημα διαμερισμάτων", "Φάρμα / Ράντσο", "Πλωτό σπίτι", "Λοιπές κατηγορίες"],
		"Επαγγελματική στέγη": ["Επιλογή", "Γραφείο", "Κατάστημα", "Αποθήκη", "Βιομηχανικός χώρος", "Βιοτεχνικός χώρος", "Ξενοδοχείο", "Κτίριο επαγγελματικών χώρων", "Αίθουσα", "Εκθεσιακός χώρος διαμερισμάτων", "Λοιπές κατηγορίες"],
		"Γη": ["Επιλογή", "Οικόπεδο", "Αγροτεμάχιο", "Λοιπές κατηγορίες"],
		"Λοιπά ακίνητα": ["Επιλογή", "Πάρκινγκ", "Επιχείρηση", "Προκατασκευασμένο", "Λυόμενο", "Αέρας", "Φωτοβολταϊκό πάρκο", "Αιολικό πάρκο", "Λοιπές κατηγορίες ακινήτων"]
	};
	const categorySelect = document.getElementById("property-category");
	const subcategorySelect = document.getElementById("property-subcategory");

	function updateSubcategories() {
		const subcategories = subcategoriesByCategory[categorySelect.value] || ["Επιλογή"];
		// Rebuilding the list also resets the selected value to the initial placeholder.
		populateSelect(subcategorySelect, subcategories, "Επιλογή");
	}

	categorySelect.addEventListener("change", function () {
		updateSubcategories();
		updateFormByCategory();
	});
	updateSubcategories();

	const storageSelect = document.getElementById("storage");
	const storageAreaField = document.getElementById("storage-area-field");
	const storageAreaInput = document.getElementById("storage-area");
	const renovatedSelect = document.getElementById("renovated");
	const renovationYearField = document.getElementById("renovation-year-field");
	const renovationYearSelect = document.getElementById("renovation-year");
	const listingTypeSelect = document.getElementById("listing-type");
	const investmentField = document.getElementById("investment-field");
	const investmentSelect = document.getElementById("investment");
	const rentalPriceField = document.getElementById("rental-price-field");
	const rentalPriceInput = document.getElementById("rental-price");
	const propertyTabs = document.getElementById("property-tabs-section");
	const locationSection = document.getElementById("location-section");
	const propertySummarySection = document.getElementById("property-summary-section");

	function updateStorageArea() {
		const hasStorage = ["Ναι", "Εσωτερική", "Εξωτερική"].includes(storageSelect.value);
		storageAreaField.hidden = !hasStorage;
		if (!hasStorage) storageAreaInput.value = "";
	}

	function updateRenovationYear() {
		const isRenovated = ["Ναι", "Μερικώς", "Πλήρως"].includes(renovatedSelect.value);
		renovationYearField.hidden = !isRenovated;
		if (!isRenovated) renovationYearSelect.value = "Επιλογή";
	}

	function updateRentalPrice() {
		const isInvestment = investmentSelect.value === "Ναι";
		rentalPriceField.hidden = !isInvestment;
		if (!isInvestment) rentalPriceInput.value = "";
	}

	function updateInvestmentField() {
		const isSale = listingTypeSelect.value === "Πώληση";
		const category = categorySelect.value;
		const isHousingForm = category !== "Γη" && category !== "Επαγγελματική στέγη";

		if (listingTypeSelect.value === "Επιλογή") {
			locationSection.hidden = true;
			propertySummarySection.hidden = false;
		}

		propertyTabs.hidden = (listingTypeSelect.value === "Επιλογή" && !editPropertyId) || !locationSection.hidden;

		if (!isHousingForm) {
			investmentField.hidden = true;
			rentalPriceField.hidden = true;
			rentalPriceInput.value = "";
			return;
		}

		investmentField.hidden = !isSale;
		if (!isSale) {
			investmentSelect.value = "Επιλογή";
			rentalPriceField.hidden = true;
			rentalPriceInput.value = "";
			return;
		}
		updateRentalPrice();
	}

	storageSelect.addEventListener("change", updateStorageArea);
	renovatedSelect.addEventListener("change", updateRenovationYear);
	listingTypeSelect.addEventListener("change", updateInvestmentField);
	investmentSelect.addEventListener("change", updateRentalPrice);
	updateStorageArea();
	updateRenovationYear();

	const areaInput = document.getElementById("area");
	const landCoefficientInput = document.getElementById("land-building-coefficient");
	const landBuildableInput = document.getElementById("land-buildable-sqm");
	const housingFields = document.getElementById("basic-fields-housing");
	const commercialFields = document.getElementById("basic-fields-commercial");
	const landFields = document.getElementById("basic-fields-land");
	const additionalTabButton = document.querySelector('[data-tab-target="additional"]');
	const detailsTabButton = document.querySelector('[data-tab-target="details"]');
	const basicTabButton = document.querySelector('[data-tab-target="basic"]');
	const sharedTabNavigations = [
		document.getElementById("basic-tab-navigation"),
		document.getElementById("additional-tab-navigation"),
		document.getElementById("details-tab-navigation")
	];
	const commercialLevelsField = document.getElementById("details-commercial-levels");
	const commercialNotesField = document.getElementById("details-commercial-notes");
	const housingShortTermField = document.getElementById("details-housing-short-term");

	function parseDecimal(value) {
		if (value == null) {
			return NaN;
		}
		const normalized = String(value).trim().replace(",", ".");
		if (normalized === "") {
			return NaN;
		}
		return Number(normalized);
	}

	function calculateBuildableSqm(areaValue, coefficientValue) {
		const area = parseDecimal(areaValue);
		const coefficient = parseDecimal(coefficientValue);
		if (!Number.isFinite(area) || !Number.isFinite(coefficient)) {
			return "";
		}
		const result = area * coefficient;
		return Number.isInteger(result) ? String(result) : String(Math.round(result * 100) / 100);
	}

	function updateBuildableSqm() {
		landBuildableInput.value = calculateBuildableSqm(areaInput.value, landCoefficientInput.value);
	}

	areaInput.addEventListener("input", updateBuildableSqm);
	landCoefficientInput.addEventListener("input", updateBuildableSqm);

	const tabButtons = document.querySelectorAll("[data-tab-target]");
	const tabPanes = document.querySelectorAll("[data-tab-pane]");

	function showTab(tabName) {
		tabButtons.forEach(function (button) {
			const isActive = button.dataset.tabTarget === tabName;
			button.classList.toggle("active", isActive);
			button.setAttribute("aria-selected", String(isActive));
		});
		tabPanes.forEach(function (pane) { pane.hidden = pane.dataset.tabPane !== tabName; });
	}

	tabButtons.forEach(function (button) {
		button.addEventListener("click", function () { showTab(button.dataset.tabTarget); });
	});

	// The feature lists begin with all approved features in the available column.
	const housingFeatures = ["Playroom", "Βαμμένο", "Βεράντα", "Για εργαζόμενους", "Για οικογένειες", "Για φοιτητές", "Δίκτυο Αποχέτευσης", "Διατηρητέο", "Δορυφορική κεραία", "Εξοχικό", "Επιτρέπονται κατοικίδια", "Εσωτερική σκάλα", "Ηλιακός θερμοσίφωνας", "Ημιτελές", "Κήπος", "Καλωδιακή τηλεόραση", "Κατάλληλο για επαγγελματική χρήση", "Κατάλληλο για ιατρικό γραφείο", "Με εξοπλισμό", "Νεοκλασικό", "Νυχτερινό ρεύμα", "Πολυτελές", "Σίτες", "Σε κεντρικό σημείο", "Σοφίτα", "Συναγερμός", "Τέντα", "Ψευδοροφή"];
	const commercialFeatures = ["Playroom", "Ανελκυστήρας φορτίων", "Βαμμένο", "Βεράντα", "Δίκτυο Αποχέτευσης", "Διατηρητέο", "Δομημένη καλωδίωση", "Δορυφορική κεραία", "Εσωτερική σκάλα", "Ηλιακός θερμοσίφωνας", "Ημιτελές", "Κήπος", "Καλωδιακή τηλεόραση", "Κατάλληλο για ιατρικό γραφείο", "Με εξοπλισμό", "Νεοκλασικό", "Νυχτερινό ρεύμα", "Οικιστική περιοχή", "Πολυτελές", "Ράμπα εκφόρτωσης", "Ρολλά ασφαλείας", "Σίτες", "Σε κεντρικό σημείο", "Σοφίτα", "Συναγερμός", "Τέντα", "Υγειονομικής χρήσης", "Φουγάρο", "Ψευδοροφή"];
	const availableFeatures = document.getElementById("available-features");
	const includedFeatures = document.getElementById("included-features");

	function fillFeatureList(select, features) {
		select.innerHTML = "";
		features.forEach(function (feature) {
			const option = document.createElement("option");
			option.value = feature;
			option.textContent = feature;
			select.appendChild(option);
		});
	}

	function resetFeatures(features) {
		includedFeatures.innerHTML = "";
		fillFeatureList(availableFeatures, features);
	}

	function updateFormByCategory() {
		const category = categorySelect.value;
		const isLand = category === "Γη";
		const isCommercial = category === "Επαγγελματική στέγη";
		const isHousingForm = !isLand && !isCommercial;

		locationSection.hidden = true;
		propertySummarySection.hidden = false;
		housingFields.hidden = !isHousingForm;
		commercialFields.hidden = !isCommercial;
		landFields.hidden = !isLand;
		additionalTabButton.hidden = isLand;
		detailsTabButton.hidden = isLand;
		sharedTabNavigations.forEach(function (navigation) {
			navigation.hidden = isLand;
		});
		basicTabButton.textContent = isHousingForm ? "Βασικά" : "Βασικές Πληροφορίες";
		commercialLevelsField.hidden = !isCommercial;
		commercialNotesField.hidden = !isCommercial;
		housingShortTermField.hidden = isCommercial;
		resetFeatures(isCommercial ? commercialFeatures : housingFeatures);
		if (isLand) {
			showTab("basic");
		}
		updateInvestmentField();
		updateBuildableSqm();
	}

	updateFormByCategory();

	const DEFAULT_LAT = 39.6650;
	const DEFAULT_LNG = 20.8537;
	const locationLatInput = document.getElementById("location-lat");
	const locationLngInput = document.getElementById("location-lng");
	let locationMap = null;
	let locationMarker = null;

	function initLocationMap() {
		if (locationMap || typeof L === "undefined") {
			if (locationMap) {
				locationMap.invalidateSize();
			}
			return;
		}

		locationMap = L.map("location-map").setView([DEFAULT_LAT, DEFAULT_LNG], 15);
		L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
			maxZoom: 20,
			subdomains: "abcd",
			attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>"
		}).addTo(locationMap);
		locationMarker = L.marker([DEFAULT_LAT, DEFAULT_LNG], { draggable: true }).addTo(locationMap);
		locationMarker.on("dragend", function () {
			const position = locationMarker.getLatLng();
			locationLatInput.value = position.lat.toFixed(6);
			locationLngInput.value = position.lng.toFixed(6);
		});
	}

	function syncMarkerFromInputs() {
		if (!locationMarker || !locationMap) {
			return;
		}
		const lat = Number(String(locationLatInput.value).trim().replace(",", "."));
		const lng = Number(String(locationLngInput.value).trim().replace(",", "."));
		if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
			return;
		}
		locationMarker.setLatLng([lat, lng]);
		locationMap.setView([lat, lng]);
	}

	function showLocationStep() {
		if (!editPropertyId && listingTypeSelect.value === "Επιλογή") {
			return;
		}
		locationSection.hidden = false;
		propertySummarySection.hidden = true;
		propertyTabs.hidden = true;
		initLocationMap();
		window.setTimeout(function () {
			if (locationMap) {
				locationMap.invalidateSize();
			}
		}, 0);
	}

	function showCategoryStep() {
		locationSection.hidden = true;
		propertySummarySection.hidden = false;
		document.getElementById("location-next-message").hidden = true;
		updateInvestmentField();
		if (categorySelect.value === "Γη") {
			showTab("basic");
			return;
		}
		showTab("details");
	}

	locationLatInput.addEventListener("change", syncMarkerFromInputs);
	locationLngInput.addEventListener("change", syncMarkerFromInputs);
	locationLatInput.addEventListener("input", syncMarkerFromInputs);
	locationLngInput.addEventListener("input", syncMarkerFromInputs);

	const locationGeocodeError = document.getElementById("location-geocode-error");
	const locationActualAddressInput = document.getElementById("location-actual-address");
	const locationAddressSuggestions = document.getElementById("location-address-suggestions");
	const locationAddressSearch = locationActualAddressInput.closest(".location-address-search");
	let locationGeocodeTimer = null;
	let locationGeocodeController = null;
	let lastSelectedAddressQuery = "";

	function applyGeocodedPosition(lat, lng) {
		locationLatInput.value = Number(lat).toFixed(6);
		locationLngInput.value = Number(lng).toFixed(6);
		if (!locationMarker || !locationMap) {
			return;
		}
		locationMarker.setLatLng([lat, lng]);
		locationMap.setView([lat, lng], 17);
	}

	function hideAddressSuggestions() {
		locationAddressSuggestions.hidden = true;
		locationAddressSuggestions.innerHTML = "";
	}

	function formatPhotonLabel(properties) {
		const streetLine = [properties.street || properties.name, properties.housenumber].filter(Boolean).join(" ");
		const city = properties.city || properties.town || properties.village || properties.locality || properties.county || properties.state;
		const parts = [];
		if (streetLine) {
			parts.push(streetLine);
		} else if (properties.name) {
			parts.push(properties.name);
		}
		if (city && parts.indexOf(city) === -1) {
			parts.push(city);
		}
		parts.push("Ελλάδα");
		return parts.join(", ");
	}

	function renderAddressSuggestions(features) {
		locationAddressSuggestions.innerHTML = "";
		features.forEach(function (feature) {
			const coordinates = feature.geometry && feature.geometry.coordinates;
			if (!coordinates || coordinates.length < 2) {
				return;
			}
			const label = formatPhotonLabel(feature.properties || {});
			const option = document.createElement("button");
			option.type = "button";
			option.className = "location-address-option";
			option.textContent = label;
			option.addEventListener("click", function () {
				lastSelectedAddressQuery = label;
				locationActualAddressInput.value = label;
				applyGeocodedPosition(coordinates[1], coordinates[0]);
				locationGeocodeError.hidden = true;
				hideAddressSuggestions();
			});
			locationAddressSuggestions.appendChild(option);
		});
		locationAddressSuggestions.hidden = locationAddressSuggestions.children.length === 0;
		if (locationAddressSuggestions.hidden) {
			locationGeocodeError.textContent = "Δεν βρέθηκαν διευθύνσεις στην Ελλάδα.";
			locationGeocodeError.hidden = false;
		}
	}

	function searchAddressSuggestions(query) {
		if (locationGeocodeController) {
			locationGeocodeController.abort();
		}
		locationGeocodeController = new AbortController();
		const url = "https://photon.komoot.io/api/?lang=default&limit=8"
			+ "&lat=39.0742&lon=21.8243"
			+ "&bbox=19.3,34.8,29.65,41.8"
			+ "&q=" + encodeURIComponent(query);

		fetch(url, {
			headers: { "Accept": "application/json" },
			signal: locationGeocodeController.signal
		}).then(function (response) {
			if (!response.ok) {
				return response.text().then(function (body) {
					const error = new Error("Photon HTTP " + response.status);
					error.status = response.status;
					error.url = url;
					error.body = body;
					throw error;
				});
			}
			return response.json();
		}).then(function (payload) {
			const features = (payload && payload.features ? payload.features : []).filter(function (feature) {
				const countryCode = feature.properties && feature.properties.countrycode;
				return !countryCode || countryCode === "GR";
			});
			if (!features.length) {
				hideAddressSuggestions();
				locationGeocodeError.textContent = "Δεν βρέθηκαν διευθύνσεις στην Ελλάδα.";
				locationGeocodeError.hidden = false;
				return;
			}
			locationGeocodeError.hidden = true;
			renderAddressSuggestions(features);
		}).catch(function (error) {
			if (error && error.name === "AbortError") {
				return;
			}
			console.error("Photon address search failed", {
				error: error,
				url: url,
				status: error && error.status,
				body: error && error.body
			});
			hideAddressSuggestions();
			locationGeocodeError.textContent = "Αποτυχία αναζήτησης διεύθυνσης. Η προηγούμενη θέση διατηρήθηκε.";
			locationGeocodeError.hidden = false;
		});
	}

	locationActualAddressInput.addEventListener("input", function () {
		const query = locationActualAddressInput.value.trim();
		locationGeocodeError.hidden = true;
		window.clearTimeout(locationGeocodeTimer);
		if (locationGeocodeController) {
			locationGeocodeController.abort();
			locationGeocodeController = null;
		}
		if (query.length < 3 || query === lastSelectedAddressQuery) {
			hideAddressSuggestions();
			return;
		}
		locationGeocodeTimer = window.setTimeout(function () {
			searchAddressSuggestions(query);
		}, 500);
	});

	document.addEventListener("click", function (event) {
		if (!locationAddressSearch.contains(event.target)) {
			hideAddressSuggestions();
		}
	});
	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape") {
			hideAddressSuggestions();
		}
	});

	const locationRegionSelect = document.getElementById("location-region");
	const locationSubregionSelect = document.getElementById("location-subregion");
	const locationNeighborhoodSelect = document.getElementById("location-neighborhood");
	const locationPostalInput = document.getElementById("location-postal-code");
	const locationHierarchy = {
		"Ιωάννινα": {
			"Κέντρο": { postal: "45221", neighborhoods: { "Πλατεία Πύρρου": "45221", "Αρχιεπισκόπου Μακαρίου": "45221", "Περίβλεπτος": "45221" } },
			"Ανατολή": { postal: "45500", neighborhoods: { "Άνω Ανατολή": "45500", "Κάτω Ανατολή": "45500", "Νέα Ανατολή": "45500" } },
			"Κατσικά": { postal: "45500", neighborhoods: { "Κάτω Κατσικά": "45500", "Άνω Κατσικά": "45500" } },
			"Πέραμα": { postal: "45500", neighborhoods: { "Λίμνη Παμβώτιδα": "45500", "Παραλίμνιο": "45500" } },
			"Νεοχωρόπουλο": { postal: "45500", neighborhoods: { "Κέντρο Νεοχωρόπουλου": "45500", "Είσοδος πόλης": "45500" } },
			"Βελισσάριο": { postal: "45221", neighborhoods: { "Νοσοκομείο": "45221", "Κάτω Βελισσάριο": "45221" } },
			"Καλούτσιανη": { postal: "45221", neighborhoods: { "Άνω Καλούτσιανη": "45221", "Κάτω Καλούτσιανη": "45221" } }
		},
		"Θεσσαλονίκη": {
			"Κέντρο": { postal: "54622", neighborhoods: { "Αγίας Σοφίας": "54622", "Καμάρα": "54622", "Ναυαρίνου": "54622" } },
			"Τούμπα": { postal: "54453", neighborhoods: { "Άνω Τούμπα": "54453", "Κάτω Τούμπα": "54453", "Μαρτίου": "54248" } },
			"Καλαμαριά": { postal: "55132", neighborhoods: { "Βυζάντιο": "55132", "Αρετσού": "55132", "Νέα Κρήνη": "55132" } },
			"Πυλαία": { postal: "55535", neighborhoods: { "Πανόραμα": "55236", "Κέντρο Πυλαίας": "55535" } },
			"Νεάπολη": { postal: "56727", neighborhoods: { "Άγιος Παντελεήμων": "56727", "Συκιές": "56625" } },
			"Εύοσμος": { postal: "56224", neighborhoods: { "Κέντρο Ευόσμου": "56224", "Κορδελιό": "56334" } }
		},
		"Αθήνα": {
			"Κέντρο": { postal: "10558", neighborhoods: { "Μοναστηράκι": "10555", "Ψυρρή": "10554", "Εξάρχεια": "10681" } },
			"Παγκράτι": { postal: "11633", neighborhoods: { "Άγιος Σπυρίδωνας": "11635", "Ιλίσια": "11528" } },
			"Κυψέλη": { postal: "11362", neighborhoods: { "Άνω Κυψέλη": "11364", "Κάτω Κυψέλη": "11362" } },
			"Αμπελόκηποι": { postal: "11522", neighborhoods: { "Πανόρμου": "11523", "Μαβίλης": "11522" } },
			"Πατήσια": { postal: "11141", neighborhoods: { "Άνω Πατήσια": "11141", "Κάτω Πατήσια": "11143" } },
			"Κολωνάκι": { postal: "10673", neighborhoods: { "Δεξαμενή": "10680", "Λυκαβηττός": "10675" } }
		},
		"Πάτρα": {
			"Κέντρο": { postal: "26221", neighborhoods: { "Ψηλαλώνια": "26221", "Αγίου Νικολάου": "26221" } },
			"Αγυιά": { postal: "26442", neighborhoods: { "Άνω Αγυιά": "26442", "Κάτω Αγυιά": "26442" } },
			"Εγλυκάδα": { postal: "26332", neighborhoods: { "Κέντρο Εγλυκάδας": "26332" } },
			"Ζαρουχλέικα": { postal: "26334", neighborhoods: { "Παραλιακή": "26334" } },
			"Προάστιο": { postal: "26442", neighborhoods: { "Νέο Προάστιο": "26442" } }
		},
		"Λάρισα": {
			"Κέντρο": { postal: "41222", neighborhoods: { "Φρουρίου": "41222", "Ταχυδρομείου": "41222" } },
			"Νεάπολη": { postal: "41334", neighborhoods: { "Άγιος Θωμάς": "41334" } },
			"Φιλιππούπολη": { postal: "41335", neighborhoods: { "Νέα Φιλιππούπολη": "41335" } },
			"Άγιος Γεώργιος": { postal: "41336", neighborhoods: { "Κέντρο Αγίου Γεωργίου": "41336" } },
			"Ιπποκράτης": { postal: "41335", neighborhoods: { "Νοσοκομείο": "41335" } }
		},
		"Βόλος": {
			"Κέντρο": { postal: "38221", neighborhoods: { "Παραλία": "38221", "Αγίου Κωνσταντίνου": "38221" } },
			"Νέα Ιωνία": { postal: "38446", neighborhoods: { "Κέντρο Νέας Ιωνίας": "38446" } },
			"Άγιος Κωνσταντίνος": { postal: "38222", neighborhoods: { "Παραλιακή ζώνη": "38222" } },
			"Ανακασιά": { postal: "38500", neighborhoods: { "Κέντρο Ανακασιάς": "38500" } },
			"Πορταριά": { postal: "37011", neighborhoods: { "Πλατεία Πορταριάς": "37011" } }
		},
		"Ηράκλειο": {
			"Κέντρο": { postal: "71201", neighborhoods: { "Λιμάνι": "71202", "Αγία Τριάδα": "71201" } },
			"Πόρος": { postal: "71307", neighborhoods: { "Κάτω Πόρος": "71307" } },
			"Νέα Αλικαρνασσός": { postal: "71601", neighborhoods: { "Αεροδρόμιο": "71601" } },
			"Γάζι": { postal: "71414", neighborhoods: { "Κέντρο Γαζίου": "71414" } },
			"Κνωσός": { postal: "71409", neighborhoods: { "Αρχαιολογικός χώρος": "71409" } }
		},
		"Χανιά": {
			"Κέντρο": { postal: "73131", neighborhoods: { "Παλιά Πόλη": "73100", "Σπλάντζια": "73131" } },
			"Χαλέπα": { postal: "73133", neighborhoods: { "Κυβερνείο": "73133" } },
			"Νέα Χώρα": { postal: "73136", neighborhoods: { "Παραλία Νέας Χώρας": "73136" } },
			"Σούδα": { postal: "73200", neighborhoods: { "Λιμάνι Σούδας": "73200" } },
			"Κουνουπιδιανά": { postal: "73100", neighborhoods: { "Πανεπιστήμιο": "73100" } }
		},
		"Κέρκυρα": {
			"Κέντρο": { postal: "49100", neighborhoods: { "Σπιανάδα": "49100", "Καμπίελο": "49100" } },
			"Γαρίτσα": { postal: "49100", neighborhoods: { "Παραλία Γαρίτσας": "49100" } },
			"Κανόνι": { postal: "49100", neighborhoods: { "Ποντικονήσι": "49100" } },
			"Παλαιοκαστρίτσα": { postal: "49036", neighborhoods: { "Λιμανάκι": "49036" } },
			"Γουβιά": { postal: "49083", neighborhoods: { "Μαρίνα": "49083" } }
		},
		"Καβάλα": {
			"Κέντρο": { postal: "65302", neighborhoods: { "Παλιά Πόλη": "65302", "Λιμάνι": "65302" } },
			"Αγία Βαρβάρα": { postal: "65403", neighborhoods: { "Κέντρο Αγίας Βαρβάρας": "65403" } },
			"Χίλια": { postal: "65500", neighborhoods: { "Κάτω Χίλια": "65500" } },
			"Νέα Καρβάλη": { postal: "64006", neighborhoods: { "Παραλία": "64006" } },
			"Αμυγδαλεώνας": { postal: "64012", neighborhoods: { "Κέντρο Αμυγδαλεώνα": "64012" } }
		}
	};

	function currentRegionData() {
		return locationHierarchy[locationRegionSelect.value] || null;
	}

	function currentSubregionData() {
		const region = currentRegionData();
		if (!region) {
			return null;
		}
		return region[locationSubregionSelect.value] || null;
	}

	function updateLocationNeighborhoods() {
		const subregion = currentSubregionData();
		const neighborhoods = subregion ? Object.keys(subregion.neighborhoods) : [];
		populateSelect(locationNeighborhoodSelect, ["Επιλογή"].concat(neighborhoods), "Επιλογή");
		locationPostalInput.value = subregion ? subregion.postal : "";
	}

	function updateLocationSubregions() {
		const region = currentRegionData();
		const subregions = region ? Object.keys(region) : [];
		populateSelect(locationSubregionSelect, ["Επιλογή"].concat(subregions), "Επιλογή");
		updateLocationNeighborhoods();
	}

	locationRegionSelect.addEventListener("change", updateLocationSubregions);
	locationSubregionSelect.addEventListener("change", updateLocationNeighborhoods);
	locationNeighborhoodSelect.addEventListener("change", function () {
		const subregion = currentSubregionData();
		if (!subregion) {
			locationPostalInput.value = "";
			return;
		}
		const neighborhoodPostal = subregion.neighborhoods[locationNeighborhoodSelect.value];
		locationPostalInput.value = neighborhoodPostal || subregion.postal;
	});
	updateLocationSubregions();
	document.getElementById("open-google-maps-coords").addEventListener("click", function () {
		const query = locationLatInput.value.trim() + "," + locationLngInput.value.trim();
		window.open("https://www.google.com/maps?q=" + encodeURIComponent(query), "_blank", "noopener");
	});
	document.getElementById("open-google-maps-address").addEventListener("click", function () {
		const address = document.getElementById("location-display-el").value.trim()
			|| document.getElementById("location-actual-address").value.trim()
			|| document.getElementById("location-display-en").value.trim();
		if (!address) {
			return;
		}
		window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address), "_blank", "noopener");
	});
	document.getElementById("previous-from-location").addEventListener("click", showCategoryStep);

	function parseApiNumber(value) {
		if (value == null) {
			return NaN;
		}
		const normalized = String(value).trim().replace(",", ".");
		if (!normalized) {
			return NaN;
		}
		return Number(normalized);
	}

	function parseOptionalNumber(value) {
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

	function parseOptionalYear(value) {
		const text = selectedValueFromRaw(value);
		if (!text) {
			return null;
		}
		const year = parseInt(text, 10);
		return Number.isFinite(year) ? year : null;
	}

	function selectedValueFromRaw(value) {
		const text = String(value == null ? "" : value).trim();
		return text === "Επιλογή" ? "" : text;
	}

	function selectedValue(id) {
		const field = document.getElementById(id);
		if (!field) {
			return "";
		}
		return selectedValueFromRaw(field.value);
	}

	function optionalBoolean(value) {
		const text = selectedValueFromRaw(value);
		if (!text) {
			return null;
		}
		if (text === "Όχι") {
			return false;
		}
		return true;
	}

	function checkedJoined(selector) {
		const values = Array.from(document.querySelectorAll(selector))
			.filter(function (input) { return input.checked; })
			.map(function (input) { return input.value; });
		return values.length ? values.join(", ") : null;
	}

	function parkingBoolean(typeId, countId) {
		const type = selectedValue(typeId);
		const count = parseOptionalNumber(document.getElementById(countId) && document.getElementById(countId).value);
		if (type || (count != null && count > 0)) {
			return true;
		}
		return null;
	}

	function collectPropertyPayload() {
		const category = categorySelect.value;
		const subcategory = selectedValue("property-subcategory");
		const region = selectedValue("location-region");
		const actualAddress = document.getElementById("location-actual-address").value.trim();
		const displayAddress = document.getElementById("location-display-el").value.trim();
		const location = actualAddress || region || displayAddress;
		const title = [subcategory || selectedValue("property-category"), region || location].filter(Boolean).join(" — ");
		const description = actualAddress || displayAddress
			|| [region, selectedValue("location-subregion"), selectedValue("location-neighborhood")].filter(Boolean).join(", ");
		let bedrooms = 0;
		let bathrooms = 0;
		if (category === "Επαγγελματική στέγη") {
			bathrooms = parseApiNumber(document.getElementById("commercial-bathrooms").value);
		} else if (category !== "Γη") {
			bedrooms = parseApiNumber(document.getElementById("bedrooms").value);
			bathrooms = parseApiNumber(document.getElementById("bathrooms").value);
		}
		if (!Number.isFinite(bedrooms) || bedrooms < 0) {
			bedrooms = 0;
		}
		if (!Number.isFinite(bathrooms) || bathrooms < 0) {
			bathrooms = 0;
		}

		const isCommercial = category === "Επαγγελματική στέγη";
		const isLand = category === "Γη";
		const floor = isLand ? null : (isCommercial ? selectedValue("commercial-floor") : selectedValue("floor")) || null;
		const yearBuilt = parseOptionalYear(isLand ? "" : (isCommercial
			? selectedValue("commercial-year-built")
			: selectedValue("year-built")));
		const heating = isLand ? null : checkedJoined(isCommercial
			? "#commercial-heating-panel input[type=checkbox]"
			: "#heating-panel input[type=checkbox]");
		const energyClass = isLand ? null : (isCommercial
			? selectedValue("commercial-energy-class")
			: selectedValue("energy-class")) || null;
		const furnished = isLand ? null : optionalBoolean(selectedValue("furnished"));
		const parking = isLand ? null : parkingBoolean(
			isCommercial ? "commercial-parking-type" : "parking-type",
			isCommercial ? "commercial-parking-count" : "parking-count"
		);
		const storage = isLand ? null : optionalBoolean(isCommercial
			? selectedValue("commercial-storage")
			: selectedValue("storage"));
		const renovated = isLand ? null : optionalBoolean(isCommercial
			? selectedValue("commercial-renovated")
			: selectedValue("renovated"));
		const orientation = (isLand
			? selectedValue("land-orientation")
			: isCommercial
				? selectedValue("commercial-orientation")
				: selectedValue("orientation")) || null;
		const view = (isLand
			? selectedValue("land-view")
			: isCommercial
				? selectedValue("commercial-view")
				: selectedValue("view")) || null;
		const balconyArea = isLand ? null : parseOptionalNumber(document.getElementById("balcony-area") && document.getElementById("balcony-area").value);
		const plotFromDetails = parseOptionalNumber(document.getElementById("plot-area") && document.getElementById("plot-area").value);
		const plotArea = plotFromDetails != null ? plotFromDetails : (isLand ? parseOptionalNumber(document.getElementById("area").value) : null);
		const notesField = document.getElementById("commercial-notes");
		const notes = isCommercial && notesField ? (notesField.value.trim() || null) : null;

		const payload = {
			title: title,
			description: description,
			location: location,
			propertyType: subcategory || selectedValue("property-category") || null,
			price: parseApiNumber(document.getElementById("price").value),
			bedrooms: bedrooms,
			bathrooms: bathrooms,
			squareMeters: parseApiNumber(document.getElementById("area").value),
			floor: floor,
			yearBuilt: yearBuilt,
			heating: heating,
			energyClass: energyClass,
			furnished: furnished,
			parking: parking,
			storage: storage,
			renovated: renovated,
			orientation: orientation,
			view: view,
			balconyArea: balconyArea,
			plotArea: plotArea,
			notes: notes,
			transactionType: selectedValue("listing-type") || null
		};

		if (loadedProperty) {
			payload.title = loadedProperty.title || payload.title;
			payload.description = loadedProperty.description || payload.description;
			if (!payload.location) {
				payload.location = loadedProperty.location;
			}
			if (!payload.notes) {
				payload.notes = loadedProperty.notes || null;
			}
		}

		return payload;
	}

	function isValidPropertyPayload(propertyData) {
		return propertyData.title
			&& propertyData.description
			&& propertyData.location
			&& Number.isFinite(propertyData.price) && propertyData.price > 0
			&& Number.isFinite(propertyData.squareMeters) && propertyData.squareMeters > 0
			&& Number.isFinite(propertyData.bedrooms) && propertyData.bedrooms >= 0
			&& Number.isFinite(propertyData.bathrooms) && propertyData.bathrooms >= 0;
	}

	const savePropertyButton = document.getElementById("location-next-step");
	const savePropertyMessage = document.getElementById("location-next-message");
	let savePropertyInFlight = false;

	savePropertyButton.addEventListener("click", function () {
		if (savePropertyInFlight) {
			return;
		}
		savePropertyMessage.hidden = true;
		const propertyData = collectPropertyPayload();
		if (!isValidPropertyPayload(propertyData)) {
			savePropertyMessage.textContent = "Συμπληρώστε τιμή, εμβαδό, τύπο ακινήτου και τοποθεσία πριν την αποθήκευση.";
			savePropertyMessage.hidden = false;
			return;
		}

		const isEdit = editPropertyId != null;
		const requestUrl = isEdit ? API_URL + "/" + editPropertyId : API_URL;
		const requestMethod = isEdit ? "PUT" : "POST";

		savePropertyInFlight = true;
		savePropertyButton.disabled = true;
		fetch(requestUrl, {
			method: requestMethod,
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(propertyData)
		}).then(function (response) {
			return response.text().then(function (text) {
				let body = null;
				if (text) {
					try {
						body = JSON.parse(text);
					} catch (parseError) {
						body = text;
					}
				}
				if (!response.ok) {
					const error = new Error(requestMethod + " " + requestUrl + " failed");
					error.status = response.status;
					error.body = body;
					throw error;
				}
				return body;
			});
		}).then(function () {
			if (isEdit) {
				window.location.href = "property-details.html?id=" + editPropertyId;
				return;
			}
			savePropertyMessage.textContent = "Το ακίνητο δημιουργήθηκε επιτυχώς.";
			savePropertyMessage.hidden = false;
		}).catch(function (error) {
			console.error("Failed to save property", error, error && error.status, error && error.body);
			savePropertyMessage.textContent = isEdit
				? "Δεν ήταν δυνατή η αποθήκευση των αλλαγών."
				: "Δεν ήταν δυνατή η αποθήκευση του ακινήτου.";
			savePropertyMessage.hidden = false;
		}).finally(function () {
			savePropertyInFlight = false;
			savePropertyButton.disabled = false;
		});
	});

	function moveSelectedFeatures(fromList, toList) {
		Array.from(fromList.selectedOptions).forEach(function (option) { toList.appendChild(option); });
	}

	document.getElementById("add-feature").addEventListener("click", function () {
		moveSelectedFeatures(availableFeatures, includedFeatures);
	});
	document.getElementById("remove-feature").addEventListener("click", function () {
		moveSelectedFeatures(includedFeatures, availableFeatures);
	});
	document.getElementById("previous-to-basic").addEventListener("click", function () { showTab("basic"); });
	document.getElementById("next-to-additional").addEventListener("click", function () { showTab("additional"); });
	document.getElementById("next-to-details").addEventListener("click", function () { showTab("details"); });
	document.getElementById("previous-to-additional").addEventListener("click", function () { showTab("additional"); });
	document.getElementById("complete-property").addEventListener("click", showLocationStep);
	document.getElementById("land-next-step").addEventListener("click", showLocationStep);

	// Compact selector: selected furniture and appliances appear as removable tags.
	const applianceOptions = ["Κρεβάτι", "Ντουλάπα", "Τραπέζι σαλονιού", "Τραπέζι κουζίνας", "Καναπές", "Έπιπλο χωλ", "Γραφείο", "Πλυντήριο ρούχων", "Πλυντήριο πιάτων", "Φούρνος εντοιχισμένος", "Φούρνος κανονικός", "Φουρνάκι", "Ψυγείο", "Τηλεόραση"];
	const applianceSelector = document.getElementById("appliance-selector");
	const applianceControl = document.getElementById("appliance-control");
	const applianceInput = document.getElementById("appliance-input");
	const applianceTags = document.getElementById("appliance-tags");
	const applianceSuggestions = document.getElementById("appliance-suggestions");
	const selectedAppliances = [];

	function renderApplianceSelector() {
		const filter = applianceInput.value.trim().toLocaleLowerCase("el");
		applianceTags.innerHTML = "";
		selectedAppliances.forEach(function (appliance) {
			const tag = document.createElement("button");
			tag.type = "button";
			tag.className = "appliance-tag";
			tag.textContent = appliance + " ×";
			tag.addEventListener("click", function () {
				selectedAppliances.splice(selectedAppliances.indexOf(appliance), 1);
				renderApplianceSelector();
			});
			applianceTags.appendChild(tag);
		});

		applianceSuggestions.innerHTML = "";
		applianceOptions.filter(function (appliance) {
			return !selectedAppliances.includes(appliance) && appliance.toLocaleLowerCase("el").includes(filter);
		}).forEach(function (appliance) {
			const option = document.createElement("button");
			option.type = "button";
			option.className = "appliance-option";
			option.textContent = appliance;
			option.addEventListener("click", function () {
				selectedAppliances.push(appliance);
				applianceInput.value = "";
				renderApplianceSelector();
				applianceInput.focus();
			});
			applianceSuggestions.appendChild(option);
		});
	}

	function openApplianceSuggestions() {
		renderApplianceSelector();
		applianceSuggestions.hidden = false;
	}

	applianceControl.addEventListener("click", function () { applianceInput.focus(); });
	applianceInput.addEventListener("focus", openApplianceSuggestions);
	applianceInput.addEventListener("input", openApplianceSuggestions);
	document.addEventListener("click", function (event) {
		if (!applianceSelector.contains(event.target)) applianceSuggestions.hidden = true;
	});
	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape") applianceSuggestions.hidden = true;
	});
	renderApplianceSelector();

	const multiSelectFields = document.querySelectorAll("[data-multiselect]");

	function closeMultiSelect(field) {
		const trigger = field.querySelector(".multi-select-trigger");
		const panel = field.querySelector(".multi-select-panel");
		panel.hidden = true;
		trigger.setAttribute("aria-expanded", "false");
	}

	function updateMultiSelectSummary(field) {
		const selected = Array.from(field.querySelectorAll("input:checked"), function (input) {
			return input.value;
		});
		const summary = field.querySelector(".multi-select-summary");
		summary.textContent = selected.length === 0 ? "Επιλογή" : selected.join(", ");
	}

	multiSelectFields.forEach(function (field) {
		const trigger = field.querySelector(".multi-select-trigger");
		const panel = field.querySelector(".multi-select-panel");
		const checkboxes = field.querySelectorAll("input[type=checkbox]");

		trigger.addEventListener("click", function () {
			const willOpen = panel.hidden;
			multiSelectFields.forEach(function (otherField) {
				if (otherField !== field) closeMultiSelect(otherField);
			});
			panel.hidden = !willOpen;
			trigger.setAttribute("aria-expanded", String(willOpen));
		});

		checkboxes.forEach(function (checkbox) {
			checkbox.addEventListener("change", function () { updateMultiSelectSummary(field); });
		});
	});

	document.addEventListener("click", function (event) {
		multiSelectFields.forEach(function (field) {
			if (!field.contains(event.target)) closeMultiSelect(field);
		});
	});

	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape") multiSelectFields.forEach(closeMultiSelect);
	});

	const ownerSelect = document.getElementById("owner");
	const modal = document.getElementById("contact-modal");
	const closeButtons = document.querySelectorAll(".modal-close");

	function openModal() {
		modal.hidden = false;
		document.getElementById("contact-name").focus();
	}

	function closeModal() {
		modal.hidden = true;
	}

	document.getElementById("open-contact-modal").addEventListener("click", openModal);
	ownerSelect.addEventListener("change", function () {
		if (ownerSelect.value === "Δημιουργία νέας επαφής") {
			openModal();
			ownerSelect.value = "Επιλογή";
		}
	});
	closeButtons.forEach(function (button) { button.addEventListener("click", closeModal); });
	modal.addEventListener("click", function (event) { if (event.target === modal) closeModal(); });
	document.addEventListener("keydown", function (event) { if (event.key === "Escape" && !modal.hidden) closeModal(); });

	// Rating is visual-only and stores its current number in a hidden input.
	const ratingInput = document.getElementById("rating");
	const ratingButtons = document.querySelectorAll(".rating button");
	ratingButtons.forEach(function (button) {
		button.addEventListener("click", function () {
			const selectedRating = Number(button.dataset.rating);
			ratingInput.value = selectedRating;
			ratingButtons.forEach(function (star) {
				star.classList.toggle("selected", Number(star.dataset.rating) <= selectedRating);
				star.setAttribute("aria-checked", String(Number(star.dataset.rating) === selectedRating));
			});
		});
	});

	// Display the reference screen's initial one-star rating.
	ratingButtons[0].classList.add("selected");

	function isPositiveInteger(value) {
		return /^[1-9]\d*$/.test(value);
	}

	function setInputValue(id, value) {
		const input = document.getElementById(id);
		if (!input || value == null || value === "") {
			return;
		}
		input.value = value;
	}

	function setSelectValue(id, value) {
		const select = typeof id === "string" ? document.getElementById(id) : id;
		if (!select || value == null || value === "") {
			return;
		}
		const str = String(value);
		const exists = Array.from(select.options).some(function (option) {
			return option.value === str;
		});
		if (!exists) {
			const option = document.createElement("option");
			option.value = str;
			option.textContent = str;
			select.appendChild(option);
		}
		select.value = str;
	}

	function booleanSelectValue(value) {
		if (value === true) {
			return "Ναι";
		}
		if (value === false) {
			return "Όχι";
		}
		return "";
	}

	function setCheckboxGroup(panelId, csv) {
		if (!csv) {
			return;
		}
		const values = String(csv).split(",").map(function (item) {
			return item.trim();
		});
		const panel = document.getElementById(panelId);
		if (!panel) {
			return;
		}
		panel.querySelectorAll("input[type=checkbox]").forEach(function (checkbox) {
			checkbox.checked = values.indexOf(checkbox.value) !== -1;
		});
	}

	function inferCategory(propertyType) {
		const type = String(propertyType || "").trim().toLowerCase();
		const land = ["οικόπεδο", "αγροτεμάχιο", "γη"];
		const commercial = ["γραφείο", "κατάστημα", "αποθήκη", "βιομηχανικός χώρος", "βιοτεχνικός χώρος", "ξενοδοχείο", "κτίριο επαγγελματικών χώρων", "αίθουσα", "εκθεσιακός χώρος διαμερισμάτων"];
		if (land.indexOf(type) !== -1 || type === "γη") {
			return "Γη";
		}
		if (commercial.indexOf(type) !== -1 || type === "επαγγελματική στέγη") {
			return "Επαγγελματική στέγη";
		}
		if (type === "λοιπά ακίνητα") {
			return "Λοιπά ακίνητα";
		}
		return "Κατοικία";
	}

	function fillPropertyForm(property) {
		loadedProperty = property;
		const category = inferCategory(property.propertyType);
		categorySelect.value = category;
		updateSubcategories();
		updateFormByCategory();
		setSelectValue(subcategorySelect, property.propertyType);
		setSelectValue("listing-type", property.transactionType);
		setInputValue("price", property.price);
		setInputValue("area", property.squareMeters);
		setInputValue("plot-area", property.plotArea);
		setInputValue("balcony-area", property.balconyArea);
		setInputValue("location-actual-address", property.location);
		setInputValue("location-display-el", property.location);
		setSelectValue("bedrooms", property.bedrooms);
		setSelectValue("bathrooms", property.bathrooms);
		setSelectValue("floor", property.floor);
		setSelectValue("year-built", property.yearBuilt);
		setSelectValue("energy-class", property.energyClass);
		setSelectValue("furnished", booleanSelectValue(property.furnished));
		setSelectValue("storage", booleanSelectValue(property.storage));
		setSelectValue("renovated", booleanSelectValue(property.renovated));
		setSelectValue("orientation", property.orientation);
		setSelectValue("view", property.view);
		setSelectValue("commercial-bathrooms", property.bathrooms);
		setSelectValue("commercial-floor", property.floor);
		setSelectValue("commercial-year-built", property.yearBuilt);
		setSelectValue("commercial-energy-class", property.energyClass);
		setSelectValue("commercial-storage", booleanSelectValue(property.storage));
		setSelectValue("commercial-renovated", booleanSelectValue(property.renovated));
		setSelectValue("commercial-orientation", property.orientation);
		setSelectValue("commercial-view", property.view);
		setSelectValue("land-orientation", property.orientation);
		setSelectValue("land-view", property.view);
		setInputValue("commercial-notes", property.notes);
		setCheckboxGroup("heating-panel", property.heating);
		setCheckboxGroup("commercial-heating-panel", property.heating);
		if (property.parking === true) {
			setSelectValue("parking-count", "1");
			setSelectValue("commercial-parking-count", "1");
		}
		updateInvestmentField();
		updateStorageArea();
		updateRenovationYear();
		updateBuildableSqm();
		multiSelectFields.forEach(updateMultiSelectSummary);
	}

	function showEditLoadError(message) {
		const status = document.getElementById("edit-load-message");
		status.textContent = message;
		status.hidden = false;
		savePropertyButton.disabled = true;
	}

	function applyEditModeLabels() {
		document.title = "Επεξεργασία Ακινήτου | EstateDesk";
		const heading = document.getElementById("new-property-heading");
		const breadcrumb = document.getElementById("new-property-breadcrumb");
		const subtitle = document.getElementById("new-property-subtitle");
		if (heading) {
			heading.textContent = "Επεξεργασία Ακινήτου";
		}
		if (breadcrumb) {
			breadcrumb.textContent = "CRM / Ακίνητα / Επεξεργασία Ακινήτου";
		}
		if (subtitle) {
			subtitle.textContent = "Ενημερώστε τα στοιχεία του ακινήτου και αποθηκεύστε τις αλλαγές.";
		}
		savePropertyButton.textContent = "Αποθήκευση Αλλαγών";
	}

	function initEditMode() {
		const propertyId = (new URLSearchParams(window.location.search).get("id") || "").trim();
		if (!propertyId) {
			return;
		}
		editPropertyId = propertyId;
		applyEditModeLabels();
		if (!isPositiveInteger(propertyId)) {
			showEditLoadError("Δεν βρέθηκε το ακίνητο.");
			return;
		}
		fetch(API_URL + "/" + propertyId).then(function (response) {
			if (response.status === 404) {
				showEditLoadError("Δεν βρέθηκε το ακίνητο.");
				return null;
			}
			if (!response.ok) {
				showEditLoadError("Αδυναμία φόρτωσης του ακινήτου.");
				return null;
			}
			return response.json();
		}).then(function (property) {
			if (property) {
				fillPropertyForm(property);
			}
		}).catch(function () {
			showEditLoadError("Αδυναμία φόρτωσης του ακινήτου.");
		});
	}

	initEditMode();
});
