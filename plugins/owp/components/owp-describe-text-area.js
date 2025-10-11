/**
 * @class OwpDescribeTextArea
 * @augments HTMLElement
 * @description Web component for a text area with character counting and AI writing features.
 */
class OwpDescribeTextArea extends HTMLElement {
    /**
     * @description Constructs the OwpDescribeTextArea instance.
     * @returns {void}
     */
    constructor() {
        super();
        this.className = `flex flex-col mb-6`;
        this.innerHTML = `
            <div class="text-right text-slate-300 text-sm font-semibold mb-2 cursor-default">
                Characters: <span id="charCount">0</span> / <span id="maxChars">3000</span>
            </div>
            <textarea id="describeTextArea" class="w-full p-4 border border-slate-700 rounded-lg min-h-42 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-900 text-md text-slate-100" placeholder="E.g. Mantra Minds is a yoga studio located in Chino Hills, California. The studio offers a variety of classes such as Hatha yoga, Vinyasa flow, and Restorative yoga. The studio is led by Jane, an experienced and certified yoga instructor with over 10 years of teaching expertise. The welcoming atmosphere and personalized Jane make it a favorite among yoga enthusiasts in the area."></textarea>
            
            <div class="flex justify-between items-center">
                <owp-describe-ai-button></owp-describe-ai-button>
                <div class="flex items-center text-sm font-semibold text-slate-100">
                    <button id="prevSuggestion" class="p-1 cursor-pointer">
                        <img src="/wp-content/plugins/owp/assets/icons/chevron-left.svg"/>
                    </button>
                    <span id="suggestionIndex" class="mx-2 cursor-default">1 / 1</span>
                    <button id="nextSuggestion" class="p-1 cursor-pointer">
                        <img src="/wp-content/plugins/owp/assets/icons/chevron-right.svg"/>
                    </button>
                </div>
            </div>
        `;

        this.textArea = this.querySelector('#describeTextArea');
        this.charCountElement = this.querySelector('#charCount');
        this.maxCharsElement = this.querySelector('#maxChars');
        this.prevSuggestionButton = this.querySelector('#prevSuggestion');
        this.nextSuggestionButton = this.querySelector('#nextSuggestion');
        this.suggestionIndexElement = this.querySelector('#suggestionIndex');

        this.suggestions = this.#loadSuggestions();
        this.currentSuggestionIndex = this.suggestions.length > 0 ? this.suggestions.length - 1 : 0;
    }


    /**
     * @description Called when the element is added to the document's DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.textArea.addEventListener('input', this.updateCharCount.bind(this));
        this.prevSuggestionButton.addEventListener('click', this.showPrevSuggestion.bind(this));
        this.nextSuggestionButton.addEventListener('click', this.showNextSuggestion.bind(this));
        window.addEventListener('ai-text-generated', this.#handleAiTextGenerated.bind(this));
        this.#loadInitialValue();
        this.displayCurrentSuggestion();
        // Defer #updateAiButtonState to ensure owpSessionManager is available
        // This is a temporary measure. A more robust solution might involve
        // a custom event from OwpApp when owpSessionManager is ready.
        setTimeout(() => {
            this.#updateAiButtonState();
        }, 0);
        this.aiButton = this.querySelector('owp-describe-ai-button');
    }


    /**
     * @description Called when the element is removed from the document's DOM.
     * @returns {void}
     */
    disconnectedCallback() {
        this.textArea.removeEventListener('input', this.updateCharCount.bind(this));
        this.prevSuggestionButton.removeEventListener('click', this.showPrevSuggestion.bind(this));
        this.nextSuggestionButton.removeEventListener('click', this.showNextSuggestion.bind(this));
        window.removeEventListener('ai-text-generated', this.#handleAiTextGenerated.bind(this));
    }


    /**
     * @description Updates the displayed character count and the session payload.
     * @returns {void}
     */
    updateCharCount() {
        const currentLength = this.textArea.value.length;
        this.charCountElement.textContent = currentLength;
        window.owpSessionManager.updatePayloadSection('describe', this.textArea.value);
    }


    /**
     * @description Adds a new AI suggestion to the list and displays it.
     * @param {string} suggestion - The AI-generated text suggestion.
     * @returns {void}
     */
    addSuggestion(suggestion) {
        if (this.suggestions.length >= 3) {
            this.suggestions.shift(); // Remove the oldest suggestion
        }
        this.suggestions.push(suggestion);
        this.currentSuggestionIndex = this.suggestions.length - 1;
        this.displayCurrentSuggestion();
        this.#saveSuggestions();
        window.owpSessionManager.updatePayloadSection('describe', suggestion);
        this.#updateAiButtonState();
    }


    /**
     * @description Displays the current AI suggestion in the text area.
     * @returns {void}
     */
    displayCurrentSuggestion() {
        if (this.suggestions.length > 0) {
            this.textArea.value = this.suggestions[this.currentSuggestionIndex];
            this.updateCharCount();
            this.suggestionIndexElement.textContent = `${this.currentSuggestionIndex + 1} / ${this.suggestions.length}`;
        } else {
            this.textArea.value = '';
            this.charCountElement.textContent = '0'; // Reset char count explicitly
            this.suggestionIndexElement.textContent = '0 / 0';
        }
    }


    /**
     * @description Shows the previous AI suggestion.
     * @returns {void}
     */
    showPrevSuggestion() {
        if (this.currentSuggestionIndex > 0) {
            this.currentSuggestionIndex--;
        } else if (this.suggestions.length > 0) {
            this.currentSuggestionIndex = this.suggestions.length - 1; // Wrap around to the last suggestion
        }
        this.displayCurrentSuggestion();
    }


    /**
     * @description Shows the next AI suggestion.
     * @returns {void}
     */
    showNextSuggestion() {
        if (this.currentSuggestionIndex < this.suggestions.length - 1) {
            this.currentSuggestionIndex++;
        } else if (this.suggestions.length > 0) {
            this.currentSuggestionIndex = 0; // Wrap around to the first suggestion
        }
        this.displayCurrentSuggestion();
    }


    /**
     * @private
     * @description Loads the initial value from sessionStorage and sets it to the text area.
     * @returns {void}
     */
    #loadInitialValue() {
        const currentPayload = window.owpSessionManager.getPayload();
        if (currentPayload.describe) {
            this.textArea.value = currentPayload.describe;
            this.updateCharCount();
        }
    }


    /**
     * @private
     * @description Handles the 'ai-text-generated' event from the AI button.
     * @param {CustomEvent} event - The custom event containing the AI-generated text.
     * @returns {void}
     */
    #handleAiTextGenerated(event) {
        const aiText = event.detail.text;
        this.addSuggestion(aiText);
    }


    /**
     * @private
     * @description Loads suggestions from sessionStorage.
     * @returns {Array<string>} An array of stored suggestions.
     */
    #loadSuggestions() {
        try {
            const storedSuggestions = sessionStorage.getItem('owp_describe_suggestions');
            return storedSuggestions ? JSON.parse(storedSuggestions) : [];
        } catch (error) {
            console.error('Error loading suggestions from sessionStorage:', error);
            return [];
        }
    }


    /**
        * @private
        * @description Updates the state of the AI button (disabled/enabled) based on the number of suggestions.
        * @returns {void}
        */
    #updateAiButtonState() {
        if (this.aiButton) {
            const aiButtonElement = this.aiButton.querySelector('#writeAiButton');
            if (this.suggestions.length >= 3) {
                aiButtonElement.disabled = true;
                aiButtonElement.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                aiButtonElement.disabled = false;
                aiButtonElement.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }


    /**
     * @private
     * @description Saves current suggestions to sessionStorage.
     * @returns {void}
     */
    #saveSuggestions() {
        try {
            sessionStorage.setItem('owp_describe_suggestions', JSON.stringify(this.suggestions));
        } catch (error) {
            console.error('Error saving suggestions to sessionStorage:', error);
        }
    }
}

customElements.define('owp-describe-text-area', OwpDescribeTextArea);