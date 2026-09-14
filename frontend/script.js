const API_URL = "http://localhost:8080/api/properties";

async function loadProperties() {
	const container = document.getElementById("properties-container");

	try {
		const response = await fetch(API_URL);

		if (!response.ok) {
			container.innerHTML = "<p class=\"placeholder-text\">Αδυναμία φόρτωσης ακινήτων.</p>";
			return;
		}

		const properties = await response.json();

		if (!properties || properties.length === 0) {
			container.innerHTML = "<p class=\"placeholder-text\">Δεν υπάρχουν ακίνητα.</p>";
			return;
		}

		container.innerHTML = "";

		properties.forEach(function (property) {
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
				"<p>" + property.description + "</p>";

			container.appendChild(card);
		});
	} catch (error) {
		console.error("Failed to load properties:", error);
		container.innerHTML = "<p class=\"placeholder-text\">Αδυναμία φόρτωσης ακινήτων.</p>";
	}
}

loadProperties();
