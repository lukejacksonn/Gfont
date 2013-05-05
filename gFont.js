(function () {

  var webfontsKey = "AIzaSyBdWeFmH2202_rMojnrTq4x2Dw2JvS4ihc";
  var webfontsURL = "https://www.googleapis.com/webfonts/v1/webfonts?key=" + webfontsKey + "&callback=?";
  var loadedFonts = {};
  var getFonts = $.getJSON(webfontsURL).pipe(function(result) {
    return result.items;
  });

  jQuery(function ($) {
    
    var $head = $('head');
    jQuery.fn.gFont = function (typeface) {
      
      var $elems = this;
      var status = $.Deferred();
      getFonts.fail(function () { console.log('Failed to getFonts'); });
      getFonts.done(function (fontList) {

        //Set font-family equal to desired font or default to random font
        var f = typeface || fontList[Math.floor(Math.random() * fontList.length)].family;
        var fontClass = f.replace(/\s/g, '-');
        $elems.css('font-family', f);

        //If font hasn't been loaded
        if (!(f in loadedFonts)) {
          //Hide self and add awaiting class
          $elems.css('opacity', '0').addClass("awaiting-" + fontClass);
          //Append GoogleFont link to document head
          $('<link>').prop({
            href: 'https://fonts.googleapis.com/css?family=' + f.replace(/\s/g, '+'),
            rel: 'stylesheet',
            type: 'text/css'
          }).on('load', function () {
            //Not that we have loaded the script
            loadedFonts[f] = true;
            //Reveal self and remove awaiting class
            setTimeout(function () {
              $elems.animate({'opacity':'1'},100).removeClass("awaiting-" + fontClass);
              status.resolve();
            }, 100);
          }).appendTo($head);

        } else status.resolve();
      });

      return status.promise();
    };
  });
})();
