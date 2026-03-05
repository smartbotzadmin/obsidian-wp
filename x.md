/wp-content/plugins/obsia/designs/sunexia/images/our-team1.jpg
/wp-content/plugins/obsia/designs/placeholders/
/wp-content/plugins/obsia/designs/placeholders/person3.webp
/wp-content/plugins/elementor/assets/images/placeholder.png

Headline
Lorem Ipsum Dolor Sit Amet

Subheadline
Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Section Title
Ut Enim Ad Minim Veniam

Description
Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Call to Action
Excepteur Sint Occaecat


Things to setup a design:
1. save its thumbnail (fullscreen screenshot).
2. save its raw html (home page) from elementor template preview.
3. try to find the #wpadminbar manually and delete the entire element. otherwise, insert this to hide th admin bar into the raw html.
```js
    <script>
      // Hide admin bar
      const style = document.createElement("style");
      style.innerHTML =
        "#wpadminbar { display: none !important; } html { margin-top: 0 !important; }";
      document.head.appendChild(style);
    </script>
```
4. remove the domain specific urls tag srcs domains ie (http://{you_domain}/{path} by /{path}).
5. rename the assets with .*(\d+)\..* form, since wordpress doesn't admit () as special chars.
6. remove the `jquery.min.js`, `backbone.min.js` & `underscore.min.js` scripts from raw html assets.
7. rename "css" and "css2" folders to files "css.css" and "css2.css"
8. comment the meta link tag `<link rel="https://api.w.org/" href="/wp-json/" />`
