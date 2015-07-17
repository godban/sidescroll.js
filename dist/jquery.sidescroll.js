/*! sidescroll by Bogdan Plieshka, 18-07-2015 */

;
(function ($, window) {
    'use strict';

    function SideScroll(el, options) {

        this.options = $.extend({}, {
            contentClass: '.content',
            fixedClassName: 'is-fixed'
        }, options);

        var that = this,
            sidebar = $(el),
            win = $(window),
            fixedClassName = that.options.fixedClassName,
            winHeight = 0,
            winTop = 0,
            winTopLast = 0,
            nextTop = 0,
            contentHeight = 0,
            sidebarHeightRest = 0,
            scrollStep = 0;

        function addFixed(el) {
            if (!el.hasClass(fixedClassName)) el.addClass(fixedClassName);
        }

        function removeFixed(el) {
            if (el.hasClass(fixedClassName)) el.removeClass(fixedClassName);
        }

        this.positionSidebar = function () {

            var content = $(that.options.contentClass),
                sidebarHeight = sidebar.height();

            //  Spot positions and heights
            winHeight = win.height();
            contentHeight = content.height();
            winTop = win.scrollTop();
            scrollStep = winTop - winTopLast; // scroll step
            sidebarHeightRest = sidebarHeight - winTop; // visible sidebar height

            function isSidebarFixed() {
                return (sidebarHeight < contentHeight) && (contentHeight > winHeight);
            }

            // Fixed sidebar cases
            if (isSidebarFixed()) {

                addFixed(sidebar);

                //  Smart scroll cases
                if (sidebarHeight > winHeight) {

                    //  Scroll down
                    if (winTop > winTopLast) {

                        var sidebarScrollMax = sidebarHeight - winHeight;

                        if (nextTop < (sidebarScrollMax - scrollStep)) {
                            nextTop += scrollStep;
                        } else {
                            nextTop = sidebarScrollMax;
                        }

                        sidebar.css('top', -nextTop);

                    } else if (winTop < winTopLast) { //  Scroll up

                        if (nextTop > -scrollStep) {
                            nextTop += scrollStep;
                        } else {
                            nextTop = 0;
                        }
                        sidebar.css('top', -nextTop);
                    }
                }
            } else { //  Static sidebar cases
                removeFixed(sidebar);
            }
            winTopLast = winTop; //  Save previous window scrollTop
        };

        this.positionOnResize = function () {
            var sidebarHeight = sidebar.height();

            winHeight = win.height();
            //  Reset position if fixed and out of smart scroll
            if ((sidebarHeight < contentHeight) && (sidebarHeight <= winHeight)) {
                sidebar.removeAttr('style');
            }
        };

        this.clearPosition = function () {
            sidebar.removeAttr('style');
            removeFixed(sidebar);
        };

        this.start(sidebar);
    }

    SideScroll.prototype = {
        start: function () {
            this.positionSidebar();
            $(window).on({
                'scroll': this.positionSidebar,
                'resize': this.positionOnResize
            });
        },
        stop: function () {
            $(window).off({
                'scroll': this.positionSidebar,
                'resize': this.positionOnResize
            });
        },
        clear: function () {
            this.stop();
            this.clearPosition();
        }
    };

    $.fn['sideScroll'] = function (options) {
        var name = 'sideScroll';
        return this.each(function () {
            if (!$.data(this, name)) {
                $.data(this, name, new SideScroll(this, options));
            }
            else if ($.isFunction(SideScroll.prototype[options])) {
                $.data(this, name)[options]();
            }
        });
    }

})(jQuery, window);
