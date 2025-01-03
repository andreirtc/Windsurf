$(document).ready(function() {
    const convertBtn = $('#convertBtn');
    const infixInput = $('#infixInput');
    const stepsContainer = $('#steps');

    convertBtn.on('click', function() {
        const expression = infixInput.val().trim();
        if (!expression) {
            alert('Please enter an infix expression');
            return;
        }

        // Clear previous steps
        stepsContainer.empty();

        // Send request to backend
        $.ajax({
            url: '/api/shunting-yard',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ expression: expression }),
            success: function(response) {
                // Animate each step
                response.steps.forEach((step, index) => {
                    const stepElement = $(`<div class="step-display">${step}</div>`)
                        .css('opacity', 0)
                        .appendTo(stepsContainer);
                    
                    // Animate step appearance
                    gsap.to(stepElement, {
                        opacity: 1,
                        x: 0,
                        duration: 0.5,
                        delay: index * 0.3,
                        ease: "power2.out"
                    });
                });
            },
            error: function() {
                alert('Error processing expression');
            }
        });
    });

    // Add hover effect to convert button
    gsap.to(convertBtn, {
        scale: 1.1,
        duration: 0.3,
        paused: true
    });

    convertBtn.hover(
        function() { gsap.to(this, { scale: 1.1, duration: 0.3 }); },
        function() { gsap.to(this, { scale: 1, duration: 0.3 }); }
    );
});
