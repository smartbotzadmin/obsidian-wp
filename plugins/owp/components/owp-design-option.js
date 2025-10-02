/**
 * @class OwpDesignOption
 * @augments HTMLElement
 * @description Web component for a single design option in the design grid.
 */
class OwpDesignOption extends HTMLElement {

	constructor() {
		super();
		this.id = this.getAttribute('template-id')
		this.url = this.getAttribute('url') + '&owp-preview=true'
		this.name = this.getAttribute('name')
		this.option = this.getAttribute('option')

		this.className = `grow flex flex-col w-screen sm:w-1/3 lg:w-1/4 xl:w-1/5 h-[450px] bg-slate-950 rounded-lg border border-slate-700 cursor-pointer hover:border-slate-700 overflow-hidden`;
		this.innerHTML = /*html*/`
      <div class="relative flex grow items-center justify-center bg-slate-900 text-slate-100 overflow-hidden">
        <img
          id="loadingOption${this.option}"
          src="/wp-content/plugins/owp/assets/icons/image.svg"
          alt="Image Icon"
          class="absolute z-3 w-full h-full opacity-10 animate-pulse"
        />
        <div id="hoverScroller${this.option}" class="absolute w-full h-full z-2 bg-slate-900" ></div>
        <iframe
          class="h-full w-screen"
          src="${this.url}"
          frameborder="0"
        ></iframe>
      </div>
      <div class="flex flex-col grow-0 shrink-0 p-4 cursor-default">
        <div class="flex justify-between items-center">
          <span class="text-slate-100 text-md font-semibold">
            Option ${this.option}
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

	connectedCallback() {
		this.iframe = this.querySelector('iframe');
		this.hoverScroller = this.querySelector(`#hoverScroller${this.option}`);
		this.scrollInterval = null;
		this.currentScrollPostion = 0;
		this.scrollSpeed = 10;
		this.setIFrameStyles();
		this.scrollDownDesignOption();
		this.scrollUpDesignOption();

		this.hoverScroller.addEventListener('click', () => {
			const owpApp = document.querySelector('owp-app')
			if (owpApp) {
				const previewModal = new OwpDesignPreviewModal()
				previewModal.setAttribute('url', this.url)
				previewModal.setAttribute('template-id', this.id)
				previewModal.setAttribute('name', this.name)
				owpApp.shadowRoot.appendChild(previewModal);
			}
		});
	}

	setIFrameStyles() {
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
			iframeBody.style.zoom = 0.5;

			const loadingOptionImg = this.querySelector(`#loadingOption${this.option}`)
			loadingOptionImg.classList.remove('animate-pulse')
			loadingOptionImg.classList.add('hidden')

			const hoverScrollerBg = this.querySelector(`#hoverScroller${this.option}`)
			hoverScrollerBg.classList.remove('bg-slate-900')
		}
	}

	scrollDownDesignOption() {
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

	scrollUpDesignOption() {
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