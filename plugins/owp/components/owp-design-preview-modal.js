/**
 * @class OwpDesignPreviewModal
 * @augments HTMLElement
 * @description Web component for displaying a full-screen design preview modal.
 */
class OwpDesignPreviewModal extends HTMLElement {
	static observedAttributes = ['template-id', 'url', 'name'];

	fontPairs = [
		{ heading: 'Playfair Display', body: 'Open Sans' },
		{ heading: 'Lato', body: 'Lora' },
		{ heading: 'Barlow Semi Condensed', body: 'Roboto' },
		{ heading: 'Monsterrat', body: 'Source Sans Pro' },
		{ heading: 'Rubik', body: 'Karla' },
		{ heading: 'DM Serif Display', body: 'Work Sans' },
	];

	palettes = [
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
	palette = this.palettes[0];

	responsiveResolutions = {
		desktop: { width: '1366px', height: '768px' },  //1920x1080
		tablet: { width: '545px', height: '768px' },    //768x1080
		mobile: { width: '300px', height: '650px' }     //422x915
	};
	responsiveResolution = this.responsiveResolutions.desktop;

	id = null;
	url = null;
	name = null;
	sidebar = null;
	closeButton = null;
	returnToOtherDesignsButton = null;
	createButton = null;
	iframe = null;
	preview = null;
	selectedFontPairPreview = null;
	selectedPalettePreview = null;
	previewContainer = null;
	falseBrowserHeader = null;
	modalContainer = null;

	/**
	 * @description Constructs the OwpDesignPreviewModal instance.
	 * @returns {void}
	 */
	constructor() {
		super();
		this.className = `fixed top-0 left-0 z-10 w-full h-full flex p-8`;
		this.innerHTML = /*html*/`
			<div id="modalContainer" class="relative flex flex-row w-full h-full rounded-2xl overflow-hidden border border-slate-700 transition-all duration-300 ease-out transform scale-95 opacity-0">

				<!-- Loading Mask -->
				<div id="loadingMaskModal" class="absolute inset-0 bg-slate-900 flex justify-center items-center">
					<span class="text-slate-700 text-lg font-sans font-semibold animate-pulse">
						<div class="picture-loader"></div>
					</span>
				</div>

				<!-- Sidebar -->
				<div id="sidebarModal" class="shrink-0 lg:w-[350px] w-0 h-full bg-slate-950 lg:p-8 p-0 lg:visible invisible">
					<!-- Sidebar Container -->
					<div class="flex flex-col justify-between w-full h-full">
						<!-- Obsidian Logo -->
						<div class="flex items-center justify-start mb-6">
							<img
								src="/wp-content/plugins/owp/assets/icons/obsidian-logo.png"
								class="w-10 h-10 rounded-full"
							/>
						</div>

						<!-- Site Logo Upload -->
						<div class="flex flex-col gap-2 mb-6">
							<label class="flex text-slate-400 text-sm font-semibold">
								Site Logo
							</label>
							<div class="min-h-20 flex grow items-center justify-center border-2 border-slate-700 rounded-md p-4 cursor-pointer bg-slate-900 hover:bg-slate-950 hover:outline hover:outline-offset-2 hover:outline-cyan-500 transition-colors duration-200">
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
									<div id="fontPairNo${index}" class="flex grow items-center justify-center w-1/4 h-10 border border-slate-700 hover:outline hover:bg-slate-950 outline-cyan-500 rounded-md text-slate-300 text-md cursor-pointer bg-slate-900 transition-colors duration-200">
										<span	class="font-bold text-lg"	style="font-family: ${fontPair.heading};">
											A
										</span>
										<span class="font-normal text-lg"	style="font-family: ${fontPair.body};">
											g
										</span>
									</div>
								`).join('')}
							</div>
						</div>

						<!-- Color Palette Selection -->
						<div class="flex flex-col gap-2 mb-6">
							<div class="flex items-center gap-2">
								<label class="flex text-slate-400 text-sm font-semibold">
									Color Palette:
								</label>
								<span id="selectedPalettePreview" class="flex-1 text-slate-100 text-[14px] font-normal text-wrap">
									${this.palette.replace('astra-palette-', '').charAt(0).toUpperCase() + this.palette.replace('astra-palette-', '').slice(1)}
								</span>
							</div>
							<div class="grid grid-cols-5 gap-1">
								${this.palettes.map((palette, index) => /*html*/`
									<div id="paletteNo${index}" class="flex justify-center items-center gap-1 py-2 bg-(--ast-global-color-5) border border-slate-700 rounded-lg cursor-pointer hover:outline hover:outline-cyan-500 hover:outline-offset-2 ${palette}">
										<div class="size-4 rounded-full bg-(--ast-global-color-0)"></div>
										<div class="size-4 rounded-full bg-(--ast-global-color-1)"></div>
									</div>
								`).join('')}
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="flex flex-col gap-2 mb-6">
							<button id="createButton" class="w-full flex gap-2 bg-cyan-600 hover:bg-cyan-500 text-slate-100 text-sm font-semibold py-3 rounded-md flex items-center justify-center cursor-pointer transition-colors duration-200">
								<span>Create</span>
								<img class="size-5" src="/wp-content/plugins/owp/assets/icons/arrow-right.svg" />
							</button>
							<button id="returnToOtherDesignsButton" class="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold py-3 rounded-md cursor-pointer transition-colors duration-200">
								<span>Back to Other Designs</span>
							</button>
						</div>

						<!-- Responsive Preview Buttons-->
						<div class="flex items-center justify-between border-t border-slate-700 pt-4">
							<span class="text-slate-400 text-sm font-semibold">Responsive Preview</span>
							<div class="flex gap-2">
								<button id="desktopPreview" class="p-2 bg-slate-900 hover:bg-slate-800 text-slate-100 text-sm font-semibold border border-slate-700 rounded-md cursor-pointer">
									<img src="/wp-content/plugins/owp/assets/icons/desktop.svg" alt="Desktop Icon" class="w-5 h-5">
								</button>
								<button id="tabletPreview" class="p-2 bg-slate-900 hover:bg-slate-800 text-slate-100 text-sm font-semibold border border-slate-700 rounded-md cursor-pointer">
									<img src="/wp-content/plugins/owp/assets/icons/tablet.svg" alt="Tablet Icon" class="w-5 h-5">
								</button>
								<button id="mobilePreview" class="p-2 bg-slate-900 hover:bg-slate-800 text-slate-100 text-sm font-semibold border border-slate-700 rounded-md cursor-pointer">
									<img src="/wp-content/plugins/owp/assets/icons/mobile.svg" alt="Mobile Icon" class="w-5 h-5">
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Iframe -->
				<div class="grow-1 flex justify-center items-center p-10 bg-slate-900">
					<div
						id="previewContainer"
						class="flex flex-col rounded-lg overflow-hidden"
						style="width: ${this.responsiveResolution.width}; height: ${this.responsiveResolution.height};"
					>
						<div id="falseBrowserHeader" class="flex-0 flex flex-row justify-between items-center h-8 bg-slate-100 p-2">
							<img src="/wp-content/plugins/owp/assets/icons/globe.svg" class="size-4"/>
							<div class="flex justify-center items-center gap-2">
								<div class="size-4 bg-yellow-500 rounded-full"></div>
								<div class="size-4 bg-green-500 rounded-full"></div>
								<div class="size-4 bg-red-500 rounded-full"></div>
							</div>
						</div>
						<iframe	src="" class="flex-1 bg-slate-100" frameborder="0"></iframe>
					</div>
				</div>

				<!-- Close Button -->
				<button id="closeModal" class="absolute top-1 right-1 p-1 bg-slate-700 rounded-full hover:bg-slate-600 cursor-pointer">
					<img src="/wp-content/plugins/owp/assets/icons/x.svg" alt="Close Icon" class="w-6 h-6">
				</button>
			</div>
		`;
	}


	/**
	 * @description Called when the element is added to the document's DOM.
	 * @returns {void}
	 */
	connectedCallback() {
		this.id = this.getAttribute('template-id');
		this.url = this.getAttribute('url');
		this.name = this.getAttribute('name');
		this.title = this.getAttribute('title');
		this.imgCssIds = this.getAttribute('img-css-ids')

		this.sidebar = this.querySelector('#sidebarModal');
		this.closeButton = this.querySelector('#closeModal');
		this.returnToOtherDesignsButton = this.querySelector('#returnToOtherDesignsButton');
		this.createButton = this.querySelector('#createButton');
		this.iframe = this.querySelector('iframe');
		this.selectedFontPairPreview = this.querySelector('#selectedFontPairPreview');
		this.selectedPalettePreview = this.querySelector('#selectedPalettePreview');
		this.previewContainer = this.querySelector('#previewContainer');
		this.falseBrowserHeader = this.querySelector('#falseBrowserHeader');
		this.modalContainer = this.querySelector('#modalContainer');

		if (this.iframe) {
			this.iframe.src = this.url;
			this.iframe.onload = this.#handleIframeLoad.bind(this);
		}

		// Animate modal open
		setTimeout(() => {
			this.modalContainer.classList.remove('scale-95', 'opacity-0');
			this.modalContainer.classList.add('scale-100', 'opacity-100');
		}, 10);

		this.closeButton.onclick = this.#closeModal.bind(this);
		this.returnToOtherDesignsButton.onclick = this.#closeModal.bind(this);
		this.createButton.onclick = this.#createPage.bind(this);

		const paletteName = this.palette
			.replace('astra-palette-', '')
			.charAt(0)
			.toUpperCase() + this.palette.replace('astra-palette-', '').slice(1);

		window.owpSessionManager.updatePayloadSection('design', {
			template: this.id,
			name: this.name,
			font: this.fontPairs[0],
			palette: paletteName
		});

		this.fontPairs.forEach((fontPair, index) => {
			this.querySelector(`#fontPairNo${index}`).onclick = () => {
				this.#changeIFrameFontFamily(fontPair);
			};
		});

		this.palettes.forEach((palette, index) => {
			this.querySelector(`#paletteNo${index}`).onclick = () => {
				this.#changeIFramePalette(palette);
			};
		});

		Object.keys(this.responsiveResolutions).forEach(key => {
			this.querySelector(`#${key}Preview`).onclick = () => {
				this.#changeResponsiveResolution(key);
			};
		});
		// window.addEventListener('design-selected', this.#handleDesignSelected.bind(this));

	}


	/**
	 * @description Called when the element is removed from the document's DOM.
	 * @returns {void}
	 */
	disconnectedCallback() {
		if (this.iframe) {
			this.iframe.onload = null;
		}
		if (this.closeButton) {
			this.closeButton.onclick = null;
		}
		if (this.returnToOtherDesignsButton) {
			this.returnToOtherDesignsButton.onclick = null;
		}
		if (this.createButton) {
			this.createButton.onclick = null;
		}
		this.fontPairs.forEach((fontPair, index) => {
			const element = this.querySelector(`#fontPairNo${index}`);
			if (element) {
				element.onclick = null;
			}
		});
		this.palettes.forEach((palette, index) => {
			const element = this.querySelector(`#paletteNo${index}`);
			if (element) {
				element.onclick = null;
			}
		});
		Object.keys(this.responsiveResolutions).forEach(key => {
			const element = this.querySelector(`#${key}Preview`);
			if (element) {
				element.onclick = null;
			}
		});
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
				this.url = newVal;
				if (this.iframe) {
					this.iframe.src = this.url;
				}
				break;
			case 'name':
				this.name = newVal;
				break;
		}
	}


	/**
	 * @private
	 * @description Handles the iframe load event.
	 * @returns {void}
	*/
	#handleIframeLoad() {
		this.preview = this.iframe.contentDocument || this.iframe.contentWindow.document;

		const previewBody = this.preview.body;
		previewBody.style.zoom = 0.8;
		previewBody.classList.add(this.palette);

		const linkGoogleFonts = `
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=DM+Serif+Display:ital@0;1&family=Karla:ital,wght@0,200..800;1,200..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
		`;

		const previewHead = this.preview.head;
		previewHead.insertAdjacentHTML('beforeend', linkGoogleFonts);
		document.head.insertAdjacentHTML('beforeend', linkGoogleFonts);

		// Hydrate images using img-css-ids
		const homeCssIds = JSON.parse(atob(this.imgCssIds)).home;
		const mergePictures = JSON.parse(sessionStorage.getItem('owp_payload')).pictures.merge

		Object.keys(homeCssIds).forEach((key, index) => {
			const urlToHydrate = mergePictures[index].urls.raw
			const containerDiv = previewBody.querySelector(`#${key}`)
			if (!containerDiv) return
			let targetImg = containerDiv.querySelector('img')
			if (!targetImg) {
				// Set ::before css style
				containerDiv.style.backgroundImage = `url(${urlToHydrate})`;
				console.debug(key, `url(${urlToHydrate})`)
			}	else if (targetImg) {
				targetImg.src = urlToHydrate
				console.debug(key, urlToHydrate)
			}
		});

		// Remove 'Loading...' message
		const loadingMaskModal = this.querySelector('#loadingMaskModal');
		if (loadingMaskModal) {
			loadingMaskModal.remove();
		}
	}


	/**
	 * @private
	 * @description Closes the modal and resets design payload.
	 * @returns {void}
	 */
	#closeModal() {
		this.modalContainer.classList.remove('scale-100', 'opacity-100');
		this.modalContainer.classList.add('scale-95', 'opacity-0');

		this.modalContainer.addEventListener('transitionend', () => {
			this.remove();
			window.owpSessionManager.updatePayloadSection('design', {
				template: null,
				font: null,
				palette: null
			});
		}, { once: true });
	}


	/**
	 * @private
	 * @description Changes the font family of the iframe content.
	 * @param {Object} fontPair - The selected font pair.
	 * @returns {void}
	 */
	#changeIFrameFontFamily(fontPair) {
		if (this.selectedFontPairPreview) {
			this.selectedFontPairPreview.innerHTML = /*html*/`
                ${fontPair.heading} & ${fontPair.body}
            `;
		}

		const currentPayload = window.owpSessionManager.getPayload();
		window.owpSessionManager.updatePayloadSection('design', {
			...currentPayload.design,
			font: fontPair
		});

		if (this.iframe && this.iframe.contentDocument) {
			const iframeHead = this.iframe.contentDocument.head;
			let previewAstraFontFamily = iframeHead.querySelector('#previewAstraFontFamily');
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
				</style>
			`;

			if (!previewAstraFontFamily) {
				iframeHead.insertAdjacentHTML('beforeend', styleTemplate);
			} else {
				previewAstraFontFamily.innerHTML = styleTemplate;
			}
		}
	}


	/**
	 * @private
	 * @description Changes the color palette of the iframe content.
	 * @param {string} palette - The selected palette class name.
	 * @returns {void}
	 */
	#changeIFramePalette(palette) {
		if (this.preview && this.preview.body) {
			const previewBody = this.preview.body;

			previewBody.classList.remove(this.palette);
			this.palette = palette;
			previewBody.classList.add(this.palette);

			const paletteName = this.palette
				.replace('astra-palette-', '')
				.charAt(0)
				.toUpperCase() + this.palette.replace('astra-palette-', '').slice(1);

			if (this.selectedPalettePreview) {
				this.selectedPalettePreview.innerHTML = paletteName;
			}

			const currentPayload = window.owpSessionManager.getPayload();
			window.owpSessionManager.updatePayloadSection('design', {
				...currentPayload.design,
				palette: paletteName
			});
		}
	}


	/**
	 * @private
	 * @description Changes the responsive resolution of the preview iframe.
	 * @param {string} type - The type of resolution ('desktop', 'tablet', 'mobile').
	 * @returns {void}
	 */
	#changeResponsiveResolution(type) {
		if (this.previewContainer) {
			this.responsiveResolution = this.responsiveResolutions[type];
			this.previewContainer.style.width = this.responsiveResolution.width;
			this.previewContainer.style.height = this.responsiveResolution.height;
		}

		if (this.falseBrowserHeader) {
			(type === 'desktop')
				? this.falseBrowserHeader.classList.remove('hidden')
				: this.falseBrowserHeader.classList.add('hidden');
		}
	}


	/**
	 * @private
	 * @description Sends a request to create a new page based on the current design payload.
	 * @returns {void}
	 */
	#createPage() {
		fetch('/wp-json/owp/api/page', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(window.owpSessionManager.getPayload())
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				window.dispatchEvent(new CustomEvent('page-created', {
					detail: { success: true, data: data }
				}));
			})
			.catch(error => {
				console.error('Error creating page:', error);
				window.dispatchEvent(new CustomEvent('page-created', {
					detail: { success: false, error: error }
				}));
			});
	}


	/**
	 * @private
	 * @description Handles the 'design-selected' event.
	 * @param {CustomEvent} event - The custom event.
	 * @returns {void}
	 */
	#handleDesignSelected(event) {
		// Placeholder for handling the design-selected event.
		// The actual logic will be implemented based on requirements.
		console.log('Design selected event received:', event.detail);
	}
}

customElements.define('owp-design-preview-modal', OwpDesignPreviewModal);