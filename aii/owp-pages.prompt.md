# Create Description Page

## Task

### Context

- please write the pages as the image attatched as example.
- create sub components to avoid bloat the `describe.js` page web component.
- as logo, use `/plugins/owp/assets/icons/owp-logo-light.svg`.
- the top bar has a section that highlight the current step of the flow. the steps are:
  1. Let's Start.
  2. Describe.
  3. Contact.
  4. Pictures.
  5. Design.

### Components

- preffix all sub components by `owp-`.
- no shadowRoot in sub components.
- the page is the only that uses shadowRoot.
- place all sub components at `/plugins/owp/components/`.
- there's no need to make imports.
- top bar is reused in all pages.

### Styles

- Assume tailwind is already setup.
- use tailwind classes for styles. 
- use the attribute `class` not `className`.

