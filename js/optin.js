if (window.self !== window.top) {
	inFrame = true;
} else {
	inFrame = false;
}
jQuery(document).ready(function() {
	jQuery('script').each(function(index, el) {
		var src = jQuery(this).attr('src');
		if (src) {
			var optinFront = src.indexOf('optin_front_javascript') !== -1;
			var optinFillIn = src.indexOf('optin_fill_in') !== -1;
			if (optinFront || optinFillIn) {
				jQuery(this).remove();
			}
		}
	});
});

jQuery(function () {

	initForms();

});

function initForms() {

	var forms,
		x;

	//loop through all optin forms on this page
	forms = document.querySelectorAll('form[data-optin-id]');

	for ( x = 0; x < forms.length; x++ ) {
		loadOptin(forms[x].getAttribute('data-optin-id'), forms[x].getAttribute('data-domain'));
	}
}

function loadOptin (optinID, theDomain) {
	//load optin form of the server
    jQuery.ajax({
        type: 'GET',
        url: theDomain + 'pages/open/load_optin/' + optinID + '?callback=?',
        jsonpCallback: 'test',
        contentType: "application/json",
        dataType: 'jsonp'
    });
}

// this function was moved in another file to be able to use it in old pages
// the function is still used in other files
function jsonCallBack (data) {
    if( typeof data.countries === 'undefined' ){
        data.countries = {};
    }

    buildOptin(data.fields, data.optin, data.countries, data.countryCodes, data.domain, data.optin.optin_id_encoded);
};

function uniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function buildOptin (fields, optinData, countries, countryCodes, theDomain, optinID) {
	var optinSettings = JSON.parse(optinData.optin_settings);
	
	jQuery('form[data-optin-id="' + optinID + '"]').each(function(index_forms,theForm){

		var uniqueClasses = theForm.className.match(/unique_class_\w+/g),
			uid,
			lastClass;

		if (uniqueClasses) {
			lastClass = uniqueClasses[uniqueClasses.length - 1];
			uid = '_' + lastClass.substr(lastClass.lastIndexOf('_') + 1, lastClass.length);
		} else {
			uid = uniqueId();
		}

	    theForm.classList.add('unique_class_' + uid);
		
	    theForm.classList.add('form_class_' + optinID);
	    theForm.target = '_top';
	    theForm.method = 'POST';
	    theForm.action = theDomain + '/process/add_lead/' + optinData.optin_id_encoded;

	    var fieldBg = theForm.getAttribute('data-field-bg'),
	    	fieldColor = theForm.getAttribute('data-field-color'),
	    	textColor = theForm.getAttribute('data-text-color'),
	    	displayIcons = theForm.getAttribute('data-display-icons'),
	    	fieldStyle = theForm.getAttribute('data-field-style'),
	    	fieldSize = theForm.getAttribute('data-input-class');

	    var applyBgColorTo, applyBgColorToCamel;
	    if (fieldStyle !== 'line') {
	    	applyBgColorTo = 'background-color';
	    	applyBgColorToCamel = 'backgroundColor';
	    } else {
	    	applyBgColorTo = 'border-bottom-color';
	    	applyBgColorToCamel = 'borderBottomColor';
	    }

	    var customStyle = document.createElement('STYLE'),
	    	cStyle = '';
	    cStyle =
	    	'div[class*="leads_capture"] .kartra_page_optin_form .unique_class_' + uid +' .kartra_optin_tnc-form button.btn.dropdown-toggle,'+
	    	'div[class*="leads_capture"] .kartra_page_optin_form  .unique_class_' + uid +' .kartra_optin_cg button.btn.dropdown-toggle{'+
	    		applyBgColorTo + ':' + fieldBg + ';'+
	    		'color:'+fieldColor+' !important;}'+
	    	'.unique_class_' + uid +' .kartra_optin_i {'+
	    		'color:'+fieldColor+' !important;}'+
	    	'.unique_class_' + uid +' .kartra_optin_clabel {'+
	    		'color:'+textColor+' !important;}'+
	    	'.unique_class_' + uid +'  ::-webkit-input-placeholder {color: '+fieldColor+'!important; opacity:0.7;}'+
	    	'.unique_class_' + uid +' ::-moz-placeholder {color: '+fieldColor+'!important; opacity:0.7;}'+
	    	'.unique_class_' + uid +' :-ms-input-placeholder {color: '+fieldColor+'!important; opacity:0.7;}'+
	    	'.unique_class_' + uid +' :-moz-placeholder {color: '+fieldColor+'!important; opacity:0.7;}';
	    
	    if (applyBgColorTo === 'background-color') {
	    	cStyle += 'div[class*="leads_capture"] .kartra_page_optin_form .kartra_optin_wrapper .unique_class_' + uid +' input[type=radio]+small, '+
	    			  'div[class*="leads_capture"] .kartra_page_optin_form .kartra_optin_wrapper .unique_class_' + uid +' input[type=checkbox] + small '+
	    			  	'{ background-color:'+fieldBg+';}';
	    } else {
	    	cStyle += 'div[class*="leads_capture"] .kartra_page_optin_form .kartra_optin_wrapper .unique_class_' + uid +' input[type=radio]+small, '+
	    			  'div[class*="leads_capture"] .kartra_page_optin_form .kartra_optin_wrapper .unique_class_' + uid +' input[type=checkbox] + small '+
	    			  	'{ border-color:'+fieldBg+'; background-color:transparent;}';
	    }
	    customStyle.innerHTML = cStyle;


	    if (displayIcons === 'true') {
	    	displayIcons = true;
	    } else {
	    	displayIcons = false;
	    }
	
		//the first containing DIV
	    var kartra_optin_r = document.createElement('DIV');
	    kartra_optin_r.classList.add('kartra_optin_r');

	
	    //the second containing DIV
	    var kartra_optin_c1 = document.createElement('DIV');
	    kartra_optin_c1.classList.add('kartra_optin_c1');
	
	    kartra_optin_r.appendChild(kartra_optin_c1);

	    //loop through each field
	    for( var x = 0; x < fields.length; x++ ) {
	
	        //get fieldata as JSON
	        var field_data = JSON.parse(fields[x].field_data);

	        if ( typeof field_data.type === 'string' && field_data.type === 'text' && field_data.main_type === 'phone_int' ) {
	
	            //phone with country code
	
	            //the first wrapping DIV
	            var kartra_optin_cg = document.createElement('DIV');
	            kartra_optin_cg.classList.add('kartra_optin_cg');
	
	            var wrapper = document.createElement('DIV');
	            wrapper.classList.add('kartra_optin_phone_wrapper');
	
	            var controlsLeft = document.createElement('DIV');
	            controlsLeft.classList.add('kartra_optin_controls');
	            //extra input classes
	            var extraInputClasses = theForm.getAttribute('data-input-class').split(" ");
	            for( var i = 0; i < extraInputClasses.length; i++ ) {
	                controlsLeft.classList.add( extraInputClasses[i] );
	            }

				var countryCodeSelect = document.createElement('SELECT');

				var newOption = document.createElement('OPTION');

				newOption.innerText = 'Country code...';
				newOption.value = 0;
				newOption.title = 'Country code...';
				newOption.classList.add('disabled');
				newOption.disabled = true;
				newOption.selected = true;

				countryCodeSelect.appendChild(newOption);
				countryCodeSelect.classList.add('for_country_code');
                countryCodeSelect.name = "country_code";
	
	            for( var i = 0; i < countryCodes.length; i++ ) {
	
	                var newOption = document.createElement('OPTION');
	                newOption.title = '+' + countryCodes[i].code;
	                newOption.value = countryCodes[i].code;
	                // newOption.innerText = countryCodes[i].country + "(+" + countryCodes[i].code + ")";
	                newOption.innerText = "+" + countryCodes[i].code + " (" + countryCodes[i].country + ")";
	                newOption.setAttribute('data-content' ,'<span class="ccode">+' + countryCodes[i].code + '</span><span class="cname text">' + countryCodes[i].country + '</span>');
	                countryCodeSelect.appendChild(newOption);
	
	            }

	            if (fieldStyle === 'line') {
	            	controlsLeft.classList.add('kartra_optin_input_bottom_border');
	            } else if (fieldStyle === 'rounded') {
		        	controlsLeft.classList.add('kartra_optin_input_rounded');
		        }

	            if( typeof field_data.required === 'boolean' && field_data.required === true ) {
	            
	                var asterisk = document.createElement('DIV');
	                asterisk.classList.add('kartra_optin_asterisk');
	            
	                controlsLeft.appendChild(asterisk);
	            
	                countryCodeSelect.classList.add('required_' + optinID);
	            
	            }
	
	            controlsLeft.appendChild(countryCodeSelect);
	
	            wrapper.appendChild(controlsLeft);
	
	
	
	            var controlsRight = document.createElement('DIV');
	            controlsRight.classList.add('kartra_optin_controls');
	            //extra input classes
	            var extraInputClasses = theForm.getAttribute('data-input-class').split(" ");
	            for( var i = 0; i < extraInputClasses.length; i++ ) {
	                controlsRight.classList.add( extraInputClasses[i] );
	            }
	
	            var newInput = document.createElement('INPUT');
	            newInput.classList.add('kartra_optin_ti');
	            newInput.type = 'text';
	            newInput.name = "phone_number";
	            newInput.placeholder = field_data.placeholder;
	            newInput.setAttribute('maxlength', '20');
	            newInput.style[applyBgColorToCamel] = fieldBg;
	            newInput.style.color = fieldColor;
	
	            controlsRight.appendChild(newInput);
	
	            var newI = document.createElement('I');
	            newI.classList.add('kartra_optin_i');
	            newI.classList.add('kartra-optin-lineico-mobile-phone-portrait');
	            newI.style.color = fieldColor;
	
				if (displayIcons) {
	            	controlsRight.classList.add('kartra_optin_icon');
	            	controlsRight.appendChild(newI);
				} else {
	            	controlsRight.classList.add('kartra_optin_no_icon');
				}

				if (fieldStyle === 'line') {
	            	controlsRight.classList.add('kartra_optin_input_bottom_border');
	            } else if (fieldStyle === 'rounded') {
		        	controlsRight.classList.add('kartra_optin_input_rounded');
		        }
	
	            wrapper.appendChild(controlsRight);
	
	
	            if( typeof field_data.required === 'boolean' && field_data.required === true ) {
	
	                var asterisk = document.createElement('DIV');
	                asterisk.classList.add('kartra_optin_asterisk');
	
	                controlsRight.appendChild(asterisk);
	
	                newInput.classList.add('required_' + optinID);
	
	            }
	
	
	            kartra_optin_cg.appendChild(wrapper);
	            kartra_optin_c1.appendChild(kartra_optin_cg);
	
	        } else {
	
	            //the first wrapping DIV
	            var kartra_optin_cg = document.createElement('DIV');
	            kartra_optin_cg.classList.add('kartra_optin_cg');
	
	            //the second wrapping DIV
	            var kartra_optin_controls = document.createElement('DIV');
	            kartra_optin_controls.classList.add('kartra_optin_controls');
	
	            //extra input classes
	            var extraInputClasses = theForm.getAttribute('data-input-class').split(" ");
	
	            for( var i = 0; i < extraInputClasses.length; i++ ) {
	                kartra_optin_controls.classList.add( extraInputClasses[i] );
	            }

	            if (fieldStyle === 'line') {
	            	kartra_optin_controls.classList.add('kartra_optin_input_bottom_border');
	            } else if (fieldStyle === 'rounded') {
		        	kartra_optin_controls.classList.add('kartra_optin_input_rounded');
		        }
	
	            kartra_optin_cg.appendChild(kartra_optin_controls);
	
	            var formField = {};

	            if( typeof field_data.type === 'string' && field_data.type !== 'radio' && field_data.type !== 'checkbox' ) {
	
	                if( field_data.type === 'text' ) {
	
	                    formField = document.createElement('INPUT');
	                    formField.type = 'text';
	                    if (field_data.main_type.indexOf('custom') !== -1) {
	                    	formField.setAttribute('autocomplete', 'false');
	                    }
	                
	                } else if ( field_data.type === 'textarea' ) {
	
	                    formField = document.createElement('TEXTAREA');
	
	                } else if ( field_data.type === 'select' && field_data.main_type === 'country' ) {
	
	                    var divControlGroup = document.createElement('DIV');
	                    divControlGroup.classList.add('control-group');
	
	                    formField = document.createElement('SELECT');
						formField.classList.add('bs-select-hidden');

	                    var countryOption = document.createElement('OPTION');
	                    countryOption.innerText = field_data.label;
	                    countryOption.value = "";
						countryOption.classList.add('disabled');
						countryOption.disabled = true;
						countryOption.selected = true;
	
	                    formField.appendChild(countryOption);
	
	                    for ( var y = 0; y < countries.length; y++ ) {
	
	                        var countryOption = document.createElement('OPTION');
	                        countryOption.innerText = countries[y].country_name;
	                        countryOption.value = countries[y].country_code_char3;
	
	                        formField.appendChild(countryOption);
	
	                    }
	
	                    if (displayIcons) {
	                    	kartra_optin_controls.classList.add('kartra_optin_icon');
	                    } else {
	                    	kartra_optin_controls.classList.add('kartra_optin_no_icon');
	                    }
	
	                } else if ( field_data.type === 'select' ) {
	
	                    var divControlGroup = document.createElement('DIV');
	                    divControlGroup.classList.add('control-group');
	
	                    formField = document.createElement('SELECT');
						formField.classList.add('bs-select-hidden');

	                    var customOption = document.createElement('OPTION');
	                    customOption.innerText = field_data.label;
	                    customOption.value = "";
						customOption.classList.add('disabled');
						customOption.disabled = true;
						customOption.selected = true;

	                    formField.appendChild(customOption);
                        var valueSelect = 0;
	                    for ( var optin in field_data.values ) {
	                        if ( field_data.values.hasOwnProperty(optin) ) {
	
	                            var customOption = document.createElement('OPTION');
	                            customOption.innerText = field_data.values[optin].value;
	                            customOption.value = valueSelect;
                                valueSelect++;
	                            formField.appendChild(customOption);
	
	                        }
	                    }
	
	                    if (displayIcons) {
	                    	kartra_optin_controls.classList.add('kartra_optin_icon');
	                    } else {
	                    	kartra_optin_controls.classList.add('kartra_optin_no_icon');
	                    }
	
	                }
	
	                if( typeof field_data.placeholder === 'string' ) formField.placeholder = field_data.placeholder;
	
	                if( typeof field_data.icon === 'string' ) {
	
	
	                    var icon = document.createElement('I');
	                    icon.classList.add('kartra_optin_i');
	                    icon.classList.add('kartra-optin-' + field_data.icon);
	                    icon.style.color = fieldColor;
	
						if (displayIcons) {
	                    	kartra_optin_controls.classList.add('kartra_optin_icon');
	                    	kartra_optin_controls.appendChild(icon);
	                    } else {
	                    	kartra_optin_controls.classList.add('kartra_optin_no_icon');
	                    }
	
	                }
	
	                if( typeof field_data.required === 'boolean' && field_data.required === true ) {
	
	                    var asterisk = document.createElement('DIV');
	                    asterisk.classList.add('kartra_optin_asterisk');
	
	                    kartra_optin_controls.appendChild(asterisk);
	
	                    formField.classList.add('required_' + optinID);
	
	                }
	
	                formField.name = field_data.main_type;

                    if (typeof field_data.type === 'string' && field_data.type === 'text') {
                        switch (field_data.main_type) {
                            case 'first_name':
                            case 'middle_name':
                            case 'last_name':
                            case 'last_name2':
                            case 'city':
                            case 'state':
                                var data_santitation_type = 'name';
                                break;
                            case 'email':
                                var data_santitation_type = 'email';
                                break;
                            case 'phone':
                                var data_santitation_type = 'numeric';
                                break;
                            case 'address':
                            case 'company':
                                var data_santitation_type = 'address_company';
                                break;
                            case 'zip':
                                var data_santitation_type = 'letters_numbers';
                                break;
                            case 'website':
                            case 'facebook':
                            case 'twitter':
                            case 'linkedin':
                            case 'instagram':
                                var data_santitation_type = 'domain';
                                break;
                            default:
                                var data_santitation_type = 'normal';
                        }

                        formField.classList.add('js_kartra_santitation');
                        formField.setAttribute('data-santitation-type', data_santitation_type);
                    }

	                formField.classList.add('kartra_optin_ti');
	                formField.style[applyBgColorToCamel] = fieldBg;
	            	formField.style.color = fieldColor;
	                kartra_optin_controls.appendChild(formField);
	
	
	            } else if ( field_data.type === 'radio' || field_data.type === 'checkbox' ) {
	
	                var label = document.createElement('LABEL');
	                label.innerText = field_data.label;
	                label.classList.add('kartra_optin_clabel');
	                label.style.color = textColor;
	
	                if( typeof field_data.required === 'boolean' && field_data.required === true ) {
	
	                    var asterisk = document.createElement('DIV');
	                    asterisk.classList.add('kartra_optin_asterisk');
	
	                    label.appendChild(asterisk);
	
	                }

	                var radioValue = 0;
	                for ( var radioOption in field_data.values ) {
	                    if ( field_data.values.hasOwnProperty(radioOption) ) {
	
	                        var label2 = document.createElement('LABEL');
	                        label2.classList.add('kartra_optin_field-label');

	                        label2.style.color = textColor;
	                        label2.style.opacity = 0.8;
	
	                        var newRadio = document.createElement('INPUT');
	
	                        if ( field_data.type === 'radio' ) {
	
	                            newRadio.type = 'radio';
	                            newRadio.name = field_data.main_type;
	
	                        } else if ( field_data.type === 'checkbox' ) {
	
	                            newRadio.type = 'checkbox';
	                            newRadio.name = field_data.main_type + "[]";
	
	                        }
	                        
	                        newRadio.value = radioValue;
	                        newRadio.classList.add('kartra_optin_ezmark');

	                        if( typeof field_data.required === 'boolean' && field_data.required === true ) {
	
			                    newRadio.classList.add('required_' + optinID);
			
			                }
	
	                        var newSpan = document.createElement('SPAN');
	                        newSpan.innerText = field_data.values[radioOption].value;
	
	                        label2.appendChild(newRadio);
	                        label2.appendChild(newSpan);
	
	                        kartra_optin_controls.appendChild(label2);
                            radioValue++;
	                    }
	                }
	
	                kartra_optin_cg.insertBefore(label, kartra_optin_controls);
	
	            }
	
	            kartra_optin_c1.appendChild(kartra_optin_cg);
	
	        }
	    
	    }
	
	    //submit block
	    var submitBlock = document.createElement('DIV');
	    submitBlock.classList.add('kartra_optin_cg');
	
	    var submitButton = document.createElement('BUTTON');
	
	    //include terms&conditions block
	    if( typeof optinSettings.tnc_enable === 'string' && optinSettings.tnc_enable === 'yes' ) {
	
	        submitBlock.classList.add('kartra_optin_tnc-form');
	        submitBlock.id = 'kartra_optin_tnc-form';
	        submitBlock.setAttribute('data-contenttype', 'submit');
	
	        var tnc_block = jQuery('<div class="kartra_optin_controls"><label class="kartra_optin_field-label"><input name="terms" value="1" type="checkbox" class="kartra_optin_ezmark ez-hide" id="terms_' + optinID + '"><a target="_blank" href="' + optinSettings.tnc_protocol + optinSettings.tnc_url_input + '" style="color: '+textColor+'">' + optinSettings.tnc_text_input + '</a></label></div>');
	        tnc_block.find('input').on('change', function () {
	        	if ( jQuery(this).is(':checked') ) {
	        		jQuery(this).closest('.kartra_optin_cg').find('button[type="submit"]')[0].removeAttribute('disabled');
	        	} else {
	        		jQuery(this).closest('.kartra_optin_cg').find('button[type="submit"]')[0].setAttribute('disabled', true);
	        	}
	        });
	
	        submitBlock.appendChild(tnc_block.get(0));
	        submitButton.setAttribute('disabled', 'disabled');
	    }


	
	    
	    submitButton.innerText = theForm.getAttribute('data-submit-text');
	    submitButton.type = 'submit';
	    submitButton.classList.add('kartra_optin_submit_btn');
	    submitButton.classList.add('kartra_optin_btn_block');
	    if ( fieldSize === 'kartra_optin_input_large' ) submitButton.classList.add('kartra_optin_btn_large');
	    else if ( fieldSize === 'kartra_optin_input_medium' ) submitButton.classList.add('kartra_optin_btn_medium');
	    else if ( fieldSize === 'kartra_optin_input_small' ) submitButton.classList.add('kartra_optin_btn_small');
	    else if ( fieldSize === 'kartra_optin_input_giant' ) submitButton.classList.add('kartra_optin_btn_giant');
	    submitButton.classList.add('submit_button_' + optinID);
	
	    if( theForm.getAttribute('data-submit-type') === 'Hollow' ) {
	
	        var bgColor,
	            txColor;
	
	        submitButton.classList.add('hollow');
	
	        submitButton.style.border = '2px solid ' + theForm.getAttribute('data-submit-color');
	        submitButton.style.color = theForm.getAttribute('data-submit-color');
	        submitButton.style.backgroundColor = 'transparent';
	
	        bgColor = theForm.getAttribute('data-submit-bg');
	        txColor = theForm.getAttribute('data-submit-color');
	
	        jQuery(submitButton).off('mouseover').off('mouseout').on('mouseover', function () {
	
	            jQuery(this).css('background-color', bgColor);
	            jQuery(this).css('border-color', bgColor);
	            jQuery(this).css('color', '#fff');
	
	        }).on('mouseout', function () {
	            
	            jQuery(this).css('background-color', 'transparent');
	            jQuery(this).css('color', txColor);
	            jQuery(this).css('border-color', txColor);
	
	        });
	        
	        jQuery(submitButton).attr('data-background-color', bgColor);
	        jQuery(submitButton).attr('data-color', txColor);
	
	    } else {
	
	        submitButton.style.backgroundColor = theForm.getAttribute('data-submit-bg');
	        submitButton.style.color = theForm.getAttribute('data-submit-color');
	
	    }

	    if (theForm.getAttribute('data-submit-bold') === '400') {
	    	submitButton.style.fontWeight = '400';
	    } else {
	    	submitButton.style.fontWeight = '700';
	    }
	
	    if( theForm.getAttribute('data-submit-corners') === 'Rounded' ) submitButton.classList.add('btn-rounded');
	
	    if( theForm.getAttribute('data-submit-shadow') !== 'none' ) submitButton.classList.add(theForm.getAttribute('data-submit-shadow'));
	
	    
		var gdpr_block = jQuery(optinData.gdpr_checkboxes);
		gdpr_block.find('.js_gdpr_label_terms').css('color', textColor);
		gdpr_block.find('.js_gdpr_label_communications').css('color', textColor);
		gdpr_block.find('.js_kartra_popover_trigger').css('color', textColor);
	    submitBlock.appendChild(gdpr_block.get(0));
	    submitBlock.appendChild(submitButton);
	    
	    kartra_optin_c1.appendChild(submitBlock);
	
	
	    //privacy statement
	    if( typeof optinSettings.pp_enable === 'string' && optinSettings.pp_enable === 'yes' ) {
	
	        var statementBlock = document.createElement('DIV');
	        statementBlock.classList.add('kartra_optin_cg');
	        statementBlock.classList.add('kartra_optin_privacy-block');
	        statementBlock.id = 'kartra_optin_privacy-block';
	
	        var controlsBlock = document.createElement('DIV');
	        controlsBlock.classList.add('kartra_optin_controls');
	        controlsBlock.classList.add('kartra_optin_notice');

	        if (fieldStyle === 'line') {
	        	controlsBlock.classList.add('kartra_optin_input_bottom_border');
	        } else if (fieldStyle === 'rounded') {
	        	controlsBlock.classList.add('kartra_optin_input_rounded');
	        }
	
	        statementBlock.appendChild(controlsBlock);
	
	        var iBlock = document.createElement('I');
	        iBlock.classList.add('kartra-optin-lineico-lock-close-1');
	        iBlock.style.color = textColor;
	        iBlock.style.opacity = 0.8;
	
	        controlsBlock.appendChild(iBlock);
	
	        var pBlock = document.createElement('P');
	        pBlock.innerText = jQuery('<div>').html(optinSettings.pp_text_input).text();
			pBlock.style.color = textColor;
	        pBlock.style.opacity = 0.8;
	
	        controlsBlock.appendChild(pBlock);
	
	        kartra_optin_c1.appendChild(statementBlock);
	
	    }
	
	
	    theForm.innerHTML = '';
	    theForm.setAttribute('data-optin-id', optinData.optin_id_encoded);
	    theForm.appendChild(kartra_optin_r);
	
	    //call the builder heightAdjustment menthod on this block, if possible
	    if ( !inFrame && typeof window.parent.pages !== 'undefined' && typeof window.parent.pages.heightAdjustment === 'function' ) window.parent.pages.builder.heightAdjustment(theForm);
	
	    //create the overlay, if the function exists
	    if ( typeof window.optinFormOverlays === 'function' ) window.optinFormOverlays(theForm);
	
	    theForm.parentNode.classList.add('form_class_' + optinID);
	    //script tag fill in
	    var fillinSrc = theDomain + '/resources/js/optin_fill_in?optin=' + optinID;
	    if (jQuery('script[src="'+fillinSrc+'"]').length === 0) {
	    	var scriptTagOptinFill = document.createElement('SCRIPT');
		    scriptTagOptinFill.src = fillinSrc;
		    document.body.appendChild(scriptTagOptinFill);
	    }

	    //script tag sanitation
	    var sanitationSrc = theDomain + 'js/santitation_for_naked_checkout.js';
	    if (jQuery('script[src="'+sanitationSrc+'"]').length === 0) {
	    	var scriptTagSantitation = document.createElement('SCRIPT');
		    scriptTagSantitation.src = sanitationSrc;
		    document.body.appendChild(scriptTagSantitation);
            scriptTagSantitation.onload = function(){
                kartra_checkout_jquery = jQuery;
                //apply sanitation on the form
                if (typeof window.jsVars.sanitation_rules !== 'undefined' && typeof apply_santitation === 'function') {
                    apply_santitation(window.jsVars.sanitation_rules);
                }
			};
	    }

	    //script tag
	    var frontSrc = theDomain + '/resources/js/optin_front_javascript?form_id=' + optinID;
	    if (jQuery('script[src="'+frontSrc+'"]').length === 0) {
		    var scriptTag = document.createElement('SCRIPT');
		    scriptTag.src = frontSrc;
		    document.body.appendChild(scriptTag);
		}
	    
	    var initUI = function () {
	    	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
	            jQuery(theForm).find('select').selectpicker({
	    	        size: 8,
	    	        mobile:true
	    	    });
	        } else {
	            jQuery(theForm).find('select').selectpicker({
	    	        size: 8
	    	    });
	        }
	        jQuery(theForm).find('.kartra_optin_ezmark:not([data-js_input_initialised])').after('<small></small>').attr("data-js_input_initialised", "1");
	    }

	    var selectpickerSrc = "https://d2uolguxr56s4e.cloudfront.net/external/bootstrap-select.min.js";

	    if (jQuery('script[src="'+selectpickerSrc+'"]').length === 0 && 'undefined' === typeof jQuery.fn.selectpicker) {
		    var js_selectpicker = document.createElement("script");

		    js_selectpicker.type = "text/javascript";
		    js_selectpicker.onload = function() {
		        initUI();
		    };

		    document.body.appendChild(js_selectpicker);
		    js_selectpicker.src = selectpickerSrc;
		} else {
			initUI();
		}
	    //dropdowns

	    kartra_optin_r.insertBefore(customStyle, kartra_optin_r.firstChild);

	});

	if (typeof window['kartra_prefill_optin'] === 'function') {
		kartra_prefill_optin(optinID);
	}

	if (typeof window['kartra_init_optin_gdpr'] === 'function') {
		kartra_init_optin_gdpr(optinID);
	}

}