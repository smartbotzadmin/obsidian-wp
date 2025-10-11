# Web Components Instruction

## Main Order

Use this order as guide to write Web Components. Is encouraged the use of `observedAttributes`,
`connectedCallback`, `disconnectedCallback` and `attributeChangedCallback`. The `connectedMoveCallback`
and `adoptedCallback` should be used when strictly necessary.

```js
// Create a class for the element
class MyCustomElement extends HTMLElement {
  static observedAttributes = ["attr1", "attr2"];

  constructor() {
    // Always call super first in constructor
    super();

    // grabbing attributes here ...
    const attr1 = this.getAttribute('attr1') // ready to use

    // NO member registration
    // this.newMessyMember = 'wrong'

    // component definition
    this.className = `...`
    this.innerHtml = /*html*/`<>...</>`
  }

  connectedCallback() {
    console.log("Custom element added to page.");

    // dynamic rendering logic here ...

    // event listeners here ...
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  connectedMoveCallback() {
    console.log("Custom element moved with moveBefore()");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }

  // handleHelpers...
}

customElements.define("my-custom-element", MyCustomElement);
```

## Extends

Never extend for native tags/elements.

// NO
```js
customElements.define("word-count", WordCount, { extends: "p" });
```

## Shadow Root

No shadowRoot implementation unless requested in instructions.

## Templates

No <template> implementation unles requested in instructions.