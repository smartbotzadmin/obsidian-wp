<?php
require_once plugin_dir_path( __FILE__ ) . 'owp_upload_media.php';


function owp_hydrate_content( &$elementor_data, $fields, $images ) {
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

    if ( isset($element['settings']['_element_id']) ) {
      $css_id = $element['settings']['_element_id'];

      // fields hydration
      if ( array_key_exists($element['settings']['_element_id'], $fields) ) {

        // case text
        if ( isset($element['settings']['text']) ) {
          $element['settings']['text'] = $fields[$css_id];
        }
        // case editor
        else if ( isset($element['settings']['editor']) ) {
          $element['settings']['editor'] = "<p>{$fields[$css_id]}</p>";
        }
        // case title
        else if ( isset($element['settings']['title']) ) {
          $element['settings']['title'] = $fields[$css_id];
        }
        // case iconbox
        else if (
          isset($element['settings']['title_text']) || isset($element['settings']['description_text'])
          ) {
          $element['settings']['title_text'] = $fields[$css_id]['title'];
          $element['settings']['description_text'] =
            $fields[$css_id]['description'];
        }
        // faq accordion questions wrapper
        else if ( isset($element['settings']['items']) ) {
          $index = 1;
          foreach ( $element['settings']['items'] as $key => &$value ) {
            $value['item_title'] =
              $fields[$css_id]["ob-faq-accordion-question{$index}"];
            $index++;
          }
        }
      }

      // images hydration
      if ( array_key_exists($element['settings']['_element_id'], $images) ) {
        $uploaded_image_url = owp_upload_media( $images[$css_id] );
        // case bg
        if ( isset($element['settings']['background_image']) ) {
          $element['settings']['background_image']['url'] = $uploaded_image_url;
        }
        // case img
        else if ( isset($element['settings']['image']) ) {
          $element['settings']['image']['url'] = $uploaded_image_url;
        }
      }
    }
    
    // Recursion
    if ( isset($element['elements']) ) {
      owp_hydrate_content( $element['elements'], $fields, $images );
    }
  }
}
























// function image_hydration_elementor(&$elementor_data, $pictures) {

//   if (!is_array($elementor_data) && !is_object($elementor_data)) {
//     return;
//   }

//   foreach ($elementor_data as $key => &$element) {
    
//     if (is_array($element) || is_object($element)) {

//       if (
//         is_array($element)
//         && isset($element['widgetType'])
//         && (
//           $element['widgetType'] == 'image'
//           || $element['widgetType'] == 'image-box'
//           )
//         && isset($element['settings']['image']['url'])
//         && preg_match('/image(\d+)\.(webp|png|jpg)/', $element['settings']['image']['url'], $matches)
//         ) {
//           $picture_index = $matches[1];
//           $element['settings']['image']['url'] = $pictures[$picture_index - 1];
//       }

//       image_hydration_elementor( $element, $pictures );
//     }
//   }
// }