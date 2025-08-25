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
        ]
        this.fontPairSelected = this.fontPairs[0];
        this.className = `fixed top-0 left-0 z-10 w-full h-full flex p-8`;
        this.innerHTML = /*html*/`
        <div class="relative flex flex-row w-full h-full rounded-2xl overflow-hidden border border-slate-700">
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
                        <div class="flex items-end gap-2">
                            <label class="flex items-center text-slate-400 text-sm font-semibold">
                                Font Pair:
                            </label>
                            <span class="text-slate-100 text-[14px] font-normal">
                                ${this.fontPairSelected.heading} & ${this.fontPairSelected.body}
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            ${this.fontPairs.map((fontPair, index) => /*html*/`
                                <div id="fontPairNo${index}" class="flex grow items-center justify-center w-1/4 h-10 border border-slate-700 hover:outline hover:outline-cyan-500 hover:outline-offset-2 rounded-md text-slate-300 text-md cursor-pointer">
                                    <span class="font-bold" style="font-family: ${fontPair.heading};">A</span>
                                    <span class="font-normal" style="font-family: ${fontPair.body};">g</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Color Palette Selection -->
                    <div class="flex flex-col gap-2 mb-6">
                        <label class="flex text-slate-400 text-sm font-semibold">Color Palette: Original</label>
                        <div class="flex flex-wrap gap-2">
                            <div class="flex space-x-1 p-2 border border-slate-700 rounded-md">
                                <div class="w-5 h-5 rounded-full bg-red-500"></div>
                                <div class="w-5 h-5 rounded-full bg-blue-500"></div>
                            </div>
                            <div class="flex space-x-1 p-2 border border-slate-700 rounded-md">
                                <div class="w-5 h-5 rounded-full bg-purple-500"></div>
                                <div class="w-5 h-5 rounded-full bg-pink-500"></div>
                            </div>
                            <div class="flex space-x-1 p-2 border border-slate-700 rounded-md">
                                <div class="w-5 h-5 rounded-full bg-blue-500"></div>
                                <div class="w-5 h-5 rounded-full bg-green-500"></div>
                            </div>
                            <div class="flex space-x-1 p-2 border border-slate-700 rounded-md">
                                <div class="w-5 h-5 rounded-full bg-red-500"></div>
                                <div class="w-5 h-5 rounded-full bg-yellow-500"></div>
                            </div>
                            <div class="flex space-x-1 p-2 border border-slate-700 rounded-md">
                                <div class="w-5 h-5 rounded-full bg-yellow-700"></div>
                                <div class="w-5 h-5 rounded-full bg-orange-700"></div>
                            </div>
                            <div class="flex space-x-1 p-2 border border-slate-700 rounded-md">
                                <div class="w-5 h-5 rounded-full bg-pink-700"></div>
                                <div class="w-5 h-5 rounded-full bg-red-700"></div>
                            </div>
                            <div class="flex space-x-1 p-2 border border-slate-700 rounded-md">
                                <div class="w-5 h-5 rounded-full bg-blue-700"></div>
                                <div class="w-5 h-5 rounded-full bg-cyan-700"></div>
                            </div>
                            <div class="flex space-x-1 p-2 border border-slate-700 rounded-md">
                                <div class="w-5 h-5 rounded-full bg-green-700"></div>
                                <div class="w-5 h-5 rounded-full bg-lime-700"></div>
                            </div>
                            <div class="flex space-x-1 p-2 border border-slate-700 rounded-md">
                                <div class="w-5 h-5 rounded-full bg-yellow-500"></div>
                                <div class="w-5 h-5 rounded-full bg-orange-500"></div>
                            </div>
                            <div class="flex items-center justify-center p-2 border border-slate-700 rounded-md bg-gray-800">
                                <div class="w-full h-full bg-grid-pattern"></div>
                            </div>
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
            <link id="previewModalGoogleFontsApis" rel="preconnect" href="https://fonts.googleapis.com">
            <link id="previewModalGoogleFontsStatic" rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link id="previewModalGoogleFonts" href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=DM+Serif+Display:ital@0;1&family=Karla:ital,wght@0,200..800;1,200..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">`;

            document.head.insertAdjacentHTML('beforeend', linkGoogleFonts);
            previewHead.insertAdjacentHTML('beforeend', linkGoogleFonts);
        }

        this.fontPairs.forEach((fontPair, index) => {
            this.querySelector(`#fontPairNo${index}`).onclick = (e) => {
                console.log('Clicked fontPairNo:', index)
                this.changeIFrameFontFamily(fontPair);
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
    }

    changeIframeColors(palette) {
        // TODO: logic here!
    }
}

customElements.define('owp-design-preview-modal', OwpDesignPreviewModal);