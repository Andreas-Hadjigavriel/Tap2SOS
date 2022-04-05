/*
  * @package Cyprass
  * @subpackage Cyprass HTML
  * 
  * Template Scripts
  * Created by Themeturn
  
  1. Fixed header
  2. Site search
  3. Main slideshow
  4. Owl Carousel
      a. Testimonial
      b. Clients
      c. Team
  5. Back to top
  6. Skills
  7. BX slider
      a. Blog Slider
      b. Portfolio item slider
  8. Isotope
  9. Animation (wow)
  10. Flickr
  
*/


jQuery(function($) {
  "use strict";

  $.noConflict();
     $('.nav a').on('click', function(){ 
        if($('.navbar-toggle').css('display') !='none'){
            $(".navbar-toggle").trigger( "click" );
        }
    });

  
//  Navigation scrolling

      $('a.page-scroll').click(function() {
          if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
              $('html,body').animate({
                scrollTop: target.offset().top - 40
              }, 900);
              return false;
            }
          }
        });

  // accordian
  $('.accordion-toggle').on('click', function(){
    $(this).closest('.panel-group').children().each(function(){
    $(this).find('>.panel-heading').removeClass('active');
     });

    $(this).closest('.panel-heading').toggleClass('active');
  });

 
 /* ----------------------------------------------------------- */
/*  BX slider
/* ----------------------------------------------------------- */

      //Portfolio item and blog slider
    
/*Smooth Scroll*/
      smoothScroll.init({
          speed: 400,
          easing: 'easeInQuad',
          offset:0,
          updateURL: true,
          callbackBefore: function ( toggle, anchor ) {},
          callbackAfter: function ( toggle, anchor ) {}
        }); 


  /* ----------------------------------------------------------- */
  /*  Main slideshow
  /* ----------------------------------------------------------- */

  $('#slider_part').carousel({
    pause: true,
    interval: false,
  }); 
/* ==============================================
Back To Top Button
=============================================== */  
 
  $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });
      // scroll body to 0px on click
      $('#back-top').click(function () {
          $('#back-top a').tooltip('hide');
          $('body,html').animate({
              scrollTop: 0
          }, 800);
          return false;
      });
      
      $('#back-top').tooltip('hide');


    $(window).resize(function(){
      if(window.innerWidth < 3600) {
        $('#corn-video').remove();
      }
      else {
        $('#corn-container').prepend('<div class="mobilefix" id="corn-video"><video autoplay loop muted class="video-background" poster="images/bg/corn.jpg"><source src="videos/cornfield_close_up.mp4" type="video/mp4"><source src="videos/cornfield_close_up.webm" type="video/webm"></video></div>');
      }
    });

    if(window.innerWidth < 1600) {
      $('#corn-video').remove();
    }

    $('#sheep').elevateZoom({zoomWindowPosition: 10});
});
