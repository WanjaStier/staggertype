/**
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

    var easingFunction;

    var iteration = 0;

    var progress;

    var totalIterations;

    var index = 0;

    var str1 = '';

    var str2 = '';

    var str3 = '';

    var currentText = '';

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

            if( progress >= 1 ) {

                window.cancelAnimationFrame( animationFrame );

                console.log( 'done')

            } else {

                animationFrame = window.requestAnimationFrame( enterFrame );
            }
        }, 1000 / p.options.fps)

    }

    function update() {

        progress = iteration / totalIterations;

        index = easingFunction( iteration, 0, chars.length, totalIterations );

        iteration++;

        if(p.options.scrambleText) {
            str1 = "";
            str2 = chars.substr(0, index);
            str3 = chars.substr(index);

            var len = str3.length;
            var i = 0;
            for ( ; i < len; i++) {
                str1 += p.options.characters.substr( Math.floor( Math.random()*p.options.characters.length ),1 );
            }

            currentText = str2 + str1;
        }

    }

    function render() {

        if ( p.options.scrambleText ){
            p.el.innerHTML = currentText;

        } else {
            p.el.innerHTML = chars.substr(0, Math.ceil(index))
        }
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
            duration            : 1,
            ease                : 'easeOutQuart',
            leadCharacter       : '|',
            uppercase           : false,
            scrambleText        : true,
            characters          : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?'
        },

        Events: {
            FADE_IN_COMPLETE : 'StaggerType::fadeInComplete',
            FADE_OUT_COMPLETE: 'StaggerType::fadeOutComplete'
        },

        show: function() {

            //record start time
            startTime = getNow();

            easingFunction = StaggerType.Easing[ p.options.ease ];

            totalIterations = p.options.duration * p.options.fps;

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