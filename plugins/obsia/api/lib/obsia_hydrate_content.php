<?php
if (!defined("ABSPATH")) {
  exit();
}

require_once plugin_dir_path(__FILE__) . "obsia_upload_media.php";

function obsia_hydrate_content(&$elementor_data, $fields, $images)
{
  // Hydrate templates
  // Hydrate AI content & images into every 'template.json'
  // - upload images as media.
  // - populate images where CSS_ID applies.
  // - populate AI content where CSS_ID applies.
  // - special treatments:
  //   - field(text): string
  //   - field(editor): <p></p>
  //   - field(title): string
  //   - *iconbox: fields(title_text, description_text)
  //   - faq-accordion: fields(items: [{"item_title: string}, ...])

  foreach ($elementor_data as $key => &$element) {
    if (isset($element["settings"]["_element_id"])) {
      $css_id = $element["settings"]["_element_id"];

      // fields hydration
      if (array_key_exists($element["settings"]["_element_id"], $fields)) {
        // case text
        if (isset($element["settings"]["text"])) {
          $element["settings"]["text"] = $fields[$css_id];
        }
        // case editor
        elseif (isset($element["settings"]["editor"])) {
          $element["settings"]["editor"] = "<p>{$fields[$css_id]}</p>";
        }
        // case title
        elseif (isset($element["settings"]["title"])) {
          $element["settings"]["title"] = $fields[$css_id];
        }
        // case iconbox
        elseif (
          isset($element["settings"]["title_text"]) ||
          isset($element["settings"]["description_text"])
        ) {
          $element["settings"]["title_text"] = $fields[$css_id]["title"];
          $element["settings"]["description_text"] = $fields[$css_id]["description"];
        }
        // faq accordion questions wrapper
        elseif (isset($element["settings"]["items"])) {
          $index = 1;
          foreach ($element["settings"]["items"] as $key => &$value) {
            $value["item_title"] = $fields[$css_id]["ob-faq-accordion-question{$index}"];
            $index++;
          }
        }
      }

      // images hydration
      if (array_key_exists($element["settings"]["_element_id"], $images)) {
        $uploaded_image_url = obsia_upload_media($images[$css_id]);

        // case bg
        if (isset($element["settings"]["background_image"])) {
          $element["settings"]["background_image"]["url"] = $uploaded_image_url;
        }
        // case img
        if (isset($element["settings"]["image"])) {
          $element["settings"]["image"]["url"] = $uploaded_image_url;
        }
      }
    }

    // Recursion
    if (isset($element["elements"])) {
      obsia_hydrate_content($element["elements"], $fields, $images);
    }
  }
}
