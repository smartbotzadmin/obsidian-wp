<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo esc_html__( 'Obsidian Editor', 'obsidian' ); ?></title>
    <?php wp_head(); ?>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        }
        #obsidian-app {
            width: 100vw;
            height: 100vh;
            display: flex;
        }
    </style>
</head>
<body>
    <div id="obsidian-app">
        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
            <p><?php echo esc_html__( 'Loading Obsidian Editor...', 'obsidian' ); ?></p>
        </div>
    </div>
    <?php wp_footer(); ?>
</body>
</html>