jQuery(function($) {
	$(document).ready(function() {
		
		$("#contact-submit").click(function () {

			var email = $('#contact-email').val();
			var name = $('#contact-name').val();
			var phone = $('#contact-phone').val();
			var message = name + '\n' + phone + '\n' + $('#contact-message').val();

			var contactData = {
				"subject": "Question on FarmShots (Contact)",
				"from": email,
				"content": message
			}
			$.ajax({
				type: 'POST',
				url: 'http://api.farmshots.com/contact',
				data: JSON.stringify(contactData),
				dataType: "json",
				contentType: 'application/json',
				success: function() {
					$('.success').stop().fadeIn(400).delay(3000).fadeOut(400);
				},
				error: function() {
					$('.error').stop().fadeIn(400).delay(3000).fadeOut(400);
				}
			})
		});
	})
});