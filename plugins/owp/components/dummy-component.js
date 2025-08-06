class DummyComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="bg-blue-200 text-xl font-semibold">
                <h3>Hello from Dummy Web Component!</h3>
                <p>This is a test web component.</p>
                <p>${this.getAttribute('my-attribute')}</p>
            </div>
        `;
    }
}

customElements.define('dummy-component', DummyComponent);