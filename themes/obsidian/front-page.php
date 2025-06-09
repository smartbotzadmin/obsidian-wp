<?php
/**
 * The front page template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 *
 * @package Obsidian
 * @since 1.0.0
 */

get_header(); ?>

<!-- Hero Section -->
<div class="wp-block-group alignfull obsidian-hero" style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(245, 158, 11, 0.8)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'); background-size: cover; background-position: center; min-height: 100vh; display: flex; align-items: center; justify-content: center; color: white; text-align: center;">
    <div class="obsidian-container" style="max-width: 800px; padding: 0 2rem;">
        <h1 class="is-style-obsidian-gradient" style="font-size: 3rem; margin-bottom: 1.5rem; background: linear-gradient(135deg, #ffffff, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            Welcome to Obsidian
        </h1>
        <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.95;">
            Transform your digital presence with cutting-edge design and powerful functionality. Experience the future of web development.
        </p>
        <div class="obsidian-buttons" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="#features" class="obsidian-button" style="background-color: #f59e0b; color: #1f2937; padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                Get Started Today
            </a>
            <a href="#about" class="obsidian-button obsidian-button-outline" style="background-color: transparent; color: white; padding: 0.875rem 2rem; border: 2px solid white; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                Learn More
            </a>
        </div>
    </div>
</div>

<!-- Features Section -->
<div id="features" class="wp-block-group alignfull" style="padding: 5rem 0; background-color: #ffffff;">
    <div class="obsidian-container">
        <h2 class="is-style-obsidian-underline" style="text-align: center; font-size: 2.5rem; margin-bottom: 1rem; position: relative; padding-bottom: 0.5rem;">
            Why Choose Obsidian?
            <span style="content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 3rem; height: 3px; background-color: #f59e0b;"></span>
        </h2>
        <p style="text-align: center; color: #6b7280; font-size: 1.25rem; margin-bottom: 3rem;">
            Discover the features that make Obsidian the perfect choice for modern websites
        </p>
        
        <div class="obsidian-grid-3" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem;">
            <div class="is-style-obsidian-card obsidian-animate" style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Lightning Fast" style="width: 80px; height: 80px; border-radius: 1rem; object-fit: cover;">
                </div>
                <h3 style="text-align: center; color: #2563eb; margin-bottom: 1rem;">Lightning Fast</h3>
                <p style="text-align: center; color: #4b5563;">
                    Optimized for speed with advanced caching, lazy loading, and minimal resource usage for exceptional performance.
                </p>
            </div>
            
            <div class="is-style-obsidian-card obsidian-animate" style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Beautiful Design" style="width: 80px; height: 80px; border-radius: 1rem; object-fit: cover;">
                </div>
                <h3 style="text-align: center; color: #2563eb; margin-bottom: 1rem;">Beautiful Design</h3>
                <p style="text-align: center; color: #4b5563;">
                    Stunning visual aesthetics with modern typography, elegant layouts, and attention to every design detail.
                </p>
            </div>
            
            <div class="is-style-obsidian-card obsidian-animate" style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Developer Friendly" style="width: 80px; height: 80px; border-radius: 1rem; object-fit: cover;">
                </div>
                <h3 style="text-align: center; color: #2563eb; margin-bottom: 1rem;">Developer Friendly</h3>
                <p style="text-align: center; color: #4b5563;">
                    Built with modern web standards, clean code, and extensive customization options for developers.
                </p>
            </div>
        </div>
    </div>
</div>

<!-- Statistics Section -->
<div class="wp-block-group alignfull" style="padding: 5rem 0; background-color: #64748b; color: white;">
    <div class="obsidian-container">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 1rem;">Impressive Statistics</h2>
        <p style="text-align: center; font-size: 1.25rem; margin-bottom: 3rem; opacity: 0.9;">
            Numbers that speak for our excellence and reliability
        </p>
        
        <div class="obsidian-grid-4" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
            <div style="text-align: center;">
                <h3 class="is-style-obsidian-gradient" style="font-size: 3rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #ffffff, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">50K+</h3>
                <p style="font-size: 1.25rem;">Happy Users</p>
            </div>
            <div style="text-align: center;">
                <h3 class="is-style-obsidian-gradient" style="font-size: 3rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #ffffff, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">99.9%</h3>
                <p style="font-size: 1.25rem;">Uptime Guarantee</p>
            </div>
            <div style="text-align: center;">
                <h3 class="is-style-obsidian-gradient" style="font-size: 3rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #ffffff, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">24/7</h3>
                <p style="font-size: 1.25rem;">Expert Support</p>
            </div>
            <div style="text-align: center;">
                <h3 class="is-style-obsidian-gradient" style="font-size: 3rem; margin-bottom: 0.5rem; background: linear-gradient(135deg, #ffffff, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">5★</h3>
                <p style="font-size: 1.25rem;">Average Rating</p>
            </div>
        </div>
    </div>
</div>

<!-- Testimonials Section -->
<div id="testimonials" class="wp-block-group alignfull" style="padding: 5rem 0; background-color: #ffffff;">
    <div class="obsidian-container">
        <h2 class="is-style-obsidian-underline" style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; position: relative; padding-bottom: 0.5rem;">
            What Our Clients Say
        </h2>
        
        <div class="obsidian-grid-3" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            <div class="is-style-obsidian-card" style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center;">
                <blockquote style="font-style: italic; font-size: 1.125rem; margin-bottom: 1.5rem; color: #4b5563;">
                    "Obsidian transformed our online presence completely. The design is stunning and the performance is incredible."
                </blockquote>
                <cite style="font-weight: 600; color: #2563eb;">Sarah Johnson, CEO of TechCorp</cite>
            </div>
            
            <div class="is-style-obsidian-card" style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center;">
                <blockquote style="font-style: italic; font-size: 1.125rem; margin-bottom: 1.5rem; color: #4b5563;">
                    "The best theme we've ever used. Clean, fast, and incredibly customizable. Highly recommended!"
                </blockquote>
                <cite style="font-weight: 600; color: #2563eb;">Michael Chen, Creative Director</cite>
            </div>
            
            <div class="is-style-obsidian-card" style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center;">
                <blockquote style="font-style: italic; font-size: 1.125rem; margin-bottom: 1.5rem; color: #4b5563;">
                    "Outstanding support and documentation. Made our development process smooth and efficient."
                </blockquote>
                <cite style="font-weight: 600; color: #2563eb;">Emma Rodriguez, Lead Developer</cite>
            </div>
        </div>
    </div>
</div>

<!-- Call to Action Section -->
<div class="wp-block-group alignfull" style="padding: 5rem 0; background-color: #2563eb; color: white;">
    <div class="obsidian-container" style="max-width: 600px; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Ready to Get Started?</h2>
        <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">
            Join thousands of satisfied customers who have transformed their digital presence with Obsidian.
        </p>
        <div class="obsidian-buttons" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="#contact" class="obsidian-button" style="background-color: #f59e0b; color: #1f2937; padding: 0.875rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                Start Your Journey
            </a>
            <a href="#pricing" class="obsidian-button obsidian-button-ghost" style="background-color: transparent; color: white; padding: 0.875rem 2rem; border: none; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                View Pricing
            </a>
        </div>
    </div>
</div>

<style>
/* Enhanced hover effects */
.is-style-obsidian-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.obsidian-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.obsidian-button-outline:hover {
    background-color: white;
    color: #2563eb;
}

.obsidian-button-ghost:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Responsive design */
@media (max-width: 768px) {
    .obsidian-hero h1 {
        font-size: 2rem !important;
    }
    
    .obsidian-grid-3,
    .obsidian-grid-4 {
        grid-template-columns: 1fr !important;
    }
    
    .obsidian-buttons {
        flex-direction: column !important;
        align-items: center;
    }
}
</style>

<?php get_footer(); ?>