/* Template: Zigo - Software Business HTML Landing Page Template
   Author: mobispread
   Created: Sep 2019
   Description: Custom JS file
*/


(function($) {
    "use strict";

    //phsubmitMSG(true, "");
    var input = document.querySelector("#phone");
    var iti = window.intlTelInput(input, {
       // any initialisation options go here
       autoPlaceholder: 'off',
       utilsScript: "./js/utils.js",
     });

    /* Phone Form */
    $("#phoneForm").validator().on("submit", function(event) {
    	if (event.isDefaultPrevented()) {
            // handle the invalid form...
            phformError();
            //phsubmitMSG(false, "Please fill all fields!");
        } else {
            // everything looks good!
            var number = iti.getNumber();
            /*
            var val = $("#phone").val();
            const regexRepl = /[\(\)\- ]/g;
            const phone = val.replace(regexRepl, "");
            const regexMatch = /^\+?(?:[0-9]●?){6,14}[0-9]$/g;
            const found = phone.match(regexMatch);
            */
            if(!iti.isValidNumber()) {
                event.preventDefault();
                phformError();
                phsubmitMSG(false, "Please Enter a Valid Phone Number!");

                //return false;
            } else {
                event.preventDefault();
                phsubmitForm(number);
            }

        }
    });

    function phsubmitForm(phone) {
        // initiate variables with form content
        $.ajax({
            type: "GET",
            url: "https://api.telnyx.com/anonymous/v2/number_lookup/" + phone,
            success: function(text) {
                $("#phoneResponseData").show();
                phformSuccess();
                $("#phoneNumber").text(text.data.phone_number);
                $("#countryCode").text(text.data.country_code);
                $("#phoneType").text(text.data.carrier.type);
                $("#carrierName").text(text.data.carrier.name);
            },
           error: function(text) {
               phformError();
               phsubmitMSG(false, "Please retry");
           }
        });
	}

    function phformSuccess() {
        $("#phoneForm")[0].reset();
        phsubmitMSG(true, "");
        $("input").removeClass('notEmpty'); // resets the field label after submission
        $("textarea").removeClass('notEmpty'); // resets the field label after submission
    }

    function phformError() {
        $("#phoneForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass();
        });
        $("#phoneResponseData").hide();
	}

    function phsubmitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h4 text-center tada animated";
        } else {
            var msgClasses = "h4 text-center";
        }
        $("#phonemsgSubmit").removeClass().addClass(msgClasses).text(msg);
    }

})(jQuery);
