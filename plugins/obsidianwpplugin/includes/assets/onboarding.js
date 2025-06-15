jQuery(document).ready(function ($) {
  // Sign in functionality
  window.signIn = function () {
    const email = $("#obsidian-email").val();
    const password = $("#obsidian-password").val();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    // Show loading state
    const $button = $(".obsidian-form-actions .obsidian-btn-primary");
    const originalText = $button.text();
    $button.prop("disabled", true).text("please wait...");

    // Here you would typically make an API call to your authentication endpoint
    // For now, we'll simulate a successful sign-in
    setTimeout(function () {
      // Store the sign-in state
      localStorage.setItem("obsidian_signed_in", "true");

      // Redirect to ideation step
      window.location.href = "?page=obsidian-generator&step=ideation";
    }, 1000);
  };

  // Check if user is signed in
  function checkSignIn() {
    const isSignedIn = localStorage.getItem("obsidian_signed_in") === "true";
    const currentStep = getCurrentStep();

    if (!isSignedIn && currentStep !== "welcome" && currentStep !== "signin") {
      window.location.href = "?page=obsidian-generator&step=signin";
    }
  }

  // Template selection
  $(".obsidian-template-card").on("click", function () {
    $(".obsidian-template-card").removeClass("selected");
    $(this).addClass("selected");

    // Store selected template
    const template = $(this).data("template");
    localStorage.setItem("obsidian_selected_template", template);
  });

  // Page selection
  $(".obsidian-page-card").on("click", function () {
    const checkbox = $(this).find('input[type="checkbox"]');
    if (!checkbox.prop("disabled")) {
      checkbox.prop("checked", !checkbox.prop("checked"));
    }
  });

  // Primary button click handler
  $(".obsidian-btn-primary").on("click", function () {
    const currentStep = getCurrentStep();

    if (currentStep === "pages") {
      createPages();
    } else if (currentStep === "publish") {
      publishSite();
    }
  });

  // Back button handler
  $(".obsidian-btn-secondary").on("click", function () {
    const currentStep = getCurrentStep();
    let previousStep;

    switch (currentStep) {
      case "signin":
        previousStep = "welcome";
        break;
      case "template":
        previousStep = "signin";
        break;
      case "pages":
        previousStep = "template";
        break;
      case "preview":
        previousStep = "pages";
        break;
      case "publish":
        previousStep = "preview";
        break;
      default:
        previousStep = "welcome";
    }

    window.location.href = `?page=obsidian-generator&step=${previousStep}`;
  });

  // Get current step from URL
  function getCurrentStep() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("step") || "welcome";
  }

  // Create pages
  function createPages() {
    const selectedPages = [];
    $('.obsidian-page-card input[type="checkbox"]:checked').each(function () {
      selectedPages.push($(this).val());
    });

    const template =
      localStorage.getItem("obsidian_selected_template") || "business";

    // Show loading state
    const $button = $(".obsidian-btn-primary");
    const originalText = $button.text();
    $button.prop("disabled", true).text("Creating Pages...");

    $.ajax({
      url: obsidianOnboarding.ajaxurl,
      type: "POST",
      data: {
        action: "obsidian_create_pages",
        nonce: obsidianOnboarding.nonce,
        pages: selectedPages,
        template: template,
      },
      success: function (response) {
        if (response.success) {
          window.location.href = "?page=obsidian-generator&step=preview";
        } else {
          alert("Error creating pages: " + response.data);
          $button.prop("disabled", false).text(originalText);
        }
      },
      error: function () {
        alert("Error creating pages. Please try again.");
        $button.prop("disabled", false).text(originalText);
      },
    });
  }

  // Publish site
  function publishSite() {
    const publishOption = $('input[name="publish_option"]:checked').val();

    // Show loading state
    const $button = $(".obsidian-btn-primary");
    const originalText = $button.text();
    $button.prop("disabled", true).text("Generating Site...");

    $.ajax({
      url: obsidianOnboarding.ajaxurl,
      type: "POST",
      data: {
        action: "obsidian_publish_site",
        nonce: obsidianOnboarding.nonce,
        publish_option: publishOption,
      },
      success: function (response) {
        if (response.success) {
          if (response.data.download_url) {
            window.location.href = response.data.download_url;
          } else {
            window.location.href = "?page=obsidian-generator";
          }
        } else {
          alert("Error publishing site: " + response.data);
          $button.prop("disabled", false).text(originalText);
        }
      },
      error: function () {
        alert("Error publishing site. Please try again.");
        $button.prop("disabled", false).text(originalText);
      },
    });
  }

  // Smooth transitions between steps
  $(".obsidian-onboarding-content").addClass("fade-in");

  // Keyboard navigation
  $(document).on("keydown", function (e) {
    if (e.key === "Enter" && !$(".obsidian-btn-primary").prop("disabled")) {
      $(".obsidian-btn-primary").click();
    }
  });

  // Initialize selected template if exists
  const selectedTemplate = localStorage.getItem("obsidian_selected_template");
  if (selectedTemplate) {
    $(`.obsidian-template-card[data-template="${selectedTemplate}"]`).addClass(
      "selected"
    );
  }

  // Check sign-in status on page load
  checkSignIn();

  // Continue button in template step
  $(document).on(
    "click",
    ".obsidian-template-step .obsidian-btn-primary",
    function () {
      const selectedTemplate = localStorage.getItem(
        "obsidian_selected_template"
      );
      if (!selectedTemplate) {
        alert("Please select a template first.");
        return;
      }
      window.location.href = `?page=obsidian-generator&step=pages&template=${selectedTemplate}`;
    }
  );

  // Function to handle Clerk token
  function handleClerkToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const clerkToken = urlParams.get("clerk_token");

    if (clerkToken) {
      // Store token in localStorage
      localStorage.setItem("clerk_token", clerkToken);

      // Display token in a div
      const tokenDisplay = $("<div>")
        .addClass("clerk-token-display")
        .css({
          background: "#f8f9fa",
          padding: "15px",
          "border-radius": "8px",
          margin: "20px 0",
          "word-break": "break-all",
          "font-family": "monospace",
          "font-size": "12px",
        })
        .html(`<strong>Clerk Token:</strong><br>${clerkToken}`);

      // Insert the token display after the header
      $(".obsidian-onboarding-header").after(tokenDisplay);
    }
  }

  // Call the function when page loads
  handleClerkToken();
});
