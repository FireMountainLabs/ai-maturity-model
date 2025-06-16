import {css, html} from "lit-html";
import {LitElement} from "lit-element";
import {repeat} from "lit-html/directives/repeat.js";
import "./atoms/blur.js";
import "./atoms/button.js";
import "./atoms/compact-switch.js";
import "./atoms/icon.js";
import {ALLOW_NATIVE_SHARE, DEFAULT_COMPACT_PX, getShareConfig} from "./config.js";
import {collections} from "./data.js";
import "./molecules/collection.js";
import {sharedStyles} from "./styles/shared.js";
import {
    andreasIconTemplate,
    coffeeIconTemplate,
    githubIconTemplate,
    helpIconTemplate,
    shareIconTemplate
} from "./util/icons.js";
import {
    measureDimensions,
    measureException,
    measureInstallEvent,
    measureOpenHelp,
    measureOpenShare,
    measurePageView,
    measureShareLink,
    measureToggleCompact,
    measureUserTiming
} from "./util/measure.js";
import {
    copyToClipboard,
    currentSnackCount,
    dispatchCloseDescriptionEvent,
    getFirstVisit,
    getId,
    isDialogVisible,
    loadIsCompact,
    onClickLink,
    setFirstVisitDate,
    setIsCompact
} from "./util/util.js";

/**
 * The main entry for the application.
 */
export class App extends LitElement {
    static get properties () {
        return {
            compact: {
                type: Boolean,
                reflect: true
            },
            dragging: {
                type: Boolean,
                reflect: true
            }
        }
    }

    static get styles () {
        return [
            sharedStyles,
            css`
                :host {
                    display: block;
                }
                
                :host(:not([compact])) {
                    cursor: grab;
                }
                
                :host(:not([compact])[dragging]) {
                    cursor: grabbing;
                    will-change: scroll-position;
                    user-select: none;
                }
                
                #header {
                    padding: var(--spacing-m) var(--spacing-l);
                }
                
                #collections {
                    padding: var(--spacing-xxxl) var(--spacing-xxxl) 0;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    min-width: min-content;
                }
                
                #footer {
                    padding: var(--spacing-l) var(--spacing-xxxl);
                }

                .collection:not(:last-child) {
                    margin: 0 0 var(--spacing-xxl);
                }
                
                #header, #footer, #skip-navigation {
                    justify-content: space-between;
                }
                
                #header, #header > div, #footer, #footer > div, #skip-navigation, #skip-navigation > div {
                    display: flex;
                    align-items: center;
                }
                
                #header > div > :not(:last-child) {
                    margin: 0 var(--spacing-l) 0 0;
                }
                
                #footer > div > :not(:last-child) {
                    margin: 0 var(--spacing-l) 0 0;
                }
                
                #avatar {
                    display: flex;
                    align-items: center;
                    margin: 0 0 0 var(--spacing-l);
                }

                #avatar .img {
                    width: 2.14rem;
                    height: 2.14rem;
                    border-radius: 100%;
                    border: 2px solid currentColor;
                    margin: 0 var(--spacing-m) 0 0;
                }

                :host([compact]) #collections {
                    padding: 0 var(--spacing-l) var(--spacing-s);
                }
                
                :host([compact]) #footer {
                    padding: var(--spacing-xxl) var(--spacing-l) var(--spacing-l);
                }

                :host([compact]) .collection {
                    padding: var(--spacing-xl);
                    border-radius: var(--border-radius-s);
                }

                :host([compact]) .collection:not(:last-child) {
                    margin: 0 0 var(--spacing-l);
                }
                
                :host([compact]) #blur {
                    display: none;
                }
                
                :host(:not([compact])) #header {
                    position: fixed;
                    top: 0;
                    z-index: 1234567;
                    width: 100%;
                    background: var(--background-opaque);
                }
                
                #toggle-compact {
                    display: flex;
                    align-content: center;
                }
                
                a {
                    color: var(--foreground);
                    text-decoration: none;
                }
                
                kbd {
                    font-family: inherit;
                    background: var(--background);
                    color: var(--foreground);
                    padding: 0 var(--spacing-xs);
                    border-radius: var(--border-radius-s);
                }
                
                #skip-navigation {
                    position: fixed;
                    width: 100%;
                    opacity: 0;
                    padding: var(--spacing-m);
                    background: var(--foreground);
                    color: var(--background);
                    top: -9999px;
                    left: -9999px;
                    z-index: -12345;
                    display: flex;
                }
                
                #skip-navigation:focus-within {
                    outline: var(--focus-outline);
                    z-index: 123456789;
                    opacity: 1;
                    left: 0;
                    top: 0;
                }
                
                @media (max-width: 800px) {
                    #toggle-compact {
                        display: none;
                    }
                }
                
                @media (max-width: 1000px) {
                    #footer > div {
                        flex-wrap: wrap;
                        flex-grow: 1;
                        justify-content: stretch;
                        align-items: center;
                    }
                    
                    #footer > div > * {
                        padding: var(--spacing-m);
                        width: 100%;
                        border: 2px solid currentColor;
                        margin: 0 0 var(--spacing-m) !important;
                    }
                }
                
                @media (any-pointer: coarse) {
                    #skip-navigation {
                        display: none;
                    }
                }
            `
        ];
    }

    /**
     * Setup the element after it has been connected.
     */
    connectedCallback () {
        super.connectedCallback();

        this.setupListeners();
        this.setupCompact();
        this.setupDragging();

        measureDimensions();
        measurePageView();
        measureUserTiming(`App was connected`, `initial_load`, performance.now());
    }

    /**
     * Setup the element after it has been updated.
     */
    firstUpdated (props) {
        super.firstUpdated(props);

        // Show help toast on first visit
        if (getFirstVisit() == null) {
            this.showHelpToast();
            setFirstVisitDate();
        }

        // Setup service worker
        this.setupServiceWorker();
    }

    /**
     * Setup the listeners.
     */
    setupListeners () {
        // Listen for network changes
        window.addEventListener("online", this.networkChanged.bind(this));
        window.addEventListener("offline", this.networkChanged.bind(this));

        // Listen for hash changes
        window.addEventListener("hashchange", this.hashChanged.bind(this));

        // Listen for install events
        window.addEventListener("beforeinstallprompt", e => {
            e.preventDefault();
            measureInstallEvent();
        });

        // Listen for errors
        window.addEventListener("error", e => {
            measureException(e.error);
        });

        // Listen for unhandled rejections
        window.addEventListener("unhandledrejection", e => {
            measureException(e.reason);
        });
    }

    /**
     * Called when the network changes.
     */
    networkChanged () {
        if (navigator.onLine) {
            window.location.reload();
        }
    }

    /**
     * Called when the hash changes.
     */
    hashChanged () {
        const hash = window.location.hash;
        if (hash != null && hash.length > 1) {
            this.focusCollection(hash.substring(1));
        }
    }

    /**
     * Setup dragging.
     */
    setupDragging () {
        let isDragging = false;
        let startX;
        let startY;
        let scrollLeft;
        let scrollTop;

        const collections = this.shadowRoot.querySelector("#collections");

        collections.addEventListener("mousedown", e => {
            if (this.compact) return;
            isDragging = true;
            this.dragging = true;
            startX = e.pageX - collections.offsetLeft;
            startY = e.pageY - collections.offsetTop;
            scrollLeft = collections.scrollLeft;
            scrollTop = collections.scrollTop;
        });

        collections.addEventListener("mouseleave", () => {
            isDragging = false;
            this.dragging = false;
        });

        collections.addEventListener("mouseup", () => {
            isDragging = false;
            this.dragging = false;
        });

        collections.addEventListener("mousemove", e => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - collections.offsetLeft;
            const y = e.pageY - collections.offsetTop;
            const walkX = (x - startX) * 2;
            const walkY = (y - startY) * 2;
            collections.scrollLeft = scrollLeft - walkX;
            collections.scrollTop = scrollTop - walkY;
        });
    }

    /**
     * Shows a help toast.
     */
    async showHelpToast () {
        const {showSnackbar} = await import("./util/show-snackbar.js");
        showSnackbar(`Web Skills is an overview of useful skills to learn as a web developer`, {
            timeout: 1000 * 20,
            wide: true,
            buttons: [
                ["Read More", () => this.openHelp()],
                ["Dismiss", () => ({})]
            ]
        });
    }

    /**
     * Setup service worker.
     */
    async setupServiceWorker () {
        if ("serviceWorker" in navigator) {
            try {
                const registration = await navigator.serviceWorker.register("/sw.js");
                registration.addEventListener("updatefound", () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener("statechange", () => {
                        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                            this.showUpdateToast();
                        }
                    });
                });
            } catch (err) {
                measureException(err);
            }
        }
    }

    /**
     * Shows an update toast.
     */
    async showUpdateToast () {
        const {showSnackbar} = await import("./util/show-snackbar.js");
        showSnackbar(`A new version is available`, {
            timeout: 1000 * 20,
            wide: true,
            buttons: [
                ["Update", () => window.location.reload()],
                ["Dismiss", () => ({})]
            ]
        });
    }

    /**
     * Setup compact mode.
     */
    setupCompact () {
        this.compact = loadIsCompact();
    }

    /**
     * Toggle compact mode.
     */
    toggleCompact (e) {
        this.compact = !this.compact;
        setIsCompact(this.compact);
        measureToggleCompact(this.compact);
    }

    /**
     * Share the page.
     */
    async share () {
        if (ALLOW_NATIVE_SHARE && navigator.share != null) {
            try {
                await navigator.share(getShareConfig());
                measureShareLink();
            } catch (err) {
                measureException(err);
            }
        } else {
            const url = window.location.href;
            await copyToClipboard(url);
            measureShareLink();
            const {showSnackbar} = await import("./util/show-snackbar.js");
            showSnackbar(`Link copied to clipboard`, {
                timeout: 1000 * 2
            });
        }
    }

    /**
     * Open help.
     */
    async openHelp () {
        measureOpenHelp();
        const {openDialog} = await import("web-dialog");
        const {$dialog} = openDialog({
            center: true,
            $content: document.createTextNode(`Web Skills is a visual overview of useful skills to learn as a web developer. It is useful for people who just started learning about web development and for people who have been in the field for years and want to learn new things. As a beginner, I would encourage you not to see this website as the definitive list of what you need to know but as an example of what you can learn and where you can start. The skills are arranged in chronological order based on what learning path I recommend you to take but feel free to jump around freely.`)
        });

        $dialog.style.setProperty("--dialog-color", "black");
        $dialog.style.setProperty("--dialog-max-width", "450px");
    }

    /**
     * Focus a collection.
     */
    focusCollection (name) {
        const collection = this.shadowRoot.querySelector(`ws-collection[name="${name}"]`);
        if (collection != null) {
            collection.scrollIntoView({behavior: "smooth"});
        }
    }

    /**
     * Focus the navigation select.
     */
    focusNavigationSelect () {
        const select = this.shadowRoot.querySelector("#navigation-select");
        if (select != null) {
            select.focus();
        }
    }

    /**
     * Render the element.
     */
    render () {
        return html`
            <div id="skip-navigation">
                <div>
                    <a href="#collections">Skip to content</a>
                </div>
            </div>
            
            <div id="header">
                <div>
                    <ws-button @click="${this.toggleCompact}" id="toggle-compact">
                        <ws-icon slot="icon">${this.compact ? "fullscreen" : "fullscreen_exit"}</ws-icon>
                        ${this.compact ? "Expand" : "Compact"}
                    </ws-button>
                    
                    <ws-button @click="${this.openHelp}">
                        <ws-icon slot="icon">${helpIconTemplate}</ws-icon>
                        Help
                    </ws-button>
                    
                    <ws-button @click="${this.share}">
                        <ws-icon slot="icon">${shareIconTemplate}</ws-icon>
                        Share
                    </ws-button>
                </div>
                
                <div id="avatar">
                    <img class="img" src="www/avatar.jpg" alt="Avatar" />
                    <div>
                        <div>Chris Ward</div>
                        <div>@FireMountainLabs</div>
                    </div>
                </div>
            </div>
            
            <div id="collections">
                ${repeat(collections, collection => html`
                    <ws-collection
                        .collection="${collection}"
                        ?compact="${this.compact}"
                    ></ws-collection>
                `)}
            </div>
            
            <div id="footer">
                <div>
                    <a href="https://github.com/FireMountainLabs/ai-maturity-model" target="_blank" rel="noopener">
                        <ws-button>
                            <ws-icon slot="icon">${githubIconTemplate}</ws-icon>
                            GitHub
                        </ws-button>
                    </a>
                    
                    <a href="https://www.buymeacoffee.com/AndreasMehlsen" target="_blank" rel="noopener">
                        <ws-button>
                            <ws-icon slot="icon">${coffeeIconTemplate}</ws-icon>
                            Buy me a coffee
                        </ws-button>
                    </a>
                    
                    <a href="https://twitter.com/AndreasMehlsen" target="_blank" rel="noopener">
                        <ws-button>
                            <ws-icon slot="icon">${andreasIconTemplate}</ws-icon>
                            @AndreasMehlsen
                        </ws-button>
                    </a>
                </div>
            </div>
            
            <ws-blur id="blur"></ws-blur>
        `;
    }
}

customElements.define("ws-app", App);