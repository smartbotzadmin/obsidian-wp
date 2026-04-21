/**
 * @class ObsiaDesignPreviewModal
 * @augments HTMLElement
 * @description Web component for displaying a full-screen design preview modal.
 */
class ObsiaDesignPreviewModal extends HTMLElement {
  static observedAttributes = ["template-id", "url", "name"];

  fontPairs = [
    { heading: "'Playfair Display', serif", body: "'Open Sans', sans-serif" },
    { heading: "'Lato', sans-serif", body: "'Lora', serif" },
    { heading: "'Barlow Semi Condensed', sans-serif", body: "'Roboto', sans-serif" },
    { heading: "'Montserrat', sans-serif", body: "'Source Sans Pro', sans-serif" },
    { heading: "'Rubik', sans-serif", body: "'Karla', sans-serif" },
    { heading: "'DM Serif Display', serif", body: "'Work Sans', sans-serif" },
  ];

  palettes = [
    "astra-palette-oak",
    "astra-palette-viola",
    "astra-palette-cedar",
    "astra-palette-widow",
    "astra-palette-lily",
    "astra-palette-rose",
    "astra-palette-sage",
    "astra-palette-flare",
    "astra-palette-maple",
    "astra-palette-brich",
    "astra-palette-dark",
  ];
  palette = this.palettes[0];

  responsiveResolutions = {
    desktop: { width: "1366px", height: "768px" }, //1920x1080
    tablet: { width: "545px", height: "768px" }, //768x1080
    mobile: { width: "300px", height: "650px" }, //422x915
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
  creatingPageOverlay = null;
  creatingPageLoader = null;
  creatingPageSuccess = null;
  homePageLink = null;

  /**
   * @description Constructs the ObsiaDesignPreviewModal instance.
   * @returns {void}
   */
  constructor() {
    super();
    this.className = `fixed top-0 left-0 z-10 w-full h-full flex p-8`;
    this.innerHTML = /*html*/ `
			<div id="modalContainer" class="relative flex flex-row w-full h-full rounded-2xl overflow-hidden border border-slate-700 transition-all duration-300 ease-out transform scale-95 opacity-0">

				<!-- Creating Page Overlay -->
				<div id="creatingPageOverlay" class="absolute inset-0 bg-slate-900 flex flex-col justify-center items-center z-20 hidden">
					<div id="creatingPageLoader" class="flex flex-col justify-center items-center">
						<span class="creation-loader size-30"></span>
						<span class="text-slate-400 text-lg font-gold mt-4">
							Please wait a while, we're cooking
						</span>
					</div>
					<div id="creatingPageSuccess" class="flex flex-col justify-center items-center hidden">
						<img src="${obsia_vars.plugin_url}assets/icons/check.png" class="w-16 h-16 mb-4"/>
						<a id="homePageLink" href="#" target="_blank" class="flex gap-2 justify-center items-center text-cyan-500 text-xl font-gold  font-semibold hover:underline">
							<img src="${obsia_vars.plugin_url}assets/icons/external-link.svg" /> Go to New Site
						</a>
					</div>
				</div>

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
								src="${obsia_vars.plugin_url}assets/icons/obsidian-logo.png"
								class="w-10 h-10 rounded-full"
							/>
						</div>

						<!-- Site Logo Upload -->
						<div class="flex flex-col gap-2 mb-6">
							<label class="flex text-slate-400 text-sm font-semibold">
								Site Logo
							</label>
							<div class="min-h-20 flex grow items-center justify-center border-2 border-slate-700 rounded-xl p-4 cursor-pointer bg-slate-900 hover:bg-slate-950 hover:outline hover:outline-offset-2 hover:outline-cyan-500 transition-colors duration-200">
								<img src="${obsia_vars.plugin_url}assets/icons/image.svg" />
							</div>
						</div>

						<!-- Font Pair Selection -->
						<div class="flex flex-col gap-2 mb-6">
							<div class="flex items-center gap-2">
								<label class="flex shrink-0 items-center text-slate-400 text-sm font-semibold">
									Font Pair:
								</label>
								<span id="selectedFontPairPreview" class="flex-1 text-slate-100 text-[14px] font-normal text-wrap">
									<!-- Font preview placeholder -->
								</span>
							</div>
							<div class="flex flex-wrap gap-2">
								${this.fontPairs
                  .map(
                    (fontPair, index) => /*html*/ `
									<div id="fontPairNo${index}" class="flex grow items-center justify-center w-1/4 h-10 border border-slate-700 hover:outline hover:bg-slate-950 outline-cyan-500 rounded-xl text-slate-300 text-md cursor-pointer bg-slate-900 transition-colors duration-200">
										<span	class="font-bold text-lg"	style="font-family: ${fontPair.heading};">
											A
										</span>
										<span class="font-normal text-lg"	style="font-family: ${fontPair.body};">
											g
										</span>
									</div>
								`,
                  )
                  .join("")}
							</div>
						</div>

						<!-- Color Palette Selection -->
						<div class="flex flex-col gap-2 mb-6">
							<div class="flex items-center gap-2">
								<label class="flex text-slate-400 text-sm font-semibold">
									Color Palette:
								</label>
								<span id="selectedPalettePreview" class="flex-1 text-slate-100 text-[14px] font-normal text-wrap">
									<!-- Palette preview placeholder -->
								</span>
							</div>
							<div class="grid grid-cols-5 gap-1">
								${this.palettes
                  .map(
                    (palette, index) => /*html*/ `
									<div id="paletteNo${index}" class="flex justify-center items-center gap-1 py-2 bg-(--ast-global-color-5) border border-slate-700 rounded-xl cursor-pointer hover:outline hover:outline-cyan-500 hover:outline-offset-2 ${palette}">
										<div class="size-4 rounded-full bg-(--ast-global-color-0)"></div>
										<div class="size-4 rounded-full bg-(--ast-global-color-1)"></div>
									</div>
								`,
                  )
                  .join("")}
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="flex flex-col gap-2 mb-6">
							<button id="createButton" class="w-full flex gap-2 bg-cyan-600 hover:bg-cyan-500 text-slate-100 text-md font-semibold py-3 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-200">
								<span>Create</span>
								<img class="size-5" src="${obsia_vars.plugin_url}assets/icons/arrow-right.svg" />
							</button>
							<button id="returnToOtherDesignsButton" class="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-md font-semibold py-3 rounded-xl cursor-pointer transition-colors duration-200">
								<span>Back to Other Designs</span>
							</button>
						</div>

						<!-- Responsive Preview Buttons-->
						<div class="flex items-center justify-between border-t border-slate-700 pt-4">
							<span class="text-slate-400 text-sm font-semibold">Responsive Preview</span>
							<div class="flex gap-2">
								<button id="desktopPreview" class="p-2 bg-slate-900 hover:bg-slate-800 text-slate-100 text-sm font-semibold border border-slate-700 rounded-xl cursor-pointer">
									<img src="${obsia_vars.plugin_url}assets/icons/desktop.svg" alt="Desktop Icon" class="w-5 h-5">
								</button>
								<button id="tabletPreview" class="p-2 bg-slate-900 hover:bg-slate-800 text-slate-100 text-sm font-semibold border border-slate-700 rounded-xl cursor-pointer">
									<img src="${obsia_vars.plugin_url}assets/icons/tablet.svg" alt="Tablet Icon" class="w-5 h-5">
								</button>
								<button id="mobilePreview" class="p-2 bg-slate-900 hover:bg-slate-800 text-slate-100 text-sm font-semibold border border-slate-700 rounded-xl cursor-pointer">
									<img src="${obsia_vars.plugin_url}assets/icons/mobile.svg" alt="Mobile Icon" class="w-5 h-5">
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
							<img src="${obsia_vars.plugin_url}assets/icons/globe.svg" class="size-4"/>
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
					<img src="${obsia_vars.plugin_url}assets/icons/x.svg" alt="Close Icon" class="w-6 h-6">
				</button>
			</div>
		`;
    this.selectedFontPairPreview = this.querySelector("#selectedFontPairPreview");
    this.selectedPalettePreview = this.querySelector("#selectedPalettePreview");

    // After the element is in the DOM, set textContent for dynamic spans
    if (this.selectedFontPairPreview) {
      const fontHeading = this.fontPairs[0].heading.replace(/'/g, "").split(",")[0];
      const fontBody = this.fontPairs[0].body.replace(/'/g, "").split(",")[0];
      this.selectedFontPairPreview.textContent = `${fontHeading} & ${fontBody}`;
    }
    if (this.selectedPalettePreview) {
      const paletteName =
        this.palette.replace("astra-palette-", "").charAt(0).toUpperCase() +
        this.palette.replace("astra-palette-", "").slice(1);
      this.selectedPalettePreview.textContent = paletteName;
    }
  }

  /**
   * @description Called when the element is added to the document's DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.id = this.getAttribute("template-id");
    this.url = this.getAttribute("url");
    this.name = this.getAttribute("name");
    this.title = this.getAttribute("title");
    this.imgCssIds = this.getAttribute("img-css-ids");

    this.sidebar = this.querySelector("#sidebarModal");
    this.closeButton = this.querySelector("#closeModal");
    this.returnToOtherDesignsButton = this.querySelector("#returnToOtherDesignsButton");
    this.createButton = this.querySelector("#createButton");
    this.iframe = this.querySelector("iframe");
    this.selectedFontPairPreview = this.querySelector("#selectedFontPairPreview");
    this.selectedPalettePreview = this.querySelector("#selectedPalettePreview");
    this.previewContainer = this.querySelector("#previewContainer");
    this.falseBrowserHeader = this.querySelector("#falseBrowserHeader");
    this.modalContainer = this.querySelector("#modalContainer");
    this.creatingPageOverlay = this.querySelector("#creatingPageOverlay");
    this.creatingPageLoader = this.querySelector("#creatingPageLoader");
    this.creatingPageSuccess = this.querySelector("#creatingPageSuccess");
    this.homePageLink = this.querySelector("#homePageLink");

    if (this.iframe) {
      this.iframe.src = this.url; //+ "?obsia-preview=true";
      this.iframe.onload = this.#handleIframeLoad.bind(this);
    }

    // Animate modal open
    setTimeout(() => {
      this.modalContainer.classList.remove("scale-95", "opacity-0");
      this.modalContainer.classList.add("scale-100", "opacity-100");
    }, 10);

    this.closeButton.onclick = this.#closeModal.bind(this);
    this.returnToOtherDesignsButton.onclick = this.#closeModal.bind(this);
    this.createButton.onclick = this.#createPage.bind(this);

    const paletteName =
      this.palette.replace("astra-palette-", "").charAt(0).toUpperCase() +
      this.palette.replace("astra-palette-", "").slice(1);

    window.obsiaSessionManager.updatePayloadSection("design", {
      template: this.id,
      name: this.name,
      font: this.fontPairs[0],
      palette: paletteName,
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

    Object.keys(this.responsiveResolutions).forEach((key) => {
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
    Object.keys(this.responsiveResolutions).forEach((key) => {
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
      case "template-id":
        this.id = newVal;
        break;
      case "url":
        this.url = newVal;
        if (this.iframe) {
          this.iframe.src = this.url; // + "?obsia-preview=true";
        }
        break;
      case "name":
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

    const previewHead = this.preview.head;

    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@400;600&family=DM+Serif+Display&family=Karla:wght@400;600&family=Lato:wght@400;600&family=Lora:wght@400;600&family=Montserrat:wght@400;600&family=Open+Sans:wght@400;600&family=Playfair+Display:wght@400;600&family=Roboto:wght@400;600&family=Rubik:wght@400;600&family=Source+Sans+Pro:wght@400;600&family=Work+Sans:wght@400;600&display=swap";
    previewHead.appendChild(fontLink);

    const paletteStyle = document.createElement("style");
    paletteStyle.textContent = `
      .astra-palette-oak {
        --ast-global-color-0: #0067ff;
        --e-global-color-astglobalcolor0: #0067ff;
        --ast-global-color-1: #005ee9;
        --e-global-color-astglobalcolor1: #005ee9;
        --ast-global-color-2: #0f172a;
        --e-global-color-astglobalcolor2: #0f172a;
        --ast-global-color-3: #364151;
        --e-global-color-astglobalcolor3: #364151;
        --ast-global-color-4: #ffffff;
        --e-global-color-astglobalcolor4: #ffffff;
        --ast-global-color-5: #e7f6ff;
        --e-global-color-astglobalcolor5: #e7f6ff;
        --ast-global-color-6: #070614;
        --e-global-color-astglobalcolor6: #070614;
        --ast-global-color-7: #d1dae5;
        --e-global-color-astglobalcolor7: #d1dae5;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
      .astra-palette-viola {
        --ast-global-color-0: #6528f7;
        --e-global-color-astglobalcolor0: #6528f7;
        --ast-global-color-1: #5511f8;
        --e-global-color-astglobalcolor1: #5511f8;
        --ast-global-color-2: #0f172a;
        --e-global-color-astglobalcolor2: #0f172a;
        --ast-global-color-3: #454f5e;
        --e-global-color-astglobalcolor3: #454f5e;
        --ast-global-color-4: #ffffff;
        --e-global-color-astglobalcolor4: #ffffff;
        --ast-global-color-5: #f2f0fe;
        --e-global-color-astglobalcolor5: #f2f0fe;
        --ast-global-color-6: #0d0614;
        --e-global-color-astglobalcolor6: #0d0614;
        --ast-global-color-7: #d8d8f5;
        --e-global-color-astglobalcolor7: #d8d8f5;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
      .astra-palette-cedar {
        --ast-global-color-0: #dd183b;
        --e-global-color-astglobalcolor0: #dd183b;
        --ast-global-color-1: #cc1939;
        --e-global-color-astglobalcolor1: #cc1939;
        --ast-global-color-2: #0f172a;
        --e-global-color-astglobalcolor2: #0f172a;
        --ast-global-color-3: #3a3a3a;
        --e-global-color-astglobalcolor3: #3a3a3a;
        --ast-global-color-4: #ffffff;
        --e-global-color-astglobalcolor4: #ffffff;
        --ast-global-color-5: #ffede6;
        --e-global-color-astglobalcolor5: #ffede6;
        --ast-global-color-6: #140609;
        --e-global-color-astglobalcolor6: #140609;
        --ast-global-color-7: #ffd1bf;
        --e-global-color-astglobalcolor7: #ffd1bf;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
      .astra-palette-widow {
        --ast-global-color-0: #54b435;
        --e-global-color-astglobalcolor0: #54b435;
        --ast-global-color-1: #379237;
        --e-global-color-astglobalcolor1: #379237;
        --ast-global-color-2: #0f172a;
        --e-global-color-astglobalcolor2: #0f172a;
        --ast-global-color-3: #2f3b40;
        --e-global-color-astglobalcolor3: #2f3b40;
        --ast-global-color-4: #ffffff;
        --e-global-color-astglobalcolor4: #ffffff;
        --ast-global-color-5: #edfbe2;
        --e-global-color-astglobalcolor5: #edfbe2;
        --ast-global-color-6: #0c1406;
        --e-global-color-astglobalcolor6: #0c1406;
        --ast-global-color-7: #d5ead8;
        --e-global-color-astglobalcolor7: #d5ead8;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
      .astra-palette-lily {
        --ast-global-color-0: #dca54a;
        --e-global-color-astglobalcolor0: #dca54a;
        --ast-global-color-1: #d09a40;
        --e-global-color-astglobalcolor1: #d09a40;
        --ast-global-color-2: #0f172a;
        --e-global-color-astglobalcolor2: #0f172a;
        --ast-global-color-3: #4a4a4a;
        --e-global-color-astglobalcolor3: #4a4a4a;
        --ast-global-color-4: #ffffff;
        --e-global-color-astglobalcolor4: #ffffff;
        --ast-global-color-5: #faf5e5;
        --e-global-color-astglobalcolor5: #faf5e5;
        --ast-global-color-6: #141004;
        --e-global-color-astglobalcolor6: #141004;
        --ast-global-color-7: #f0e6c5;
        --e-global-color-astglobalcolor7: #f0e6c5;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
      .astra-palette-rose {
        --ast-global-color-0: #fb5fab;
        --e-global-color-astglobalcolor0: #fb5fab;
        --ast-global-color-1: #ea559d;
        --e-global-color-astglobalcolor1: #ea559d;
        --ast-global-color-2: #0f172a;
        --e-global-color-astglobalcolor2: #0f172a;
        --ast-global-color-3: #454f5e;
        --e-global-color-astglobalcolor3: #454f5e;
        --ast-global-color-4: #ffffff;
        --e-global-color-astglobalcolor4: #ffffff;
        --ast-global-color-5: #fceef5;
        --e-global-color-astglobalcolor5: #fceef5;
        --ast-global-color-6: #140610;
        --e-global-color-astglobalcolor6: #140610;
        --ast-global-color-7: #fad8e9;
        --e-global-color-astglobalcolor7: #fad8e9;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
      .astra-palette-sage {
        --ast-global-color-0: #1b9c85;
        --e-global-color-astglobalcolor0: #1b9c85;
        --ast-global-color-1: #178e79;
        --e-global-color-astglobalcolor1: #178e79;
        --ast-global-color-2: #0f172a;
        --e-global-color-astglobalcolor2: #0f172a;
        --ast-global-color-3: #454f5e;
        --e-global-color-astglobalcolor3: #454f5e;
        --ast-global-color-4: #ffffff;
        --e-global-color-astglobalcolor4: #ffffff;
        --ast-global-color-5: #edf6ee;
        --e-global-color-astglobalcolor5: #edf6ee;
        --ast-global-color-6: #06140c;
        --e-global-color-astglobalcolor6: #06140c;
        --ast-global-color-7: #d4f3d7;
        --e-global-color-astglobalcolor7: #d4f3d7;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
      .astra-palette-flare {
        --ast-global-color-0: #fd9800;
        --e-global-color-astglobalcolor0: #fd9800;
        --ast-global-color-1: #e98c00;
        --e-global-color-astglobalcolor1: #e98c00;
        --ast-global-color-2: #0f172a;
        --e-global-color-astglobalcolor2: #0f172a;
        --ast-global-color-3: #454f5e;
        --e-global-color-astglobalcolor3: #454f5e;
        --ast-global-color-4: #ffffff;
        --e-global-color-astglobalcolor4: #ffffff;
        --ast-global-color-5: #fef9e1;
        --e-global-color-astglobalcolor5: #fef9e1;
        --ast-global-color-6: #141006;
        --e-global-color-astglobalcolor6: #141006;
        --ast-global-color-7: #f9f0c8;
        --e-global-color-astglobalcolor7: #f9f0c8;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
      .astra-palette-maple {
        --ast-global-color-0: #ff6210;
        --e-global-color-astglobalcolor0: #ff6210;
        --ast-global-color-1: #f15808;
        --e-global-color-astglobalcolor1: #f15808;
        --ast-global-color-2: #1c0d0a;
        --e-global-color-astglobalcolor2: #1c0d0a;
        --ast-global-color-3: #353535;
        --e-global-color-astglobalcolor3: #353535;
        --ast-global-color-4: #ffffff;
        --e-global-color-astglobalcolor4: #ffffff;
        --ast-global-color-5: #fef1e4;
        --e-global-color-astglobalcolor5: #fef1e4;
        --ast-global-color-6: #140b06;
        --e-global-color-astglobalcolor6: #140b06;
        --ast-global-color-7: #e5d7d1;
        --e-global-color-astglobalcolor7: #e5d7d1;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
      .astra-palette-brich {
        --ast-global-color-0: #737880;
        --e-global-color-astglobalcolor0: #737880;
        --ast-global-color-1: #65696f;
        --e-global-color-astglobalcolor1: #65696f;
        --ast-global-color-2: #151616;
        --e-global-color-astglobalcolor2: #151616;
        --ast-global-color-3: #393c40;
        --e-global-color-astglobalcolor3: #393c40;
        --ast-global-color-4: #ffffff;
        --e-global-color-astglobalcolor4: #ffffff;
        --ast-global-color-5: #f6f6f6;
        --e-global-color-astglobalcolor5: #f6f6f6;
        --ast-global-color-6: #232529;
        --e-global-color-astglobalcolor6: #232529;
        --ast-global-color-7: #f1f0f0;
        --e-global-color-astglobalcolor7: #f1f0f0;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
      .astra-palette-dark {
        --ast-global-color-0: #0085ff;
        --e-global-color-astglobalcolor0: #0085ff;
        --ast-global-color-1: #0177e3;
        --e-global-color-astglobalcolor1: #0177e3;
        --ast-global-color-2: #ffffff;
        --e-global-color-astglobalcolor2: #ffffff;
        --ast-global-color-3: #e7f6ff;
        --e-global-color-astglobalcolor3: #e7f6ff;
        --ast-global-color-4: #212a37;
        --e-global-color-astglobalcolor4: #212a37;
        --ast-global-color-5: #0f172a;
        --e-global-color-astglobalcolor5: #0f172a;
        --ast-global-color-6: #4f5b62;
        --e-global-color-astglobalcolor6: #4f5b62;
        --ast-global-color-7: #070614;
        --e-global-color-astglobalcolor7: #070614;
        --ast-global-color-8: #222222;
        --e-global-color-astglobalcolor8: #222222;
      }
    `;
    previewHead.appendChild(paletteStyle);

    // Hydrate images using img-css-ids
    const homeCssIds = JSON.parse(atob(this.imgCssIds)).home;
    const mergePictures = JSON.parse(sessionStorage.getItem("obsia_payload")).pictures.merge;

    Object.keys(homeCssIds).forEach((key, index) => {
      const urlToHydrate = mergePictures[index].urls.raw;
      const containerDiv = previewBody.querySelector(`#${key}`);
      if (!containerDiv) return;
      let targetImg = containerDiv.querySelector("img");
      if (!targetImg) {
        // Set ::before css style
        containerDiv.style.backgroundImage = `url(${urlToHydrate})`;
        console.debug(key, `url(${urlToHydrate})`);
      } else if (targetImg) {
        targetImg.removeAttribute("srcset");
        targetImg.removeAttribute("sizes");
        targetImg.src = urlToHydrate;
        console.debug(key, urlToHydrate);
      }
    });

    // Remove 'Loading...' message
    const loadingMaskModal = this.querySelector("#loadingMaskModal");
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
    this.modalContainer.classList.remove("scale-100", "opacity-100");
    this.modalContainer.classList.add("scale-95", "opacity-0");

    this.modalContainer.addEventListener(
      "transitionend",
      () => {
        this.remove();
        window.obsiaSessionManager.updatePayloadSection("design", {
          template: null,
          font: null,
          palette: null,
        });
      },
      { once: true },
    );
  }

  /**
   * @private
   * @description Changes the font family of the iframe content.
   * @param {Object} fontPair - The selected font pair.
   * @returns {void}
   */
  #changeIFrameFontFamily(fontPair) {
    if (this.selectedFontPairPreview) {
      const fontHeading = fontPair.heading.replace(/'/g, "").split(",")[0];
      const fontBody = fontPair.body.replace(/'/g, "").split(",")[0];
      this.selectedFontPairPreview.textContent = `${fontHeading} & ${fontBody}`;
    }

    const currentPayload = window.obsiaSessionManager.getPayload();
    window.obsiaSessionManager.updatePayloadSection("design", {
      ...currentPayload.design,
      font: fontPair,
    });

    if (this.iframe && this.iframe.contentDocument) {
      const iframeHead = this.iframe.contentDocument.head;
      let previewAstraFontFamily = iframeHead.querySelector("#previewAstraFontFamily");
      const fontHeading = fontPair.heading.replace(/'/g, "").split(",")[0];
      const fontBody = fontPair.body.replace(/'/g, "").split(",")[0];
      const styleContent = `
					/* headings */
					h1, h2, h3, h4, h5, h6, .entry-content :where(h1, h2, h3, h4, h5, h6), .site-title, .site-title a {
						font-family: ${fontHeading};
						font-weight: 600;
					}

					h1, .entry-content :where(h1) {
						font-size:54px;
						font-size:3.375rem;
						font-weight:600;
						font-family: ${fontHeading};
						line-height:1.4em;
					}
					h2, .entry-content :where(h2) {
						font-size:42px;
						font-size:2.625rem;
						font-weight:600;
						font-family: ${fontHeading};
						line-height:1.3em;
					}
					h3, .entry-content :where(h3) {
						font-size:36px;
						font-size:2.25rem;
						font-weight:600;
						font-family: ${fontHeading};
						line-height:1.3em;
					}
					h4, .entry-content :where(h4) {
						font-size:25px;
						font-size:1.5625rem;
						line-height:1.2em;
						font-weight:600;
						font-family: ${fontHeading};
					}
					h5, .entry-content :where(h5) {
						font-size:20px;
						font-size:1.25rem;
						line-height:1.2em;
						font-weight:600;
						font-family: ${fontHeading};
					}
					h6, .entry-content :where(h6) {
						font-size:15px;
						font-size:0.9375rem;
						line-height:1.25em;
						font-weight:600;
						font-family: ${fontHeading};
					}

					/* body */
					body, button, input, select, textarea, .ast-button, .ast-custom-button {
							font-family: ${fontPair.body};
							font-weight: 400;
							font-size: 16px;
							font-size: 1rem;
							line-height: var(--ast-body-line-height, 1.65);
					}
			`;

      if (!previewAstraFontFamily) {
        const style = document.createElement("style");
        style.id = "previewAstraFontFamily";
        style.textContent = styleContent;
        iframeHead.appendChild(style);
      } else {
        previewAstraFontFamily.textContent = styleContent;
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

      const paletteName =
        this.palette.replace("astra-palette-", "").charAt(0).toUpperCase() +
        this.palette.replace("astra-palette-", "").slice(1);

      if (this.selectedPalettePreview) {
        this.selectedPalettePreview.textContent = paletteName;
      }

      const currentPayload = window.obsiaSessionManager.getPayload();
      window.obsiaSessionManager.updatePayloadSection("design", {
        ...currentPayload.design,
        palette: paletteName,
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
      type === "desktop"
        ? this.falseBrowserHeader.classList.remove("hidden")
        : this.falseBrowserHeader.classList.add("hidden");
    }
  }

  /**
   * @private
   * @description Sends a request to create a new page based on the current design payload.
   * @returns {void}
   */
  #createPage() {
    this.creatingPageOverlay.classList.remove("hidden");
    this.creatingPageLoader.classList.remove("hidden");
    this.creatingPageSuccess.classList.add("hidden");

    const token = localStorage.getItem(window.cookieName);
    fetch("/wp-json/obsia/api/page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-WP-Nonce": obsia_vars.rest_nonce,
      },
      body: JSON.stringify(window.obsiaSessionManager.getPayload()),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.dispatchEvent(
          new CustomEvent("page-created", {
            detail: { success: true, data: data },
          }),
        );
        this.creatingPageLoader.classList.add("hidden");
        this.creatingPageSuccess.classList.remove("hidden");
        if (data.created && data.created.home) {
          this.homePageLink.href = data.created.home;
        }
      })
      .catch((error) => {
        console.error("Error creating page:", error);
        window.dispatchEvent(
          new CustomEvent("page-created", {
            detail: { success: false, error: error },
          }),
        );
        this.creatingPageOverlay.classList.add("hidden");
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
    console.log("Design selected event received:", event.detail);
  }
}

customElements.define("obsia-design-preview-modal", ObsiaDesignPreviewModal);
