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
  }

  connectedCallback() {
    console.log("Custom element added to page.");

    // grabbing attributes here ...
    this.attr1 = this.getAttribute('attr1') // ready to use

    // component definition
    this.className = `...`
    this.innerHtml = /*html*/`<>
    <!-- Add comments to important sections in the html -->
      ...content of the component
    </>`

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

## Docs

```js
class PopupInfo extends HTMLElement {
  constructor() {
    super();
  }
  // Element functionality written in here
}
```

In the class constructor, you can set up initial state and default values, register event listeners and perhaps create a shadow root. At this point, you should not inspect the element's attributes or children, or add new attributes or children.

Custom element lifecycle callbacks
Once your custom element is registered, the browser will call certain methods of your class when code in the page interacts with your custom element in certain ways. By providing an implementation of these methods, which the specification calls lifecycle callbacks, you can run code in response to these events.

Custom element lifecycle callbacks include:

- connectedCallback(): Called each time the element is added to the document. The specification recommends that, as far as possible, developers should implement custom element setup in this callback rather than the constructor.
- disconnectedCallback(): Called each time the element is removed from the document.
- connectedMoveCallback(): When defined, this is called instead of connectedCallback() and -disconnectedCallback() each time the element is moved to a different place in the DOM via Element.moveBefore(). Use this to avoid running initialization/cleanup code in the connectedCallback() and disconnectedCallback() callbacks when the element is not actually being added to or removed from the DOM. See Lifecycle callbacks and state-preserving moves for more details.
- adoptedCallback(): Called each time the element is moved to a new document.
- attributeChangedCallback(): Called when attributes are changed, added, removed, or replaced. See Responding to attribute changes for more details about this callback.

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

## Communication

Through CustomEvent API, or if user request it, through BroadcastChannel API.
CustomEvents must be attached and listened to window object.