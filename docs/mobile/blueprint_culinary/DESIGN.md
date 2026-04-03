# Design System Specification: The Architectural Blueprint

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Architectural Blueprint."** 

This system rejects the "lo-fi" messiness of traditional wireframes in favor of a high-fidelity technical drawing aesthetic. It treats a recipe app not as a mere list of steps, but as a culinary schematic. We achieve a premium feel by combining the utilitarian rigor of a blueprint with the spaciousness of a high-end editorial magazine. 

To move beyond a "generic" template, we use intentional asymmetry—such as oversized typography bleeding off-center and "ghost" containers—to create a sense of curated depth. Every pixel must feel like it was placed by an architect, not a software default.

---

## 2. Colors & Tonal Architecture
The palette is strictly monochromatic, utilizing a sophisticated range of grays to define importance rather than using color as a crutch.

### The "No-Line" Rule
Standard UI relies on borders to separate content. In this design system, **1px solid borders are strictly prohibited for page sectioning.** To define boundaries, you must use background color shifts. For example, a recipe discovery section (`surface-container-low`) should sit atop the main `surface` without a divider line.

### Surface Hierarchy & Nesting
Depth is achieved through a stacking logic of tonal layers. Treat the UI as physical sheets of vellum:
- **Base Level:** `surface` (#f9f9f9)
- **Secondary Content:** `surface_container_low` (#f3f3f3)
- **Interactive Cards:** `surface_container_lowest` (#ffffff) to create a subtle pop against the background.
- **Emphasis Areas:** `surface_dim` (#dadada) for utility bars or secondary navigation.

### Signature Textures & Gradients
For primary CTAs (e.g., "Start Cooking"), do not use a flat black. Apply a subtle linear gradient from `primary` (#000000) to `primary_container` (#3b3b3b). This provides a "carbon" finish that feels professional and weighty.

---

## 3. Typography
We use **Inter** as our sole typeface. The beauty of this system lies in the extreme contrast between technical labels and massive editorial headlines.

- **Display Scales (`display-lg` to `display-sm`):** Reserved for hero recipe titles and category headers. Use these to anchor the page.
- **Headline & Title Scales:** Used for section headers (e.g., "Ingredients," "Method"). Use `title-lg` for card titles to ensure high legibility.
- **Body Scales:** `body-md` (0.875rem) is our workhorse for instructions. Ensure a generous line height to maintain the "blueprint" clarity.
- **Label Scales:** `label-sm` (0.6875rem) should be used for technical metadata (e.g., "PREP TIME," "CALORIES"). These should be in all-caps with a slight letter-spacing increase to mimic technical drawings.

---

## 4. Elevation & Depth
We eschew traditional drop shadows for **Tonal Layering** and **Ambient Light**.

- **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container` background to create a "lift" effect. The eye perceives the lighter shade as being closer to the viewer.
- **Ambient Shadows:** If a floating element (like a FAB) is required, use a shadow with a 24px blur at 4% opacity using the `on_surface` color. It should feel like a soft glow, not a harsh drop shadow.
- **The "Ghost Border" Fallback:** For wireframe schematic elements (like image placeholders), use a "Ghost Border": the `outline_variant` token (#c6c6c6) at 20% opacity. 
- **Glassmorphism:** For top navigation bars, use `surface` at 80% opacity with a `20px` backdrop blur. This allows the "blueprint" grid to peek through as the user scrolls.

---

## 5. Components
All components should maintain a "schematic" feel—polished, yet intentionally structural.

### Image Placeholders
- **Style:** Use a `surface_variant` fill with a `outline` stroke. 
- **The Signature "X":** All image boxes must contain two diagonal lines (corner-to-corner) using the `outline` token at 30% opacity. 
- **Rounding:** Use `lg` (0.5rem) for main recipe images; `DEFAULT` (0.25rem) for smaller thumbnails.

### Buttons
- **Primary:** `primary` fill with `on_primary` text. Use `sm` (0.125rem) rounding for a sharp, technical look.
- **Secondary:** `surface_container_highest` fill with `on_surface` text. No border.
- **Tertiary:** No fill. `primary` text with a 1px "Ghost Border" (20% opacity).

### Input Fields
- **State:** Use `surface_container_low` for the fill.
- **Focus:** Transition the border from a "Ghost Border" to a 1px `primary` stroke. 
- **Labels:** Always use `label-md` floating above the input, never inside, to maintain the blueprint documentation style.

### Cards & Lists
- **No Dividers:** Forbid the use of horizontal lines between list items. Use `spacing-4` (1.4rem) of vertical white space to separate ingredients.
- **Recipe Cards:** Use a `surface_container_lowest` background with a `DEFAULT` (0.25rem) radius.

### Additional Blueprint Components
- **The "Instruction Step" Counter:** A large `display-sm` number in `outline_variant` color placed behind the `body-md` instruction text to create architectural depth.
- **The Measurement Chip:** A `secondary_container` pill using `label-sm` for quick-glance units (e.g., "250g").

---

## 6. Do's and Don'ts

### Do:
- **Embrace White Space:** Use the `spacing-8` (2.75rem) and `spacing-12` (4rem) tokens frequently. High-end design needs "air."
- **Use Intentional Asymmetry:** Align text to a grid, but allow "X" placeholders to span across columns to break the monotony.
- **Stick to the Scale:** Only use the defined `Roundedness Scale`. Mixing radius values kills the professional "blueprint" feel.

### Don't:
- **Don't use 100% Black Borders:** They are too heavy. Always use "Ghost Borders" at reduced opacity.
- **Don't use Icons for Everything:** In a blueprint system, text labels (e.g., "MENU" vs a hamburger icon) often feel more premium and intentional.
- **Don't use pure White (#ffffff) for backgrounds:** Use `surface` (#f9f9f9) to reduce eye strain and allow `surface_container_lowest` to pop.