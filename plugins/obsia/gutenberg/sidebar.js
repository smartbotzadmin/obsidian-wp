(function (wp) {
  // ObsidianWP Gutenberg Icon
  function onSettingsElementReady() {
    const settings = document.querySelector(".editor-header__settings");
    const newElement = document.createElement("div");
    newElement.className = `flex justify-center items-center w-8 h-8 rounded-md cursor-pointer bg-slate-300 hover:bg-slate-900`;
    newElement.innerHTML = `
            <img src="/wp-content/plugins/obsia/assets/icons/obsidian-logo.png" class="w-6 h-6 block mx-auto rounded-md p-0.5" />
        `;

    if (settings) {
      settings.className += ` flex flex-row items-center`;
      if (settings.children.length >= 2) {
        settings.insertBefore(newElement, settings.children[settings.children.length - 2]);
      } else {
        settings.appendChild(newElement);
      }
      newElement.addEventListener("click", () => {
        const sidebar = document.querySelector("obsia-sidebar");
        if (sidebar) {
          sidebar.toggleSidebar();
        }
      });
    }
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    if (document.querySelector(".editor-header__settings")) {
      onSettingsElementReady();
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Append the web component to the body
  document.body.appendChild(document.createElement("obsia-sidebar"));
})(window.wp || {});
