// Move URL parameter handling to top of file for immediate execution
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get('utm_source');

// Debug logging
console.log('URL Parameters:', Object.fromEntries(urlParams));
console.log('UTM Source:', utmSource);

// Update parameter mapping
const paramMapping = {
  'utm_source': 'ref_source',
  'matchtype': 'matchtype',
  'utm_term': 'utm_term',
  'adgroup': 'adgroup',
  'device_category': 'device_category',
  'src_id': 'src_id',
  'utm_medium': 'utm_medium',
  'utm_campaign': 'utm_campaign',
  'ad': 'ad',
  'network': 'network',
  'affiliate_var': 'affiliate_var',
  'affiliate_var2': 'affiliate_var2',
  'affiliate_var3': 'affiliate_var3',
  'affiliate_var4': 'affiliate_var4',
  'hasoffer_trans_id': 'hasoffer_trans_id'
};

// Function to set hidden input fields
function setHiddenFields() {
  Object.entries(paramMapping).forEach(([urlParam, fieldId]) => {
    const value = urlParams.get(urlParam);
    if (value) {
      let input = document.getElementById(fieldId);
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.id = fieldId;
        input.name = fieldId;
        document.getElementById('optimataxrelief_wordpress').appendChild(input);
      }
      input.value = value;
      console.log(`Setting ${fieldId} to ${value}`); // Debug log
    }
  });
}

// Add this phone number mapping object at the top of your DOMContentLoaded function
const phoneNumbers = {
  msn: '(800) 819-9402',
  default: 'GET TAX RELIEF (800) 536-0734',
};

// Replace phone numbers in the document
function updatePhoneNumbers() {
  try {
    const phoneNumber = phoneNumbers[utmSource] || phoneNumbers.default;

    // Find and replace phone numbers in text content
    document.querySelectorAll('*').forEach((element) => {
      if (element.childNodes.length === 1 && element.firstChild.nodeType === 3) {
        const text = element.textContent;
        if (text.includes('(800) 536-0734')) {
          element.textContent = text.replace('(800) 536-0734', phoneNumber);
        }
      }
    });

    // Update href attributes for phone links
    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
      const cleanNumber = phoneNumber.replace(/[^\d]/g, '');
      link.href = `tel:${cleanNumber}`;
      if (link.textContent.includes('(800) 536-0734')) {
        link.textContent = phoneNumber;
      }
    });
  } catch (error) {
    console.error('Error updating phone numbers:', error);
  }
}

// Call the function to update phone numbers
updatePhoneNumbers();

// Webform UX
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('optimataxrelief_wordpress');
    const steps = form.querySelectorAll('.form-step');
    let currentStep = 0;
    let isSubmitting = false;

    // State mapping from abbreviations to full names
    const stateNames = {
        'CO': 'Colorado',
        'ND': 'North Dakota',
        'MN': 'Minnesota'
        // Add more states as needed
    };

    // Function to generate a GUID
    function generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    // Function to set a cookie with the generated GUID
    function setCookie(name, value, hours) {
        let expires = '';
        if (hours) {
            var date = new Date();
            date.setTime(date.getTime() + hours * 60 * 60 * 1000);
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    }

    // Generate a GUID
    let guid = generateGUID();

    // Set the cookie with the GUID as its value, valid for 12 hours
    setCookie('optima_tax_form_uuid', guid, 12);

    // Function to show a specific step
    function showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) {
            console.error('Invalid step index:', stepIndex);
            return;
        }
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
        });
        currentStep = stepIndex; // Update currentStep to match shown step
    }

    // Function to handle form submission
    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission
        if (isSubmitting) return; // Prevent multiple submissions

        const phone = document.getElementById('phone_1').value;
        const email = document.getElementById('email').value;

        if (!phone.match(/^\(\d{3}\) \d{3}-\d{4}$/)) {
            alert('Please enter a valid phone number');
            return;
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert('Please enter a valid email address');
            return;
        }

        const selectedStateAbbrev = document.getElementById('state').value;
        const thankYouStep = document.getElementById('thank-you');

        // Check if the selected state is CO or NY
        if (selectedStateAbbrev === 'CO' || selectedStateAbbrev === 'ND' || selectedStateAbbrev === 'MN') {
            const selectedStateName = stateNames[selectedStateAbbrev]; 
            thankYouStep.innerHTML = `<h2>Optima does not service clients in ${selectedStateName}</h2><p>We recommend using SuperMoney’s transparent comparison site to find your best option for tax relief in that state. <span><a href="https://super.go2cloud.org/aff_c?offer_id=1624&aff_id=1020">Get Tax Help in ${selectedStateName}</a></span></p>`;
            thankYouStep.style.display = 'block';
            showStep(steps.length - 1); // Show thank you step with custom message
            return;
        }

        isSubmitting = true;
        const formData = new FormData(form);
        formData.append('action', 'submit_form');
        formData.append('security', my_ajax_obj.nonce); // Use nonce from localized script

        data['status'] = 'completed';
        jQuery(function ($) {
            $.ajax({
                type: 'post',
                url: 'https://app.optimataxrelief.com/api/updateFormActivity/' + myCookieValue,
                data: data,
                dataType: 'json',
                cache: false
            }).done(function (data) {

            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.error('Form activity update failed:', errorThrown);
            });
        });

        // AJAX request
        fetch(my_ajax_obj.ajax_url, {
            method: 'POST',
            body: new URLSearchParams(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showStep(steps.length - 1); // Show thank you message
            } else {
                alert('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the form.');
        })
        .finally(() => {
            isSubmitting = false; // Reset the flag after the request is complete
        });
    }

    // Remove any existing 'submit' event listeners on the form
    form.removeEventListener('submit', handleFormSubmit);

    // Add the 'submit' event listener to the form
    form.addEventListener('submit', handleFormSubmit);

    // make the phone field looks nicer
    document.getElementById('phone_1').addEventListener('input', function (e) {
		var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
		e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
	});
	document.getElementById('phone_1').addEventListener('submit', function (e) {
		e.preventDefault(); // Prevent default form submission
		var phoneNumber = document.getElementById('phoneInput').value;
		var plainNumber = phoneNumber.replace(/\D/g, '');		
		// Now, use `plainNumber` for further processing or storing
	});

    // Add event listener for debt_amount select
    document.getElementById('debt_amount').addEventListener('change', function() {
        currentStep++;
        showStep(currentStep);
    });

    // Initialize first step
    showStep(0);

    //form_activity.js start
    // Retrieve the value of 'optima_tax_form_uuid'
    let myCookieValue = getCookie('optima_tax_form_uuid');

    const targetFields = [
            {
                name: 'first_name',
                id: 'first_name'
            },
            {
                name: 'last_name',
                id: 'last_name'
            },
            {
                name: 'email',
                id: 'email'
            },
            {
                name: 'phone',
                id: 'phone_1'
            },
            {
                name: 'debt',
                id: 'debt_amount'
            },
            {
                name: 'state',
                id: 'state',
            },
        ];

    let data = {
        form_id: 'optimataxrelief_wordpress',
        website: 'optimataxrelief.com',
        uuid: guid,
        status: 'abandoned'
    };

    jFormActivity();

    // Function to retrieve the value of a specific cookie by its name
    function getCookie(name) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Check if this cookie is the one we're looking for
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1); // Retrieve the cookie value
            }
        }
        return null; // Return null if the cookie is not found
    }

    function jFormActivity() {
        if (typeof jQuery === 'undefined') {
            console.error('jQuery is not loaded');
            return;
        }

        targetFields.forEach(function (item) {
            data[item.name] = document.getElementById(item.id).value;
        });

        ajaxUpdate();
    }

    function ajaxUpdate() {
        if (!myCookieValue) {
            console.warn('Missing form UUID cookie');
            return;
        }

        if (!(data.email || (data.phone && data.phone.length === 14))) {
            return;
        }

        jQuery(function($) {
            $.ajax({
                type: 'post',
                url: 'https://app.optimataxrelief.com/api/updateFormActivity/' + myCookieValue,
                data: data,
                dataType: 'json',
                cache: false
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.error('Form activity update failed:', errorThrown);
            });
        });

        initialize();
    }

    function initialize() {
        targetFields.forEach(function (item) {
            if(item.name == 'debt') {
                document.getElementById(item.id).addEventListener("change", function () {
                    currentStep++;
                    showStep(currentStep);
                    jFormActivity();
                });
            } else {
                document.getElementById(item.id).addEventListener("change", jFormActivity);
            }
        });
    }
    //form_activity.js end

    // Call setHiddenFields when DOM is ready
    setHiddenFields();
});