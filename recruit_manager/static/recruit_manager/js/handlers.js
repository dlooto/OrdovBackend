$(document).ready(function () {
    // All sides
    var sides = ["left", "top", "right", "bottom"];
    $("h1 span.version").text($.fn.sidebar.version);
    var toCollapsed = true;

    // Initialize sidebar2s
    for (var i = 0; i < sides.length; ++i) {
        var cSide = sides[i];
        //console.log(cSide)
        //console.log(".sidebar2."+cSide)
        $(".sidebar2." + cSide).sidebar({side: cSide});
    }

    // Click handlers
    $(".btn[data-action]").on("click", function () {
        var $this = $(this);
        var action = $this.attr("data-action");
        var side = $this.attr("data-side");
        /*
        console.log("button data-action: ")
        console.log(".sidebar2."+side)
        console.log("sidebar2:"+action)
        console.log("coCollapsed: ", toCollapsed)
        */
        if (toCollapsed) {
            toCollapsed = false;
            $(".sidebar2." + side).trigger("sidebar:" + "open");
        } else {
            toCollapsed = true;
            $(".sidebar2." + side).trigger("sidebar:" + "close");
        }
    });
});
