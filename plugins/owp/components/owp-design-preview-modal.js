/**
 * @class OwpDesignPreviewModal
 * @augments HTMLElement
 * @description Web component for displaying a full-screen design preview modal.
 */
class OwpDesignPreviewModal extends HTMLElement {

    constructor() {
        super();

        this.fontPairs = [
            { heading: 'Playfair Display', body: 'Open Sans' },
            { heading: 'Lato', body: 'Lora' },
            { heading: 'Barlow Semi Condensed', body: 'Roboto' },
            { heading: 'Monsterrat', body: 'Source Sans Pro' },
            { heading: 'Rubik', body: 'Karla' },
            { heading: 'DM Serif Display', body: 'Work Sans' },
        ];

        this.palettes = [
            'astra-palette-oak',
            'astra-palette-viola',
            'astra-palette-cedar',
            'astra-palette-widow',
            'astra-palette-lily',
            'astra-palette-rose',
            'astra-palette-sage',
            'astra-palette-flare',
            'astra-palette-maple',
            'astra-palette-brich',
            'astra-palette-dark'
        ];

        this.className = `fixed top-0 left-0 z-10 w-full h-full flex p-8`;
        this.innerHTML = /*html*/`
        <div class="relative flex flex-row w-full h-full rounded-2xl overflow-hidden border border-slate-700">
            <!-- Loading Mask -->
            <div id="loadingMaskModal" class="absolute inset-0 bg-slate-900 flex justify-center items-center">
                <span class="text-slate-700 text-lg font-sans font-semibold animate-pulse">Loading...</span>
            </div>
            <!-- Sidebar -->
            <div id="sidebarModal" class="lg:w-[350px] w-0 h-full bg-slate-950 lg:p-8 p-0 lg:visible invisible">
                <!-- Sidebar Container -->
                <div class="flex flex-col justify-between w-full h-full">
                    <!-- Obsidian Logo -->
                    <div class="flex items-center justify-start mb-6">
                        <img src="/wp-content/plugins/owp/assets/icons/obsidian-logo.png" class="w-10 h-10 rounded-full"/>
                    </div>

                    <!-- Site Logo Upload -->
                    <div class="flex flex-col gap-2 mb-6">
                        <label class="flex text-slate-400 text-sm font-semibold">
                          Site Logo
                        </label>
                        <div class="flex grow items-center justify-center border-2 border-slate-700 rounded-md p-4 cursor-pointer">
                            <img src="/wp-content/plugins/owp/assets/icons/image.svg" />
                        </div>
                    </div>

                    <!-- Font Pair Selection -->
                    <div class="flex flex-col gap-2 mb-6">
                        <div class="flex items-center gap-2">
                            <label class="flex shrink-0 items-center text-slate-400 text-sm font-semibold">
                                Font Pair:
                            </label>
                            <span id="selectedFontPairPreview" class="flex-1 text-slate-100 text-[14px] font-normal text-wrap">
                                ${this.fontPairs[0].heading} & ${this.fontPairs[0].body}
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            ${this.fontPairs.map((fontPair, index) => /*html*/`
                                <div id="fontPairNo${index}" class="flex grow items-center justify-center w-1/4 h-10 border border-slate-700 hover:outline hover:outline-cyan-500 hover:outline-offset-2 rounded-md text-slate-300 text-md cursor-pointer">
                                    <span class="font-bold text-lg" style="font-family: ${fontPair.heading};">A</span>
                                    <span class="font-normal text-lg" style="font-family: ${fontPair.body};">g</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Color Palette Selection -->
                    <div class="flex flex-col gap-2 mb-6">
                        <label class="flex text-slate-400 text-sm font-semibold">Color Palette: Original</label>
                        <div class="grid grid-cols-5 gap-2 auto-rows-2">
                            ${this.palettes.map((palette, index) => /*html*/`
                                <div id="paletteNo${index}" class="flex justify-center items-center gap-1 p-2 bg-(--ast-global-color-5) border border-slate-700 rounded-lg cursor-pointer hover:outline hover:outline-cyan-500 hover:outline-offset-2 ${palette}">
                                    <div class="size-3 rounded-full bg-(--ast-global-color-0)"></div>
                                    <div class="size-3 rounded-full bg-(--ast-global-color-1)"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col gap-2 mb-6">
                        <button class="w-full bg-indigo-600 text-white py-3 rounded-md flex items-center justify-center">
                            Continue <span class="ml-2">→</span>
                        </button>
                        <button class="w-full bg-slate-700 text-white py-3 rounded-md">Back to Other Designs</button>
                    </div>

                    <!-- Responsive Preview Buttons-->
                    <div class="flex items-center justify-between border-t border-slate-700 pt-4">
                        <span class="text-slate-400 text-sm font-semibold">Responsive Preview</span>
                        <div class="flex space-x-2">
                            <button class="p-2 border border-slate-700 rounded-md text-slate-300">
                                <!-- Desktop Icon -->
                                <img src="/wp-content/plugins/owp/assets/icons/desktop.svg" alt="Desktop Icon" class="w-5 h-5">
                            </button>
                            <button class="p-2 border border-slate-700 rounded-md text-slate-300">
                                <!-- Tablet Icon -->
                                <img src="/wp-content/plugins/owp/assets/icons/tablet.svg" alt="Tablet Icon" class="w-5 h-5">
                            </button>
                            <button class="p-2 border border-slate-700 rounded-md text-slate-300">
                                <!-- Mobile Icon -->
                                <img src="/wp-content/plugins/owp/assets/icons/mobile.svg" alt="Mobile Icon" class="w-5 h-5">
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Iframe -->
            <iframe
                src="/?elementor_library=aspera-home&owp-preview=true"
                class="h-full flex-1 bg-slate-100"
                frameborder="0"
            ></iframe>

            <!-- Close Button -->
            <button id="closeModal" class="absolute top-4 right-4 p-2 bg-slate-700 rounded-full hover:bg-slate-600 cursor-pointer">
                <img src="/wp-content/plugins/owp/assets/icons/x.svg" alt="Close Icon" class="w-6 h-6">
            </button>
        </div>
      `;
    }

    connectedCallback() {
        this.sidebar = this.querySelector('#sidebarModal');

        this.closeButton = this.querySelector('#closeModal');
        this.closeButton.addEventListener('click', () => {
            this.remove();
        });

        this.iframe = this.querySelector('iframe');
        this.iframe.onload = () => {
            this.preview = this.iframe.contentDocument || this.iframe.contentWindow.document;

            const previewBody = this.preview.body;
            previewBody.style.zoom = 0.8;

            const previewHead = this.preview.head;
            const linkGoogleFonts = `
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=DM+Serif+Display:ital@0;1&family=Karla:ital,wght@0,200..800;1,200..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
`;

            document.head.insertAdjacentHTML('beforeend', linkGoogleFonts);
            previewHead.insertAdjacentHTML('beforeend', linkGoogleFonts);

            previewBody.classList.add(this.palette)

            this.querySelector('#loadingMaskModal').remove()
        }

        this.fontPairs.forEach((fontPair, index) => {
            this.querySelector(`#fontPairNo${index}`).onclick = (e) => {
                this.changeIFrameFontFamily(fontPair);
            }
        })

        this.palettes.forEach((palette, index) => {
            this.querySelector(`#paletteNo${index}`).onclick = (e) => {
                this.changeIFramePalette(palette);
            }
        })
    }

    changeIFrameFontFamily(fontPair) {
        const iframeHead = this.iframe.contentDocument.head;
        const previewAstraFontFamily = iframeHead.querySelector('#previewAstraFontFamily')
        const styleTemplate = `
        <style id="previewAstraFontFamily" rel="stylesheet">
            /* headings */
            h1, h2, h3, h4, h5, h6, .entry-content :where(h1, h2, h3, h4, h5, h6), .site-title, .site-title a {
                font-family: '${fontPair.heading}', serif;
                font-weight: 600;
            }
            
            h1, .entry-content :where(h1) {
                font-size:54px;
                font-size:3.375rem;
                font-weight:600;
                font-family:'${fontPair.heading}',serif;
                line-height:1.4em;
            }
            h2, .entry-content :where(h2) {
                font-size:42px;
                font-size:2.625rem;
                font-weight:600;
                font-family:'${fontPair.heading}',serif;
                line-height:1.3em;
            }
            h3, .entry-content :where(h3) {
                font-size:36px;
                font-size:2.25rem;
                font-weight:600;
                font-family:'${fontPair.heading}',serif;
                line-height:1.3em;
            }
            h4, .entry-content :where(h4) {
                font-size:25px;
                font-size:1.5625rem;
                line-height:1.2em;
                font-weight:600;
                font-family:'${fontPair.heading}',serif;
            }
            h5, .entry-content :where(h5) {
                font-size:20px;
                font-size:1.25rem;
                line-height:1.2em;
                font-weight:600;
                font-family:'${fontPair.heading}',serif;
            }
            h6, .entry-content :where(h6) {
                font-size:15px;
                font-size:0.9375rem;
                line-height:1.25em;
                font-weight:600;
                font-family:'${fontPair.heading}',serif;
            }

            /* body */
            body, button, input, select, textarea, .ast-button, .ast-custom-button {
                font-family: '${fontPair.body}', sans-serif;
                font-weight: 400;
                font-size: 16px;
                font-size: 1rem;
                line-height: var(--ast-body-line-height, 1.65);
            }
        </style>`;

        if (!previewAstraFontFamily) {
            iframeHead.insertAdjacentHTML('beforeend', styleTemplate);
            return;
        }

        previewAstraFontFamily.innerHTML = styleTemplate;

        const selectedFontPairPreview = this.querySelector('#selectedFontPairPreview');
        selectedFontPairPreview.innerHTML = `
            ${fontPair.heading} & ${fontPair.body}
        `;

    }

    changeIFramePalette(palette) {
        this.preview = this.iframe.contentDocument || this.iframe.contentWindow.document;
        const previewBody = this.preview.body;

        previewBody.classList.remove(this.palette);
        this.palette = palette;
        previewBody.classList.add(this.palette);
    }
}

customElements.define('owp-design-preview-modal', OwpDesignPreviewModal);