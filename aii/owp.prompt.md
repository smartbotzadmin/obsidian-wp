# Create Obsidian WP Plugin

Obsidian WP (OWP) it's a plugin take empower wordpress to create pages rapidly from
pre-made templates/themes. And then fill them with AI generated text content in the 
different parts of the pages.

## Custom Pages

Please, make use of the filters/actions you need to:
- Create a custom page with the url `<HOST>/wp-admin/admin.php?page=owp-description`.
- Create a custom page with the url `<HOST>/wp-admin/admin.php?page=owp-pictures`.
- Create a custom page with the url `<HOST>/wp-admin/admin.php?page=owp-contact`.
- Create a custom page with the url `<HOST>/wp-admin/admin.php?page=owp-design`.

These custom pages must render html and js. Separated the html/css/js files by pages folder inside the plugin filesystem structure. Use the names 'description','pictures', 'contact',
'design' respectively.

Form the html so that it renders a dummy WebComponent tag which I will develop deeper later.

## Plugin Buttons

Please, make use of the filters/actions you need to:
- Add a button "Create with AI ObsidianWP" at the top-left of the gutenberg menu bar.
This button has to send toward `<HOST>/wp-admin/admin.php?page=owp-description`.
- Add a button "Create with AI ObsidianWP" at the top-right of global black admin bar.
This button has to send toward `<HOST>/wp-admin/admin.php?page=owp-description`.
- Add a button Icon at the top-left of the gutenberg menu bar. This button has to trigger
a `Sidebar AI ObsidianWP Chat` which opens from the right, add a decent width for it. Put
a empty placeholder for the icon, I will use a custom svg later.
- Add a button option within the context menu which is shown when we are editing the content
with gutenberg editor. The option button must be first over other options (i.e. bold, italic, link options). Also the Button has to trigger the `Sidebar AI ObsidianWP Chat`.
- Add a new option called "New AI ObsidianWP" within the page menu at the wp-admin dashboard
(left sidebar). This option has to send toward
`<HOST>/wp-admin/admin.php?page=owp-description`.
