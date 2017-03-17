/* global $, Stripe */

//Document ready for recurring payments.
$(document).on ('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-submit-btn');
  
  //Set Stripe public key so that Stripe knows that who asks for a token is truly themselves.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') )
  
  //When user clicks form submit btn.
  //prevent default submission behaviour.
  SubmitBtn.click(function(event){
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled', true);
    
  //Collect the credit card fields.
  var ccNum = $('#card_number').val(),
      cvcNum = $('#card_code').val(),
      expMonth = $('#card_month').val(),
      expYear = $('#card_year').val();
      
  //Use Stripe JS library to check for card error.
  var error = false;
  
  //Validate card number.
  if(!Stripe.card.validateCardNumber(ccNum)) {
    error = true;
    alert("The credit card number appears to be invalid");
  }
  
  //Validate CVC number.
  if(!Stripe.card.validateCVC(cvcNum)) {
    error = true;
    alert("The CVC number appears to be invalid");
  }
  
  //Validate expiration date.
  if(!Stripe.card.validateExpiry(expMonth, expYear)) {
    error = true;
    alert("The expiration date appears to be invalid");
  }
  
  if(error) {
    //If there are errors, don't send to Stripe, so that consumer can correct the form fields.
    SubmitBtn.prop('disabled', false).val('Sign Up');
    } else {
      //Send card info to Stripe.
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    
  }
  
  //Tell JS to finish the function.
  return false;
  });
  
  //Stripe will return back a card token and we will need to handle it.
  function stripeResponseHandler(status, response) {
    //Get the card token from response.
    var token = response.id;
    //Inject card token as hidden field into form.
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
    //Submit form to rails app. PCI compliance
    theForm.get(0).submit();
  }
});