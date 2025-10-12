/**
 * @class OwpDesignOption
 * @augments HTMLElement
 * @description Web component for a single design option in the design grid.
 */
class OwpDesignOption extends HTMLElement {
    static observedAttributes = ['template-id', 'url', 'name', 'title', 'option', 'img-css-ids'];


    /**
     * @description Constructs the OwpDesignOption instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.id = null;
        this.url = null;
        this.name = null;
        this.option = null;
        this.iframe = null;
        this.hoverScroller = null;
        this.scrollInterval = null;
        this.currentScrollPostion = 0;
        this.scrollSpeed = 10;

        this.className = `flex flex-col max-w-1/3 h-[450px] bg-slate-950 rounded-lg border border-slate-700 cursor-pointer hover:border-slate-700 overflow-hidden`;
        this.innerHTML = /*html*/`
            <div class="relative grow flex items-center justify-center bg-slate-900 text-slate-100 overflow-hidden">
                <img
                    id="loadingOption"
                    src="/wp-content/plugins/owp/assets/icons/image.svg"
                    alt="Image Icon"
                    class="absolute z-3 w-full h-full opacity-10 animate-pulse"
                />
                <div id="hoverScroller" class="absolute w-full h-full z-2 bg-slate-900" ></div>
                <iframe
                    class="h-full w-screen"
                    src=""
                    frameborder="0"
                ></iframe>
            </div>
            <div class="flex flex-col grow-0 shrink-0 p-4 cursor-default">
                <div class="flex justify-between items-center">
                    <span id="optionName" class="text-slate-100 text-md font-semibold">
                        Option
                    </span>
                    <div class="flex items-center gap-4">
                        <a href="#" class="text-slate-100 hover:text-slate-300 hover:opacity-75">
                            <img src="/wp-content/plugins/owp/assets/icons/external-link.svg" alt="External Link Icon" class="w-5 h-5">
                        </a>
                        <a href="#" class="text-slate-100 hover:text-slate-300 hover:opacity-75">
                            <img src="/wp-content/plugins/owp/assets/icons/info.svg" alt="Info Icon" class="w-5 h-5">
                        </a>
                    </div>
                </div>
            </div>
        `;
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.id = this.getAttribute('template-id');
        this.url = this.getAttribute('url') + '&owp-preview=true';
        this.name = this.getAttribute('name');
        this.option = this.getAttribute('option');
        this.imgCssIds = this.getAttribute('img-css-ids');

        this.iframe = this.querySelector('iframe');
        this.hoverScroller = this.querySelector('#hoverScroller');
        const optionNameElement = this.querySelector('#optionName');
        const loadingOptionImg = this.querySelector('#loadingOption');

        if (this.iframe) {
            this.iframe.src = this.url;
        }
        if (optionNameElement) {
            optionNameElement.textContent = `Option ${this.option} - ${this.name}`;
        }
        if (loadingOptionImg) {
            loadingOptionImg.id = `loadingOption${this.option}`;
        }
        if (this.hoverScroller) {
            this.hoverScroller.id = `hoverScroller${this.option}`;
        }

        this.#setIFrameStyles();
        this.#scrollDownDesignOption();
        this.#scrollUpDesignOption();

        this.hoverScroller.addEventListener('click', this.#handleHoverScrollerClick.bind(this));
    }


    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
        }
        if (this.hoverScroller) {
            this.hoverScroller.removeEventListener('click', this.#handleHoverScrollerClick.bind(this));
            this.hoverScroller.onmouseenter = null;
            this.hoverScroller.onmouseleave = null;
        }
    }


    /**
     * @description Handles changes to observed attributes.
     * @param {string} name - The name of the attribute.
     * @param {string} oldVal - The old value of the attribute.
     * @param {string} newVal - The new value of the attribute.
     * @returns {void}
     */
    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) {
            return;
        }
        switch (name) {
            case 'template-id':
                this.id = newVal;
                break;
            case 'url':
                this.url = newVal + '&owp-preview=true';
                if (this.iframe) {
                    this.iframe.src = this.url;
                }
                break;
            case 'name':
                this.name = newVal;
                break;
            case 'title':
                this.title = newVal;
                break;
            case 'img-css-ids':
                this.imgCssIds = newVal
            case 'option':
                this.option = newVal;
                const optionNameElement = this.querySelector('#optionName');
                if (optionNameElement) {
                    optionNameElement.textContent = `Option ${this.option}`;
                }
                const loadingOptionImg = this.querySelector(`#loadingOption${oldVal}`);
                if (loadingOptionImg) {
                    loadingOptionImg.id = `loadingOption${newVal}`;
                }
                const hoverScroller = this.querySelector(`#hoverScroller${oldVal}`);
                if (hoverScroller) {
                    hoverScroller.id = `hoverScroller${newVal}`;
                }
                break;
        }
    }


    /**
     * @private
     * @description Sets styles for the iframe once it loads.
     * @returns {void}
     */
    #setIFrameStyles() {
        this.iframe.onload = () => {
            const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
            const iframeBody = iframeDoc.body;
            const style = document.createElement('style');
            style.innerHTML = /*css*/`
                ::-webkit-scrollbar {
                    width: 0px;
                }
            `;
            iframeDoc.head.appendChild(style);
            iframeBody.style.zoom = 0.6;

            // Hydrate images using img-css-ids
            const homeCssIds = JSON.parse(atob(this.imgCssIds)).home;
            const mergePictures = JSON.parse(sessionStorage.getItem('owp_payload')).pictures.merge;

            // CSS rules in case of ::before
            const hydrationStyle = iframeDoc.createElement('style');
            let cssRules = '';
            const homeCssKeys = Object.keys(homeCssIds);
            homeCssKeys.forEach(key => {
                cssRules += `
                    #${key}::before {
                        content: "";
                        position: absolute;
                        background-image: var(--hydration-url);
                        background-size: cover;
                        z-index: 0;
                    }
                `;
            });
            hydrationStyle.textContent = cssRules;
            iframeDoc.head.appendChild(hydrationStyle); // Inject CSS into the IFRAME's head

            Object.keys(homeCssIds).forEach((key, index) => {
                const urlToHydrate = mergePictures[index].urls.raw;
                const containerDiv = iframeBody.querySelector(`#${key}`);
                if (!containerDiv) return;
                let targetImg = containerDiv.querySelector('img');
                if (!targetImg) {
                    // Set ::before css style
                    containerDiv.style.backgroundImage = 'none';
                    containerDiv.style.setProperty('--hydration-url', `url(${urlToHydrate})`);
                } else if (targetImg) {
                    targetImg.src = urlToHydrate;
                }
            });

            const loadingOptionImg = this.querySelector(`#loadingOption${this.option}`);
            if (loadingOptionImg) {
                loadingOptionImg.classList.remove('animate-pulse');
                loadingOptionImg.classList.add('hidden');
            }

            const hoverScrollerBg = this.querySelector(`#hoverScroller${this.option}`);
            if (hoverScrollerBg) {
                hoverScrollerBg.classList.remove('bg-slate-900');
            }
        };
    }


    /**
     * @private
     * @description Handles the click event on the hover scroller to open the preview modal.
     * @returns {void}
     */
    #handleHoverScrollerClick() {
        const owpApp = document.querySelector('owp-app');
        if (owpApp) {
            const previewModal = new OwpDesignPreviewModal();
            previewModal.setAttribute('url', this.url);
            previewModal.setAttribute('template-id', this.id);
            previewModal.setAttribute('name', this.name);
            previewModal.setAttribute('title', this.title);
            previewModal.setAttribute('img-css-ids', this.imgCssIds);
            owpApp.shadowRoot.appendChild(previewModal);
        }
    }


    /**
     * @private
     * @description Scrolls the design option iframe down on mouse enter.
     * @returns {void}
     */
    #scrollDownDesignOption() {
        this.hoverScroller.onmouseenter = () => {
            if (this.scrollInterval) {
                clearInterval(this.scrollInterval);
                this.scrollInterval = null;
            }

            const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
            const iframeBody = iframeDoc.body;
            this.scrollInterval = setInterval(() => {
                if (this.currentScrollPostion < iframeBody.scrollHeight - 1080) {
                    this.currentScrollPostion += this.scrollSpeed;
                    iframeBody.style.transform = `translateY(-${this.currentScrollPostion}px)`;
                }
            }, 20);
        };
    }


    /**
     * @private
     * @description Scrolls the design option iframe up on mouse leave.
     * @returns {void}
     */
    #scrollUpDesignOption() {
        this.hoverScroller.onmouseleave = () => {
            if (this.scrollInterval) {
                clearInterval(this.scrollInterval);
                this.scrollInterval = null;
            }

            const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
            const iframeBody = iframeDoc.body;
            this.scrollInterval = setInterval(() => {
                if (this.currentScrollPostion > 0) {
                    this.currentScrollPostion -= this.scrollSpeed;
                    iframeBody.style.transform = `translateY(-${this.currentScrollPostion}px)`;
                }
            }, 20);
        };
    }
}

customElements.define('owp-design-option', OwpDesignOption);