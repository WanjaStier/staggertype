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

            update(time);
            render();

            if( index >= chars.length ) {

                window.cancelAnimationFrame( animationFrame );

            } else {

                animationFrame = window.requestAnimationFrame( enterFrame );
            }
        }, 1000 / p.options.fps)

    }

    function update(time) {


        now = getNow();
        delta = now - then;


        var speed = 5 * 60 * delta / 1000;

        index = (index - chars.length) /17;

        then = now;

    }

    function render() {

        var ch = chars.substring( 0, index);

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


    function getNow() {
        return window.performance.now ? window.performance.now : Date.now();
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