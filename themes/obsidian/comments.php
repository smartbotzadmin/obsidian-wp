<?php
/**
 * The template for displaying comments
 *
 * @package Obsidian
 * @since 1.0.0
 */

if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="obsidian-comments-area">

	<?php if ( have_comments() ) : ?>
		<h2 class="obsidian-comments-title">
			<?php
			$comments_number = get_comments_number();
			if ( '1' === $comments_number ) {
				printf(
					/* translators: %s: post title */
					esc_html_x( 'One thought on &ldquo;%s&rdquo;', 'comments title', 'obsidian' ),
					'<span>' . wp_kses_post( get_the_title() ) . '</span>'
				);
			} else {
				printf(
					/* translators: 1: number of comments, 2: post title */
					esc_html( _nx(
						'%1$s thought on &ldquo;%2$s&rdquo;',
						'%1$s thoughts on &ldquo;%2$s&rdquo;',
						$comments_number,
						'comments title',
						'obsidian'
					) ),
					number_format_i18n( $comments_number ),
					'<span>' . wp_kses_post( get_the_title() ) . '</span>'
				);
			}
			?>
		</h2>

		<?php the_comments_navigation(); ?>

		<ol class="obsidian-comment-list">
			<?php
			wp_list_comments( array(
				'style'       => 'ol',
				'short_ping'  => true,
				'avatar_size' => 60,
				'callback'    => 'obsidian_comment_callback',
			) );
			?>
		</ol>

		<?php
		the_comments_navigation();

		// If comments are closed and there are comments, let's leave a little note, shall we?
		if ( ! comments_open() ) :
			?>
			<p class="obsidian-no-comments"><?php esc_html_e( 'Comments are closed.', 'obsidian' ); ?></p>
			<?php
		endif;

	endif; // Check for have_comments().

	// Comment form
	comment_form( array(
		'title_reply_before' => '<h3 id="reply-title" class="obsidian-comment-reply-title">',
		'title_reply_after'  => '</h3>',
		'class_form'         => 'obsidian-comment-form',
		'class_submit'       => 'obsidian-button obsidian-comment-submit',
		'submit_button'      => '<input name="%1$s" type="submit" id="%2$s" class="%3$s" value="%4$s" />',
		'fields'             => array(
			'author' => '<p class="obsidian-comment-form-author">' .
						'<label for="author">' . __( 'Name', 'obsidian' ) . ( $req ? ' <span class="required">*</span>' : '' ) . '</label> ' .
						'<input id="author" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) . '" size="30" maxlength="245"' . ( $req ? ' required="required"' : '' ) . ' /></p>',
			'email'  => '<p class="obsidian-comment-form-email">' .
						'<label for="email">' . __( 'Email', 'obsidian' ) . ( $req ? ' <span class="required">*</span>' : '' ) . '</label> ' .
						'<input id="email" name="email" type="email" value="' . esc_attr( $commenter['comment_author_email'] ) . '" size="30" maxlength="100" aria-describedby="email-notes"' . ( $req ? ' required="required"' : '' ) . ' /></p>',
			'url'    => '<p class="obsidian-comment-form-url">' .
						'<label for="url">' . __( 'Website', 'obsidian' ) . '</label> ' .
						'<input id="url" name="url" type="url" value="' . esc_attr( $commenter['comment_author_url'] ) . '" size="30" maxlength="200" /></p>',
		),
		'comment_field'      => '<p class="obsidian-comment-form-comment">' .
								'<label for="comment">' . _x( 'Comment', 'noun', 'obsidian' ) . ' <span class="required">*</span></label> ' .
								'<textarea id="comment" name="comment" cols="45" rows="8" maxlength="65525" required="required"></textarea></p>',
	) );
	?>

</div>