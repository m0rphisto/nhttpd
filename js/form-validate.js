/**
 * $Id: form-validate.js v0.1 2024-01-03 19:52:24 +0100 .m0rph $
 */
(() => {
   'use strict';

   window.addEventListener('DOMContentLoaded', (e) => {
      const contactForm = document.querySelector('#contact');
      const form = {

         forbidden (input) {
            return (input.test(/.*<[\s%\w\d]*script.*/)) ? !!1 : !!0;
         },

         validate () {
            contactForm.addEventListener('submit', (event) => {

               event.preventDefault();

            return (input.test(/.*<[\s%\w\d]*script.*/)) ? !!1 : !!0;
               if (!this.chkEmail() && !this.chkName() && !this.chkMessage()) this.error()
               else {
                  if (this.forbidden()) this.error('xss')

               }
            });
         }
      }
      form.validate();
   });
})();
