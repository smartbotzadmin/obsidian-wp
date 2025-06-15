<?php
/**
 * Template part for displaying posts (Hello Elementor style)
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <?php if (is_singular()) : ?>
        <div class="entry-header">
            <h1 class="entry-title"><?php the_title(); ?></h1>
        </div>
        <div class="entry-content">
            <?php the_content(); ?>
        </div>
    <?php else : ?>
        <div class="entry-header">
            <a href="<?php the_permalink(); ?>" rel="bookmark">
                <h2 class="entry-title"><?php the_title(); ?></h2>
            </a>
        </div>
        <div class="entry-content">
            <?php the_excerpt(); ?>
        </div>
    <?php endif; ?>
</article> 