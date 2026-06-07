// Optional: Add a soft scale animation on hover
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.2s ease";
        card.style.transform = "scale(1.03)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "scale(1)";
    });
});