document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const contactForm = document.getElementById('contactForm');
    const sendButton = document.getElementById('send_message');
    const textInput = document.getElementById('txtInput');
    const textCaptcha = document.getElementById('txtCaptcha');
    const textCaptchaSpan = document.getElementById('txtCaptchaSpan');
    const subjectSelect = document.querySelector('select[name="contact_subject"]');

    // Generates the Random number function 
    function randomNumber() {
        const a = Math.ceil(Math.random() * 9).toString();
        const b = Math.ceil(Math.random() * 9).toString();
        const c = Math.ceil(Math.random() * 9).toString();
        const d = Math.ceil(Math.random() * 9).toString();
        const e = Math.ceil(Math.random() * 9).toString();
        const code = a + b + c + d + e;
        
        textCaptcha.value = code;
        textCaptchaSpan.innerHTML = code;
    }

    // Called random number function on page load
    randomNumber();

    // Validate the Entered input against the generated security code function   
    function validateCaptcha() {
        const str1 = textCaptcha.value;
        const str2 = textInput.value;
        return str1 === str2;
    }

    // Form Control Captcha Validate
    textInput.addEventListener('keyup', function() {
        if (validateCaptcha()) {
            this.parentElement.classList.remove('error');
            this.parentElement.classList.add('success');
        } else {
            this.parentElement.className = 'error';
        }
    });

    // Handle form submission
    sendButton.addEventListener('click', function(e) {
        e.preventDefault();

        // Get form values
        const formData = {
            name: document.querySelector('input[name="contact_name"]').value.trim(),
            email: document.querySelector('input[name="contact_email"]').value.trim(),
            phone: document.querySelector('input[name="contact_phone"]').value.trim(),
            subject: subjectSelect.value,
            message: document.querySelector('textarea[name="contact_message"]').value.trim()
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            document.getElementById('empty-form').style.display = 'block';
            setTimeout(() => {
                document.getElementById('empty-form').style.display = 'none';
            }, 3000);
            return;
        }

        // Subject validation
        if (formData.subject === 'Choose Services') {
            const subjectAlert = document.getElementById('subject-alert');
            subjectAlert.style.display = 'block';
            subjectSelect.parentElement.classList.remove('success');
            subjectSelect.parentElement.classList.add('error');
            setTimeout(() => {
                subjectAlert.style.display = 'none';
            }, 3000);
            return;
        }

        // CAPTCHA validation
        if (!validateCaptcha()) {
            document.getElementById('security-alert').style.display = 'block';
            setTimeout(() => {
                document.getElementById('security-alert').style.display = 'none';
            }, 3000);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            document.getElementById('email-invalid').style.display = 'block';
            setTimeout(() => {
                document.getElementById('email-invalid').style.display = 'none';
            }, 3000);
            return;
        }

        // Phone validation for Sri Lankan numbers
        const phoneRegex = /^(?:\+94|0)[1-9][0-9]{8}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            document.getElementById('phone-invalid').style.display = 'block';
            setTimeout(() => {
                document.getElementById('phone-invalid').style.display = 'none';
            }, 3000);
            return;
        }

        // Send email using EmailJS
        emailjs.send("service_hxfipza", "template_rk7y2vm", {
            from_name: formData.name,
            reply_to: formData.email,
            phone_number: formData.phone,
            subject: formData.subject,
            message: formData.message,
            to_email: 'nipunagamage999@gmail.com'
        })
        .then(function(response) {
            // Show success message
            document.getElementById('success_mail').style.display = 'block';
            contactForm.reset();
            // Reset subject select classes
            subjectSelect.parentElement.classList.remove('success', 'error');
            // Generate new CAPTCHA after successful submission
            randomNumber();
            setTimeout(() => {
                document.getElementById('success_mail').style.display = 'none';
            }, 3000);
        })
        .catch(function(error) {
            // Show error message
            document.getElementById('error_mail').innerHTML = '<p>Failed to send message. Please try again later.</p>';
            document.getElementById('error_mail').style.display = 'block';
            setTimeout(() => {
                document.getElementById('error_mail').style.display = 'none';
            }, 3000);
        });
    });
});