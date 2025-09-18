<?php


function image_hydration_elementor(&$elementor_data, $url) {

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
        ) {
        $element['settings']['image']['url'] = $url;
      }

      image_hydration_elementor( $element, $url );
    }
  }
}