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
        this.innerHTML = `
            <div class="text-right text-gray-500 text-sm mb-2">
                Characters: <span id="charCount">0</span> / <span id="maxChars">3000</span>
            </div>
            <textarea id="describeTextArea" class="w-full p-4 border border-gray-300 rounded-lg h-48 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="E.g. Mantra Minds is a yoga studio located in Chino Hills, California. The studio offers a variety of classes such as Hatha yoga, Vinyasa flow, and Restorative yoga. The studio is led by Jane, an experienced and certified yoga instructor with over 10 years of teaching expertise. The welcoming atmosphere and personalized Jane make it a favorite among yoga enthusiasts in the area."></textarea>
            
            <div class="flex justify-between items-center mt-4">
                <owp-describe-ai-button></owp-describe-ai-button>
                <div class="flex items-center text-gray-500">
                    <button id="prevSuggestion" class="p-1">
                        <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/chevron-left.svg"/>
                    </button>
                    <span id="suggestionIndex" class="mx-2">1 / 1</span>
                    <button id="nextSuggestion" class="p-1">
                        <img src="${window.location.origin}/wp-content/plugins/owp/assets/icons/chevron-right.svg"/>
                    </button>
                </div>
            </div>
        `;

        this.textArea = this.querySelector('#describeTextArea');
        this.textArea = this.querySelector('#describeTextArea');
        this.charCountElement = this.querySelector('#charCount');
        this.maxCharsElement = this.querySelector('#maxChars');
        this.prevSuggestionButton = this.querySelector('#prevSuggestion');
        this.nextSuggestionButton = this.querySelector('#nextSuggestion');
        this.suggestionIndexElement = this.querySelector('#suggestionIndex');

        this.textArea.addEventListener('input', this.updateCharCount.bind(this));
        this.prevSuggestionButton.addEventListener('click', this.showPrevSuggestion.bind(this));
        this.nextSuggestionButton.addEventListener('click', this.showNextSuggestion.bind(this));

        this.suggestions = [];
        this.currentSuggestionIndex = 0;
    }

    /**
     * @description Updates the displayed character count.
     * @returns {void}
     */
    updateCharCount() {
        const currentLength = this.textArea.value.length;
        this.charCountElement.textContent = currentLength;
    }

    /**
     * @description Adds a new AI suggestion to the list and displays it.
     * @param {string} suggestion - The AI-generated text suggestion.
     * @returns {void}
     */
    addSuggestion(suggestion) {
        this.suggestions.push(suggestion);
        this.currentSuggestionIndex = this.suggestions.length - 1;
        this.displayCurrentSuggestion();
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
            this.updateCharCount();
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
            this.displayCurrentSuggestion();
        }
    }

    /**
     * @description Shows the next AI suggestion.
     * @returns {void}
     */
    showNextSuggestion() {
        if (this.currentSuggestionIndex < this.suggestions.length - 1) {
            this.currentSuggestionIndex++;
            this.displayCurrentSuggestion();
        }
    }
}

customElements.define('owp-describe-text-area', OwpDescribeTextArea);