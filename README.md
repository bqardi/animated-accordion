# animated-accordion
An animated accordion using native `<details>` and `<summary>` tags.

## Criterias
The markup must be constructed with `<details>` and `<summary>` tags and the content "area" must consist of an inner element and an outer element:
```html
<details>
	<summary>Toggle accordion</summary>
	<div class="outer">
		<div class="inner">
			... content ...
		</div>
	</div>
</details>
```
The outer element is the one with the actual animation (transition) on it.
The inner element is a wrapper for your custom content.

## Style it
Style `<details>` and `<summary>` as you normaly would (or google it if you don't know).

The `.outer` is for animation purposes only.

The `.inner` can be styled with anything that isn't height interferring (and naturally the children of `.inner` as well).

*For example animating a child element of `.inner` with a height (eg. from `0` to `300px`) will break the layout because the height of `.outer` is calculated at the beginning (where said child element would be `0px` and therefore `.outer` would be `300px` too short). This can be fixed though with the `extendedHeight` property, see [options](#options) further down.*

```css
.outer {
	/* DO NOT ANIMATE padding AND border, IT BREAKS!!! */
	opacity: 0;
}
details.open .outer {
	opacity: 1;
}
.inner {
	margin: 20px;
	padding: 20px;
	background-color: rgb(246, 245, 238);
	border: 1px solid rgb(224, 223, 212);
}
```

## Make it animate
To make it animate, we need some Javascript:
```javascript
import animatedAccordions from "./accordion.js";

const options = {
	duration: 300,
	extendedHeight: 0
}

animatedAccordions(".outer", ".inner", options);
```
`animatedAccordions` takes three arguments:
- outerSelector - from the example a div with a class of `outer`*.
- innerSelector - from the example a div with a class of `inner`*.
- options - see [options](#options) further down.

*The selector can be any selector that can be used by `.querySelector` in Javascript (like, `id`, `class`, `data-attribute`, etc.).

## Options
The options for the animatedAccordion are:
- duration: [the duration of the animation]
	- default: 0
	- If set to any falsy value, it will behave as the native `<details>` element normally behaves, but will toggle an `open` class.
- extendedHeight: [extend the height of `.outer` with x pixels]
	- default: 0
	- For example if you have a child element inside `.inner` that changes size (height) dynamically, set this property to a value that `.outer` is allowed to grow beyond its original size.

## The code
If you want to tinker with the code, add your own functionality, just use it in your own codebase, etc. feel free to grab the sourcecode here:

```javascript
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
```