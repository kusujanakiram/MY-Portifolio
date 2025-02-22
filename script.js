// Preloader fade-out on page load
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.classList.add("hidden");
        setTimeout(() => {
            preloader.style.display = "none";
        }, 500);
    }
});

// Star Rating Logic
document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");
    const ratingText = document.getElementById("rating-text");
    const ratingInput = document.getElementById("rating"); // Hidden input for backend
    const form = document.getElementById("contactForm");
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener("mouseover", () => highlightStars(star.dataset.value));
        star.addEventListener("click", () => setRating(star.dataset.value));
    });

    function highlightStars(value) {
        stars.forEach(star => {
            star.classList.toggle("active", star.dataset.value <= value);
        });
    }

    function setRating(value) {
        selectedRating = value;
        ratingText.textContent = `You rated this ${value} star(s).`;
        ratingInput.value = value; // Store the rating for submission
    }

    // Form Submission Logic
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message || selectedRating === 0) {
            alert("Please fill in all fields and provide a rating.");
            return;
        }

        const formData = { name, email, message, rating: selectedRating };

        try {
            const response = await fetch("http://localhost:5000/submit-review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json(); // Parse JSON response

            if (response.ok) {
                alert(data.message || "Thank you for your review!");
                form.reset();
                stars.forEach(star => star.classList.remove("active"));
                selectedRating = 0;
                ratingInput.value = 0;
                ratingText.textContent = "Click on the stars to rate!";
            } else {
                alert(data.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to submit. Please check your internet connection.");
        }
    });
});

// Smooth Scroll with Offset
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const offset = 20; 
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            
            window.scrollTo({
                top: elementPosition - headerHeight - offset,
                behavior: "smooth"
            });
        }
    });
});
document.getElementById("message").addEventListener("focus", function() {
    console.log("Textarea focused!");
});
document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");
    const ratingText = document.getElementById("rating-text");
    const ratingInput = document.getElementById("rating");
    const form = document.getElementById("contactForm");
    const submitButton = document.getElementById("submit-rating"); // Get submit button
    let selectedRating = 0;

    // Star Rating Logic
    stars.forEach(star => {
        star.addEventListener("mouseover", () => highlightStars(star.dataset.value));
        star.addEventListener("click", () => setRating(star.dataset.value));
    });

    function highlightStars(value) {
        stars.forEach(star => {
            star.classList.toggle("active", star.dataset.value <= value);
        });
    }

    function setRating(value) {
        selectedRating = value;
        ratingText.textContent = `You rated this ${value} star(s).`;
        ratingInput.value = value;
    }

    // Form Submission Logic
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message || selectedRating === 0) {
            alert("Please fill in all fields and provide a rating.");
            return;
        }

        const formData = { name, email, message, rating: selectedRating };

        // **Show loading state**
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {
            const response = await fetch("https://portifolio-cjuq.onrender.com/submit-review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Thank you for your review!");
                form.reset();
                stars.forEach(star => star.classList.remove("active"));
                selectedRating = 0;
                ratingInput.value = 0;
                ratingText.textContent = "Click on the stars to rate!";
            } else {
                alert(data.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to submit. Please check your internet connection.");
        }

        // **Reset loading state**
        submitButton.disabled = false;
        submitButton.textContent = "Submit Rating";
    });
});
