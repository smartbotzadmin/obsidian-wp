<?php
/**
 * The template for displaying the footer (Hello Elementor style)
 */
?>
    <footer id="site-footer" class="site-footer" role="contentinfo">
        <div class="site-info">
            <div class="site-copyright">
                <?php
                printf(
                    esc_html__('© %1$s %2$s', 'obsidian-minimal'),
                    date('Y'),
                    get_bloginfo('name')
                );
                ?>
            </div>
        </div>
    </footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html> 