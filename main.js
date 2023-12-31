document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('DOMContentLoaded', function () {
        var checkboxes = document.querySelectorAll('input[name="muscles"]');
        
        checkboxes.forEach(function (checkbox) {
          checkbox.addEventListener('change', function () {
            var checkedCheckboxes = document.querySelectorAll('input[name="muscles"]:checked');
            
            if (checkedCheckboxes.length > 2) {
              this.checked = false; // Prevent checking more than 2 checkboxes
            }
            
            if (checkedCheckboxes.length < 1) {
              this.checked = true; // Ensure at least 1 checkbox is checked
            }
          });
        });
    });

    // Add an event listener to the "Generate Workout" button
    document.querySelector('.btn41-43').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        showLoadingAnimation();
        
        // Gather user inputs
        var userName = document.getElementById('user-name').value;
        var fitnessLevel = document.querySelector('input[name="level"]:checked').value;
        var workoutDuration = document.getElementById('workoutDuration').value;
        var selectedMuscles = Array.from(document.querySelectorAll('input[name="muscles"]:checked')).map(checkbox => checkbox.value);
        var exerciseType = document.getElementById('exercise').value;

        // Construct the message object
        var message = {
            "role": "user",
            "content": `Generate a workout routine for ${userName} with fitness level ${fitnessLevel}, targeting ${selectedMuscles.join(', ')} muscles, lasting ${workoutDuration} minutes, and focusing on ${exerciseType} exercises. (Keep response to about 100 words max)`
        };

        // Send request to OpenAI API
        $.ajax({
            url: "https://api.openai.com/v1/chat/completions",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [message],
                "temperature": 0.7
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer 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');
            },
            success: function (result) {
                console.log(result);
                // Handle the result as needed (e.g., update the UI with the generated workout)
                hideLoadingAnimation();
                displayGeneratedWorkout(result.choices[0].message.content);
            },
            error: function (error) {
                hideLoadingAnimation();
                console.error(error);
            }
        });
    });

    function showLoadingAnimation() {
        // Show the loading animation
        var loadingAnimationElement = document.getElementById('loadingAnimation');
        loadingAnimationElement.style.display = 'block';
    }

    function hideLoadingAnimation() {
        // Hide the loading animation
        var loadingAnimationElement = document.getElementById('loadingAnimation');
        loadingAnimationElement.style.display = 'none';
    }

    function displayGeneratedWorkout(workoutContent) {
        // Clear the previous workout content
        var generatedWorkoutElement = document.getElementById('generatedWorkout');
        generatedWorkoutElement.innerHTML = '';

        // Update the content of the element with the new generated workout
        generatedWorkoutElement.innerHTML = `<p>${workoutContent}</p>`;
    }
});
