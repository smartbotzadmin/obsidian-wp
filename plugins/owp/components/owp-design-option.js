/**
 * @class OwpDesignOption
 * @augments HTMLElement
 * @description Web component for a single design option in the design grid.
 */
class OwpDesignOption extends HTMLElement {
    /**
     * @description Constructs the OwpDesignOption instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = `flex flex-col grow w-full sm:w-1/3 lg:w-1/4 xl:w-1/5 h-[480px] bg-slate-950 rounded-lg border border-slate-700 cursor-pointer hover:border-slate-700`;
        this.innerHTML = `
            <div class="relative flex grow items-center justify-center bg-slate-900 text-slate-100 overflow-hidden">
                <img src="/wp-content/plugins/owp/assets/icons/image.svg" alt="Image Icon" class="w-full h-full opacity-25">
                <span class="absolute top-2 right-2 bg-cyan-400 text-slate-100 text-xs font-bold px-2 py-1 rounded-full">
                    PREMIUM
                </span>
            </div>
            <div class="flex flex-col grow-0 shrink-0 p-4 cursor-default">
                <div class="flex justify-between items-center">
                    <span class="text-slate-100 text-md font-semibold">
                        Option ${this.getAttribute('option-number') || '1'}
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
}

customElements.define('owp-design-option', OwpDesignOption);