<?php


function image_hydration_elementor(&$elementor_data, $pictures) {

  if (!is_array($elementor_data) && !is_object($elementor_data)) {
    return;
  }

  foreach ($elementor_data as $key => &$element) {
    
    if (is_array($element) || is_object($element)) {

      if (
        is_array($element)
        && isset($element['widgetType'])
        && (
          $element['widgetType'] == 'image'
          || $element['widgetType'] == 'image-box'
          )
        && isset($element['settings']['image']['url'])
        && preg_match('/image(\d+)\.(webp|png|jpg)/', $element['settings']['image']['url'], $matches)
        ) {
          $picture_index = $matches[1];
          $element['settings']['image']['url'] = $pictures[$picture_index - 1];
      }

      image_hydration_elementor( $element, $pictures );
    }
  }
}