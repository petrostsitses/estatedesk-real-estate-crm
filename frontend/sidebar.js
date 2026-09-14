document.addEventListener("DOMContentLoaded", function () {
	var toggles = document.querySelectorAll(".nav-toggle");

	toggles.forEach(function (toggle) {
		toggle.addEventListener("click", function () {
			var group = toggle.closest(".nav-group");
			var submenu = group.querySelector(".nav-submenu");
			var isOpen = group.classList.contains("open");

			if (isOpen) {
				group.classList.remove("open");
				toggle.setAttribute("aria-expanded", "false");
				submenu.hidden = true;
			} else {
				group.classList.add("open");
				toggle.setAttribute("aria-expanded", "true");
				submenu.hidden = false;
			}
		});
	});
});
