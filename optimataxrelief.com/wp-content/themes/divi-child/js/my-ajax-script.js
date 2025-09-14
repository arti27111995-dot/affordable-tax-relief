jQuery(document).ready(function($) {
    // Binding the form submission event
    $('#lead_form').submit(function(e) {
        e.preventDefault(); // Prevent default form submission

        // Collecting form data
        var formData = {
            'action': 'submit_form', // This should match the action in your add_action hook
            'nonce': my_ajax_obj.nonce, // Nonce for security, passed from wp_localize_script
            'first_name': $('input[name="first_name"]').val(),
            'last_name': $('input[name="last_name"]').val(),
            'email': $('input[name="email"]').val(),
            'phone_1': $('input[name="phone_1"]').val(),
            'state': $('#state').val(),
            'debt_amount': $('#debt_amount').val()
        };

        // AJAX request
        $.ajax({
            url: my_ajax_obj.ajax_url, // URL from wp_localize_script
            type: 'POST',
            data: formData,
            success: function(response) {
                // Handle the response here
                if (response.success) {
                    // For example, redirect to a thank you page or show a success message
                    window.location.href = '/thank-you/';
                } else {
                    // Display an error message
                    alert('Form submission failed: ' + response.data.message);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Handle errors here
                console.error('The following error occurred: ' + textStatus, errorThrown);   
                alert('An error occurred while submitting the form.');
            }
        });
    });
});

