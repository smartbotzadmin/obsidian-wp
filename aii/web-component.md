# Web Components guidelines

- prior `/*html*/` before multi-string over `document.createElement()` function.
```javascript
/*html*/`
<div class="proper way to define an html fragment"
`;
```

- define self className and innerHtml like this:
```javascript
this.className = `{tailwind classes}`;
this.innerHTML = /*html*/`{content}`;
```

- custom attributes/properties/variables must be within `constructor()`.

- className and innerHtml definition must be within `connectedCallback()`.

- getting inner elements with functions like `querySelector()` or `getElementsBy...` must be below
the className and innerHtml definition. Also within `connectedCallback()`.

