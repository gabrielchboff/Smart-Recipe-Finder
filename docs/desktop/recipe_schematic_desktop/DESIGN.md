# Design System Document: Technical Schematic Editorial

## 1. Overview & Creative North Star
### The Creative North Star: "The Architectural Ledger"
This design system moves beyond simple "recipe browsing" into the realm of technical documentation and architectural precision. The objective is to treat culinary data with the same reverence as a structural blueprint. 

By leveraging **Intentional Asymmetry** and **Rigid Technical Grids**, we break the "template" look of modern web apps. We use expansive white space and "technical artifacts"—such as coordinate labels, grid intersections, and metadata tags—to create a high-end, editorial experience that feels curated and authoritative. This is not a social feed; it is an archive of culinary engineering.

---

## 2. Colors & Surface Logic
The palette is rooted in a monochrome foundation, accented by "Blueprint Blue" tones to evoke the feeling of technical cyanotypes.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined through:
1.  **Background Color Shifts:** Use `surface-container-low` (#f1f4f6) sections sitting on a `background` (#f8f9fa) base.
2.  **Tonal Transitions:** Define zones by moving from `surface` to `surface-variant`.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked technical vellum sheets. 
*   **Base Layer:** `background` (#f8f9fa).
*   **Secondary Zones:** `surface-container-low` (#f1f4f6) for sidebar or utility panels.
*   **Content Cards:** `surface-container-lowest` (#ffffff) to create a subtle "lift" against the gray-cast background.

### Glass & Blueprint Accents
*   **Tertiary Accents:** Use `tertiary` (#416283) and `tertiary-container` (#b7d7ff) sparingly for interactive technical metadata or "active" schematic states.
*   **Blueprint Blur:** Floating overlays (modals/tooltips) should use `surface-container-lowest` at 80% opacity with a `20px` backdrop blur to maintain the architectural "layered" feel.

---

## 3. Typography
Typography is the primary structural element. We utilize **Inter** for its neutral, Swiss-inspired clarity and **Space Grotesk** for technical data.

*   **Display & Headlines (Inter):** High-impact, `bold` or `black` weights. 
    *   *Directives:* Use `tracking-widest` (letter-spacing: 0.1em+) for `display-lg` to create an expensive, editorial feel. 
    *   *Identity:* Headlines should be treated as "Document Titles"—often left-aligned with significant bottom margins (`spacing-12`).
*   **Technical Labels (Space Grotesk):** All metadata (cook time, yield, temperature) must use `label-md` or `label-sm`.
    *   *Identity:* Monospaced appearance communicates precision. Always uppercase for metadata keys (e.g., "DURATION: 45MIN").
*   **Body (Inter):** Use `body-md` for legibility. Keep line lengths between 60-75 characters to maintain the "ledger" aesthetic.

---

## 4. Elevation & Depth
In a blueprint-inspired system, depth is "implied" rather than "projected."

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. To separate a recipe card from the background, do not use a shadow; use `surface-container-lowest` on top of `surface-container-low`.
*   **Ambient Shadows:** If an element must float (e.g., a dropdown), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(43, 52, 55, 0.05)`. The color is a tint of `on-surface`, not pure black.
*   **The "Ghost Border" Fallback:** For decorative structural lines (like the "Blueprint-X" placeholders), use `outline-variant` (#abb3b7) at **15% opacity**. These should look like faint pencil marks or fold lines, not heavy ink.

---

## 5. Components

### Navigation: The "Sidebar Schematic"
Adapt the mobile bottom nav to a **Fixed Left Sidebar**.
*   **Structure:** A thin vertical strip using `surface-container-low`. 
*   **Icons:** Minimalist line-art. Use `outline` (#737c7f) for inactive and `primary` (#5e5e5e) for active.
*   **Labels:** Use `label-sm` (Space Grotesk) rotated 90 degrees or placed vertically to reinforce the technical drawing aesthetic.

### Buttons: The Functional Block
*   **Primary:** Solid `primary` (#5e5e5e) with `on-primary` (#f8f8f8) text. Shape: `0px` radius (Rigid Square).
*   **Secondary:** `surface-container-highest` background. No border.
*   **Ghost (Technical):** `outline-variant` at 20% opacity border. Used for secondary technical actions.

### Cards & Lists: The No-Divider Rule
*   **Execution:** Forbid 1px horizontal dividers. Separate list items using `spacing-4` (0.9rem) of vertical white space or by alternating background tints between `surface` and `surface-container-low`.
*   **The "Blueprint-X":** Empty image states must use a ghost-border rectangle with a diagonal "X" crossing the center, mimicking architectural placeholders.

### Input Fields: The Document Entry
*   **Style:** Underline only. Use `outline` (#737c7f) for the bottom border. 
*   **Focus State:** The border transitions to `tertiary` (#416283) with a subtle `tertiary-fixed` (#b7d7ff) glow.

---

## 6. Do's and Don'ts

### Do:
*   **Use Intentional Asymmetry:** Align headings to the far left and metadata to the far right, leaving a "void" in the center to highlight the grid.
*   **Embrace the Grid:** Use "coordinate" markers in the corners of sections (e.g., "SEC_01 / PG_04" in `label-sm`) to lean into the technical manual vibe.
*   **Maintain Rigid Edges:** Always use `0px` border radius. Roundness breaks the "Architectural" metaphor.

### Don't:
*   **Don't use 100% Black:** Use `on-background` (#2b3437) for text. Pure black is too harsh; this slightly softened slate maintains the "ink on vellum" feel.
*   **Don't use Standard Shadows:** Never use the default "Drop Shadow" preset. It looks amateur. Always manually define low-opacity, high-blur ambient light.
*   **Don't over-decorate:** Avoid gradients or textures unless they represent a specific technical material (like frosted glass blurs).