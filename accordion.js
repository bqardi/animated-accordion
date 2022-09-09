export default function animatedAccordions(outerSelector, innerSelector, options){
	document.querySelectorAll("details")
		.forEach(accordion => animatedAccordionsRegister(accordion, outerSelector, innerSelector, options));
}

function animatedAccordionsRegister(
	accordion,
	outerSelector,
	innerSelector,
	options={
		duration: 0,
		extendedHeight: 0
	}
) {
	if (!accordion || accordion.localName !== "details") return;

	if (!options.duration) {
		accordion.addEventListener("click", e => {
			if (e.target.localName !== "summary") return;
			accordion.classList.toggle("open");
		});
		return;
	}

	const content = accordion.querySelector(outerSelector);
	const inner = accordion.querySelector(innerSelector);
	
	if (!content || !inner) return;

	inner.style.boxSizing = "border-box";

	content.style.transitionDuration = options.duration + "ms";
	content.style.overflow = "hidden";

	content.style.boxSizing = "border-box";

	const contentHeight = content.offsetHeight;
	
	accordion.addEventListener("click", e => {
		if (e.target.localName !== "summary") return;

		content.style.height = 0;
		
		if (accordion.open) {
			e.preventDefault();
			accordion.classList.remove("open");
			setTimeout(() => accordion.open = false, options.duration);
			return;
		}

		setTimeout(() => {
			accordion.classList.add("open");
			content.style.height = contentHeight + options.extendedHeight + "px";
		});
	});
}