<?php
if (!defined("ABSPATH")) {
  exit();
}

function obsia_generate_content($body, $authorization_header)
{
  //receives an associative array with blank fields to let AI fill them up
  $response = wp_remote_post("https://obsidian-content-generator-313065021854.us-east1.run.app", [
    "timeout" => 300,
    "headers" => [
      "Content-Type" => "application/json; chartset=utf-8",
      "Authorization" => $authorization_header,
    ],
    "body" => json_encode($body),
  ]);

  if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
    $content = wp_remote_retrieve_body($response);
    return $content;
  }

  return $response;
}
