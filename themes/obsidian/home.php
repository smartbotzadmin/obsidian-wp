<?php
/**
 * The blog home template file - Enhanced Blog Layout
 *
 * This template is used for the blog home page when posts are displayed.
 *
 * @package Obsidian
 * @since 1.1.0
 */

get_header(); ?>

<!-- Blog Header -->
<div class="wp-block-group alignfull" style="padding: 3rem 0; background-color: #ffffff;">
    <div class="obsidian-container">
        <h1 class="is-style-obsidian-gradient" style="text-align: center; font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(135deg, #2563eb, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            Our Blog
        </h1>
        <p style="text-align: center; color: #6b7280; font-size: 1.25rem; margin-bottom: 3rem;">
            Discover insights, tutorials, and the latest updates from our team
        </p>
    </div>
</div>

<main id="main" class="obsidian-main" role="main" style="padding: 2rem 0 4rem;">
    <div class="obsidian-container">
        <?php if ( have_posts() ) : ?>
            <div class="obsidian-posts-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
                <?php while ( have_posts() ) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class('obsidian-post is-style-obsidian-card obsidian-animate'); ?> style="background: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
                        
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div class="obsidian-post-thumbnail" style="aspect-ratio: 16/9; overflow: hidden;">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('large', array('style' => 'width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;')); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <div class="obsidian-post-content" style="padding: 1.5rem;">
                            <!-- Post Meta -->
                            <div class="obsidian-post-meta" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 0.875rem; color: #6b7280;">
                                <?php if ( has_category() ) : ?>
                                    <span style="color: #2563eb; font-weight: 500;">
                                        <?php the_category(', '); ?>
                                    </span>
                                    <span>•</span>
                                <?php endif; ?>
                                <time class="obsidian-published" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
                                    <?php echo esc_html( get_the_date() ); ?>
                                </time>
                            </div>

                            <!-- Post Title -->
                            <header class="obsidian-post-header">
                                <h2 class="obsidian-post-title" style="margin-bottom: 1rem; font-size: 1.25rem; line-height: 1.4;">
                                    <a href="<?php the_permalink(); ?>" style="color: #1f2937; text-decoration: none; transition: color 0.2s ease;" onmouseover="this.style.color='#2563eb'" onmouseout="this.style.color='#1f2937'">
                                        <?php the_title(); ?>
                                    </a>
                                </h2>
                            </header>

                            <!-- Post Excerpt -->
                            <div class="obsidian-post-excerpt" style="margin-bottom: 1.5rem; color: #4b5563; line-height: 1.6;">
                                <?php 
                                if ( has_excerpt() ) {
                                    the_excerpt();
                                } else {
                                    echo wp_trim_words( get_the_content(), 25, '...' );
                                }
                                ?>
                                <a href="<?php the_permalink(); ?>" class="obsidian-read-more" style="color: #2563eb; text-decoration: none; font-weight: 500;">
                                    Continue Reading →
                                </a>
                            </div>
                            
                            <!-- Post Footer -->
                            <footer class="obsidian-post-footer" style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                                <div class="obsidian-author-info" style="display: flex; align-items: center; gap: 0.75rem;">
                                    <?php echo get_avatar( get_the_author_meta( 'ID' ), 32, '', '', array( 'style' => 'border-radius: 50%;' ) ); ?>
                                    <span style="font-size: 0.875rem; color: #4b5563;">
                                        <?php the_author(); ?>
                                    </span>
                                </div>
                                <span style="font-size: 0.875rem; color: #6b7280;">
                                    <?php echo obsidian_reading_time(); ?> min read
                                </span>
                            </footer>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <!-- Pagination -->
            <div class="obsidian-pagination" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 3rem;">
                <?php
                the_posts_pagination( array(
                    'mid_size'  => 2,
                    'prev_text' => '← Previous',
                    'next_text' => 'Next →',
                ) );
                ?>
            </div>

        <?php else : ?>
            <!-- No Posts Found -->
            <div class="obsidian-no-posts is-style-obsidian-card" style="background: white; padding: 3rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center;">
                <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">No posts found</h3>
                <p style="color: #6b7280; margin-bottom: 2rem;">
                    It looks like nothing was found at this location. Try using the search below or browse our categories.
                </p>
                <?php get_search_form(); ?>
            </div>
        <?php endif; ?>
    </div>
</main>

<!-- Categories Section -->
<div class="wp-block-group alignfull" style="padding: 3rem 0; background-color: #64748b; color: white;">
    <div class="obsidian-container">
        <h2 style="text-align: center; font-size: 2rem; margin-bottom: 2rem;">Popular Categories</h2>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;">
            <?php
            $categories = get_categories( array( 'number' => 5 ) );
            if ( $categories ) {
                foreach ( $categories as $category ) {
                    echo '<a href="' . get_category_link( $category->term_id ) . '" style="background: white; color: #1f2937; padding: 0.75rem 1.5rem; border-radius: 2rem; text-decoration: none; font-weight: 500; transition: all 0.3s ease;" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">
                        ' . $category->name . ' (' . $category->count . ')
                    </a>';
                }
            }
            ?>
        </div>
    </div>
</div>

<!-- Newsletter Section -->
<div class="wp-block-group alignfull" style="padding: 4rem 0; background-color: #2563eb; color: white;">
    <div class="obsidian-container" style="max-width: 600px; text-align: center;">
        <h2 style="font-size: 2rem; margin-bottom: 1rem;">Stay Updated</h2>
        <p style="font-size: 1.125rem; margin-bottom: 2rem; opacity: 0.9;">
            Subscribe to our newsletter and never miss our latest articles, tutorials, and updates.
        </p>
        <form class="obsidian-newsletter-form" style="display: flex; gap: 0.5rem; max-width: 400px; margin: 0 auto;">
            <input type="email" placeholder="Enter your email address" style="flex: 1; padding: 0.875rem 1rem; border: 2px solid rgba(255,255,255,0.2); border-radius: 0.5rem; font-size: 1rem; background: rgba(255,255,255,0.1); color: white;" required>
            <button type="submit" style="padding: 0.875rem 1.5rem; background-color: #f59e0b; color: #1f2937; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; white-space: nowrap;">Subscribe</button>
        </form>
        <p style="font-size: 0.875rem; margin-top: 1rem; opacity: 0.8;">
            No spam, unsubscribe at any time.
        </p>
    </div>
</div>

<style>
/* Enhanced hover effects */
.obsidian-posts-grid article:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.obsidian-posts-grid article:hover img {
    transform: scale(1.05);
}

/* Responsive design */
@media (max-width: 768px) {
    .obsidian-posts-grid {
        grid-template-columns: 1fr !important;
    }
    
    .obsidian-newsletter-form {
        flex-direction: column !important;
    }
    
    .obsidian-post-footer {
        flex-direction: column !important;
        gap: 1rem;
        text-align: center;
    }
}
</style>

<?php
// Add reading time function if it doesn't exist
if ( ! function_exists( 'obsidian_reading_time' ) ) {
    function obsidian_reading_time() {
        $content = get_post_field( 'post_content', get_the_ID() );
        $word_count = str_word_count( strip_tags( $content ) );
        $reading_time = ceil( $word_count / 200 );
        return max( 1, $reading_time ); // Minimum 1 minute
    }
}
?>

<?php get_footer(); ?>