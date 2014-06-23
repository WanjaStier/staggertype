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

    var now;

    var then = 0;

    var index = 0;

    var animationFrame;

    var observers = [];

    var result;


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

            update(time);


            if( index >= chars.length ) {

                window.cancelAnimationFrame( animationFrame );

            } else {

                animationFrame = window.requestAnimationFrame( enterFrame );
            }
        }, 1000 / p.options.fps)

    }

    function update(time) {


        var timePassed = getNow() - startTime;

        var progress = timePassed / p.options.duration;

        if (progress > 1) {
            progress = 1
        }

        var delta = bounceEaseOut(progress)

        render( delta );

    }

    function render( delta ) {

        result = (chars.length-0) * delta;

        p.el.innerHTML = chars.substr(0, Math.ceil(result))

    }

    function bounce(progress) {
        for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
            if (progress >= (7 - 4 * a) / 11) {
                return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
            }
        }
    }


    function makeEaseOut(delta) {
        return function(progress) {
            return 1 - delta(1 - progress)
        }
    }

    var bounceEaseOut = makeEaseOut(bounce)



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


    function getNow() {
        return window.performance.now ? window.performance.now() : Date.now();
    }



    var p = StaggerType.prototype = {

        constructor: StaggerType,

        el: null,

        options: {

            timeBased           : true,
            autoStart           : true,
            fps                 : 60,
            duration            : 5000,
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
            startTime = getNow();

            enterFrame(0);
        },

        hide: function() {

        },

        dispose: function() {

        },

        /**
         * http://bumbu.ru/javascript-observer-publish-subscribe-pattern/
         * @param type
         * @param observer
         */
        subscribe: function(type, observer) {
            observers[type] || (observers[topic] = []);
            observers[type].push(observer);
        },

        unsubscribe: function(type, observer) {
            if (!observers[type])
                return;

            var index = observers[type].indexOf(observer);

            if (~index) {
                observers[type].splice(index, 1);
            }
        },

        emit: function(type, message) {
            if (!this.observers[type])
                return;

            for (var i = this.observers[topic].length - 1; i >= 0; i--) {
                this.observers[type][i](message)
            };
        }
    }

    return StaggerType;

})();