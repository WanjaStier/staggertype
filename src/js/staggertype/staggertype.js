/**
 * MC StaggerType in da house!
 *
 * @author wanja.stier
 *
 */
var StaggerType = (function() {

    'use strict';

    //constructor
    function StaggerType( el, options ) {

        p.el = el;

        init.call(this, options );
    }


    /**
     * array of characters to render
     */
    var chars;

    var startTime = null;

    var delta = null;

    var then = null;

    var index = 0;

    var animationFrame;

    var observers = [];


    /**
     * override default options with user defined options
     *
     * @param opts {object}
     */
    function overrideOptions( opts ) {
        for (var key in opts) {
            if (opts.hasOwnProperty( key )) {
                p.options[ key ] = opts[ key ];
            }
        }
    }

    function enterFrame( time ) {

        setTimeout(function() {

            update();
            render();

            if( index >= chars.length ) {

                window.cancelAnimationFrame( animationFrame );

            } else {

                animationFrame = window.requestAnimationFrame( enterFrame );
            }
        }, 1000 / p.options.fps)

    }

    function update() {

        index+=10;
    }

    function render() {

        var ch = chars.substring( index, 10);

        var node = document.createTextNode( ch );

        p.el.appendChild( node );
    }


    function init( options ) {

        console.log( this.el );
        console.log( this.options );

        chars = this.el.innerHTML;

        this.el.removeChild( this.el.firstChild );

        this.el.style.visibility = "visible";

        overrideOptions( options );


        if( p.options.autoStart ) {
            p.show();
        }

    }



    var p = StaggerType.prototype = {

        constructor: StaggerType,

        el: null,

        options: {

            timeBased           : true,
            autoStart           : true,
            fps                 : 60,
            duration            : 2000,
            leadCharacter       : '|',
            uppercase           : false,
            characters          : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?'
        },

        Events: {
            FADE_IN_COMPLETE : 'StaggerType::fadeInComplete',
            FADE_OUT_COMPLETE: 'StaggerType::fadeOutComplete'
        },

        show: function() {

            //record start time
            if (window.performance.now) {
                startTime = window.performance.now();
            } else {
                startTime = Date.now();
            }
            enterFrame(0);
        },

        on: function(topic, observer) {
            observers[topic] || (observers[topic] = []);
            observers[topic].push(observer);
        },

        off: function(topic, observer) {
            if (!observers[topic])
                return;

            var index = observers[topic].indexOf(observer);

            if (~index) {
                observers[topic].splice(index, 1);
            }
        },

        emit: function(topic, message) {
            if (!this.observers[topic])
                return;

            for (var i = this.observers[topic].length - 1; i >= 0; i--) {
                this.observers[topic][i](message)
            };
        }
    }

    return StaggerType;

})();