/**
 * @file CheckoutForm.js
 * @name UI/Forms/Checkout Form
 * @author Vitezslav Miech
 * @created 2017/08/02
 * Tested on Chrome, Firefox, Edge, iOS tablet, Android phone, IE11
 */

xdescribe("CheckoutForm", function() {

	var prefix = '#kitchensink-view-forms-checkout',
		containers = ['Contact Information', 'Shipping Address', 'Billing Address', 'Payment Information'],
		fieldNames = ['firstName', 'lastName', 'email', 'phone', 'shipping_address','shipping_city', 'shipping_state', 
						'shipping_postalcode', 'billing_address','billing_city', 'billing_state', 'billing_postalcode',
						 'payment_name', 'payment_number', 'payment_month', 'payment_year'];

	var actualCard;

	var Form = {
		field: function(id, title) {
            return ST.textField('[name='+fieldNames[id]+']');
        },
        fieldInput: function(num) {
            return ST.element('textfield[name='+fieldNames[num]+'] => input');  
        },
		button: function(text) {
            return ST.component('button[_text='+text+']');
        },
        card: function(title) {
            return ST.component('container[title='+title+']');
        },
        swipeCard: function(trigger) {
        	Form.button(trigger).click();
        },
        goToCard: function(number) {
        	var card;
        	ST.component('form-checkout container[title][_hidden=false]')
        		.and(function(c) {
        			card = c.title;
        			actualCard = containers.indexOf(card) +1;
        			if(actualCard > number) {
		        		for (var i = 0; i < actualCard - number; i++) {
					   		Form.swipeCard('Back');
					    }
					    ST.wait(function(){
		        			return Ext.ComponentQuery.query('form-checkout container[title]:visible')[1].title != card;
		        		});
		        	} else if (actualCard < number){
		        		for (var i = 0; i < number - actualCard; i++) {
					   		Form.swipeCard('Next');
					    }
					    ST.wait(function(){
		        			return Ext.ComponentQuery.query('form-checkout container[title]:visible')[1].title != card;
		        		});
		        	}
        		});
        	
        },
        clear: function(id, set) {
            set = false || set;
            if(set) {
                ST.wait(500);
	            Form.field(id)
	                .and(function(field) {
	                    field.reset();
	                });
            } else {
                Form.field(id)
                    .down('=> div.x-cleartrigger')
                    .click();    
            }
        },
        statePicker: function(id) {
            return ST.comboBox('[name='+fieldNames[id]+']');
        },
        editField: function(id, text, numberOnly) {
        	Form.field(id)
	            .focus()
	            .focused()
	            .type(text)
	            .and(function() {
	            	if(numberOnly){
	            		expect(this.future.cmp.getValue()).toBe(parseInt(text));
	            	} else {
	                	expect(this.future.cmp.getValue()).toBe(text);
	            	}
	            });
        },
        checkShip: function() {
        	ST.component('checkboxfield[reference=sameAsShipping]')
        		.down('=> input')
        		.click();
        },
        resetForm: function(idStart, idEnd) {
        	for (var i = idStart; i < idEnd; i++) {
        		if(i==15) {
        			Form.field(i)
    					.type('12');	
        		} else {
        			Form.field(i)
    					.type('asdf');	
        		}
    			
    		}
    		Form.button('Reset')
    			.click();
    		for(var i=idStart; i<idEnd; i++) {
                Form.fieldInput(i)
                    .and(function(field) {
                        expect(field.dom.value).toBe('');        
                    });
            }
        }

	};

    beforeAll(function() {
        Lib.beforeAll("#form-checkout", prefix);
        ST.component(prefix).visible();
    });
    
    afterAll(function(){
            ST.component('tooltip')
                .and(function() {
                    this.future.cmp.hide();
                });
        Lib.afterAll(prefix);
    });
    
    it('Example should load correctly', function() {
        Lib.screenshot('checkoutFormUI', 10);
    });

    xdescribe('Editable fields', function() {
        
        describe('Contact Information', function() {

            it('First Name ', function() {
        		Form.editField(0, 'text');
                Form.clear(0);
            });  
		    
		    it('Last Name ', function() {
        		Form.editField(1, 'text');
                Form.clear(1);
            });

	        it('Email', function() {
	            Form.editField(2, 'text')
	            Form.clear(2);
	        });

            it('Phone Number', function() {
        		Form.editField(3, 'text');
                Form.clear(3);
            });
        });

        describe('Shipping Address', function() {
        	beforeAll(function() {
        		Form.goToCard(2);
        	});

            it('Street Address ', function() {
        		Form.editField(4, 'text');
                Form.clear(4);
            });


            it('City', function() {
        		Form.editField(5, 'text');
                Form.clear(5);
            });

	        it('State', function() {
	            Form.editField(6, 'text');
	            Form.clear(6, true);
	        });

            it('Postal Code', function() {
        		Form.editField(7, 'text');
                Form.clear(7);
            });
        }); 

        describe('Billing Address', function() {
        	beforeAll(function() {
        		Form.goToCard(3);
        		Form.checkShip();
        	});

            it('Street Address ', function() {
        		Form.editField(8, 'text');
                Form.clear(8);
            });


            it('City', function() {
        		Form.editField(9, 'text');
                Form.clear(9);
            });

	        it('State', function() {
	            Form.editField(10, 'text');
	            Form.clear(10, true);
	        });

            it('Postal Code', function() {
        		Form.editField(11, 'text');
                Form.clear(11);
            });
        });

        describe('Payment Information', function() {
        	beforeAll(function() {
        		Form.goToCard(4);
        	});

            it('Name On Card', function() {
        		Form.editField(12, 'text');
                Form.clear(12);
            });


            it('Card Number', function() {
        		Form.editField(13, 'text');
                Form.clear(13);
            });

	        it('Month', function() {
	            Form.editField(14, 'text');
	            Form.clear(14, true);
	        });

            it('Year', function() {
        		Form.editField(15, '123', true);
                Form.clear(15);
            });
        });   
           
    });

    xdescribe('Fields validation', function() {
    	
    	describe('Required fields', function() {
    		beforeAll(function() {
    			Form.goToCard(4);
	            Form.button('Submit')
	            	.click();
	            ST.component('messagebox[_title=Invalid]')
	                .visible()
	                .down('button')
	                .click()
	                .hidden();    
	        });

	        var incM = 0;
		    	incT = 0;

	        describe('Contact Information', function() {
	        	beforeAll(function() {
	        		Form.goToCard(1);
        		});
		        
		        for(var i=0; i<2; i++){
		            it('Invalid mark of ' +fieldNames[i], function() {
		                Lib.Forms.validateError('textfield[name='+fieldNames[incM]+']', false, 'hovno', 'This field is required'); 
		                incM++; 
		            });
		        }        
		        
		        for(var i=0; i<2; i++){
		            it('tooltip is displayed on ' +fieldNames[i], function() {
		                Lib.Forms.tooltipError('textfield[name='+fieldNames[incT]+']', 'This field is required');
		                incT++;
		            });
		        }
		    });

		    describe('Shipping Address', function() {
	        	beforeAll(function() {
	        		Form.goToCard(2);
        		});

        		incM = 4;
		    	incT = 4;
		        
		        for(var i=4; i<8; i++){
		            it('Invalid mark of ' +fieldNames[i], function() {
		                Lib.Forms.validateError('textfield[name='+fieldNames[incM]+']', false, '', 'This field is required'); 
		                incM++; 
		            });
		        }        
		        
		        for(var i=4; i<8; i++){
		            it('tooltip is displayed on ' +fieldNames[i], function() {
		                Lib.Forms.tooltipError('textfield[name='+fieldNames[incT]+']', 'This field is required');
		                incT++;
		            });
		        }
		    });

		    describe('Billing Address', function() {
	        	beforeAll(function() {
	        		Form.goToCard(3);
	        		Form.checkShip();
        		});

        		incM = 8;
		    	incT = 8;
		        
		        for(var i=8; i<12; i++){
		            it('Invalid mark of ' +fieldNames[i], function() {
		                Lib.Forms.validateError('textfield[name='+fieldNames[incM]+']', false, '', 'This field is required'); 
		                incM++; 
		            });
		        }        
		        
		        for(var i=8; i<12; i++){
		            it('tooltip is displayed on ' +fieldNames[i], function() {
		                Lib.Forms.tooltipError('textfield[name='+fieldNames[incT]+']', 'This field is required');
		                incT++;
		            });
		        }
		    });

		    describe('Payment Information', function() {
	        	beforeAll(function() {
	        		Form.goToCard(4);
        		});

        		incM = 12;
		    	incT = 12;
		        
		        for(var i=12; i<16; i++){
		            it('Invalid mark of ' +fieldNames[i], function() {
		                Lib.Forms.validateError('textfield[name='+fieldNames[incM]+']', false, '', 'This field is required'); 
		                incM++; 
		            });
		        }        
		        
		        for(var i=12; i<16; i++){
		            it('tooltip is displayed on ' +fieldNames[i], function() {
		                Lib.Forms.tooltipError('textfield[name='+fieldNames[incT]+']', 'This field is required');
		                incT++;
		            });
		        }
		    });
    	});

    	describe('Field validators', function() {

    		it('Email validator', function() {
    			Form.goToCard(1);
    			Lib.Forms.validateError('textfield[name='+fieldNames[2]+']', false, 'wrong', 'Is not a valid email address'); 
    			Lib.Forms.tooltipError('textfield[name='+fieldNames[2]+']', 'Is not a valid email address');
    			Form.clear(2);
    		});

    		it('Phone validator', function() {
    			Form.goToCard(1);
    			Lib.Forms.validateError('textfield[name='+fieldNames[3]+']', false, '45', 'Is not a valid phone number'); 
    			Lib.Forms.tooltipError('textfield[name='+fieldNames[3]+']', 'Is not a valid phone number');
    			Form.clear(3);
    		});

    		it('Postal regex validator', function() {
    			Form.goToCard(2);
    			Lib.Forms.validateError('textfield[name='+fieldNames[7]+']', false, '23', 'Is in the wrong format'); 
    			Lib.Forms.tooltipError('textfield[name='+fieldNames[7]+']', 'Is in the wrong format');
    			Form.clear(7);
    		});	        
		});

		describe('Field minimun', function() {

			it('Year minimum', function() {
				Form.goToCard(4);
				var date = new Date();
				Lib.Forms.validateError('textfield[name='+fieldNames[15]+']', false,  (date.getFullYear()-1).toString(), 'The minimum value for this field is '+date.getFullYear()); 
    			Lib.Forms.tooltipError('textfield[name='+fieldNames[15]+']', 'The minimum value for this field is '+date.getFullYear());
    			Form.clear(15);
			});
		});		      
    });

    xdescribe('Card navigation', function() {

    	it('Navigation via buttons', function() {

    		for (var i = 0; i < containers.length; i++) {
    			Form.card(containers[i]).visible();
		   		if(i!=3){
		   			Form.swipeCard('Next');	
		    	}
		    			
		    }

		    for (var i = 3; i >= 0; i--) {
		    	Form.card(containers[i]).visible();
		    	if(i!=0){
		    		Form.swipeCard('Back');	
		    	}
		    }

    	});

    	it('Navigation via indicator', function() {
    		
    		for (var i = 0; i < containers.length; i++) {
    			Form.card(containers[i]).visible();
		   		if(i!=3){
		   			ST.element("//span[contains(@class,'indicator-item')][last()]")
		   				.click();	
		    	}
		    			
		    }

		    for (var i = 3; i >= 0; i--) {
		    	Form.card(containers[i]).visible();
		    	if(i!=0){
		    		ST.element("//span[contains(@class,'indicator-item')][1]")
		    			.click();
		    	}
		    }

    	});
           
    });

    describe('ComboBox selection', function() {

    	describe('State comboBox', function() {

    		it('Shipping state', function() {
    			Form.goToCard(2);
    			Lib.Forms.testCombobox('textfield[name='+fieldNames[6]+']', 'state', 'Alabama', 'AL');
    		});

    		it('Billing state', function() {
    			Form.goToCard(3);
    			Form.checkShip();
    			Lib.Forms.testCombobox('textfield[name='+fieldNames[10]+']', 'state', 'Alabama', 'AL');
    		});
    	});

    	it('Month comboBox', function() {
    		Form.goToCard(4);
    		Lib.Forms.testCombobox('textfield[name='+fieldNames[14]+']', 'name', 'April', 4);
    	});
           
    });

    describe('Segmented button selection', function() {

    	beforeAll(function() {
    		Form.goToCard(4);
    	});

    	it("Toggle card button", function() {   		
    		ST.component(prefix + ' segmentedbutton')
    			.visible();

    		var cards = ['Visa', 'MasterCard', 'AMEX', 'Discover']	
    		for(var i=0; i<4; i++) {
    			Form.button(cards[i])
    				.click()
    				.and(function(btn){
    					expect(btn._pressed).toBe(true);
    				})
    		}
    	});
           
    });

    describe('Reset', function() {

    	xit('Contact Information', function() {
    		Form.resetForm(0, 4);
    	});

    	it('Shipping Address', function() {
    		Form.goToCard(2);
    		Form.resetForm(4, 8);
    	});

    	it('Billing Address', function() {
    		Form.goToCard(3);
    		Form.checkShip();
    		Form.resetForm(8, 12);
    	});

    	it('Payment Information', function() {
    		Form.goToCard(4);
    		Form.resetForm(12, 16);
    	});
           
    });

    describe('Confirm form', function() {

    	it('Submit invalid', function() {
    		Form.goToCard(4);
    		Form.button('Submit')
    			.click();
    		ST.component('messagebox[_title=Invalid]')
                .visible()
                .down('button')
                .click()
                .hidden(); 
    	});
           
    	it('Submit valid', function() {
    		Form.goToCard(1);
    		for(var i=0; i<2; i++) {
    			Form.field(i)
    				.setValue('text');
    		}

    		Form.goToCard(2);
    		for(var i=4; i<6; i++) {
    			Form.field(i)
    				.setValue('text');
    		}
    		Lib.Picker.clickToShowPicker('textfield[name='+fieldNames[6]+']');
            Lib.Picker.selectValueInPickerSlot('textfield[name='+fieldNames[6]+']', 'Alabama', 'state');
    		Form.field(7)
    			.setValue('12345')
    			.and(function() {
    				Form.goToCard(4);
    			});

    		for(var i=12; i<14; i++) {
    			Form.field(i)
    				.setValue('text');
    		}
    		Lib.Picker.clickToShowPicker('textfield[name='+fieldNames[14]+']');
            Lib.Picker.selectValueInPickerSlot('textfield[name='+fieldNames[14]+']', 'October', 'name');
    		Form.field(15)
    			.setValue('2017');
    		
    		Form.button('Submit')
    			.click();
    		ST.component('messagebox[_title=Success!]')
                .visible()
                .down('button')
                .click()
                .hidden(); 
    	});
    });

    it("should open source window when clicked", function() {
        Lib.sourceClick("form-checkout");
    });
});