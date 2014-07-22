/*!
 * StaggerType.js
 * Copyright © 2014 Wanja Stier
 *
 * https://github.com/WanjaStier/staggertype
 *
 * Released under the terms of the MIT license: http://wanja.mit-license.org/
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

    function enterFrame() {

        setTimeout(function() {

            update();
            render();

            if( progress >= 1 ) {

                window.cancelAnimationFrame( animationFrame );

                p.dispatchEvent( p.Events.FADE_IN_COMPLETE );

            } else {

                animationFrame = window.requestAnimationFrame( enterFrame );
            }
        }, 1000 / p.options.fps);

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
            p.el.innerHTML = chars.substr(0, Math.ceil(index));
        }
    }


    function init( options ) {

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
            pause();
            observers = [];
            animationFrame = null;
        },

        pause: function() {
            if( animationFrame ) {
                window.cancelAnimationFrame( animationFrame );
            }
        },

        resume: function() {
            animationFrame = window.requestAnimationFrame( enterFrame );
        },


        on: function(type, observer) {
            observers[type] || (observers[type] = []);
            observers[type].push(observer);
        },

        off: function(type, observer) {
            if (!observers[type]){
                return;
            }

            var index = observers[type].indexOf(observer);

            if (~index) {
                observers[type].splice(index, 1);
            }
        },

        dispatchEvent: function(type, message) {
            if (!observers[type]){
                return;
            }

            for (var i = observers[type].length - 1; i >= 0; i--) {
                observers[type][i](message);
            }
        }
    };

    return StaggerType;

})();
/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

StaggerType.Easing = (function(){

    'use strict';

    return {

        linearEase : function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * currentIteration / totalIterations + startValue;
        },

        easeInQuad: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
        },

        easeOutQuad: function(currentIteration, startValue, changeInValue, totalIterations) {
            return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
        },

        easeInOutQuad: function(currentIteration, startValue, changeInValue, totalIterations) {
            if ((currentIteration /= totalIterations / 2) < 1) {
                return changeInValue / 2 * currentIteration * currentIteration + startValue;
            }
            return -changeInValue / 2 * ((--currentIteration) * (currentIteration - 2) - 1) + startValue;
        },

        easeInCubic: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
        },


        easeOutCubic: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
        },

        easeInOutCubic: function(currentIteration, startValue, changeInValue, totalIterations) {
            if ((currentIteration /= totalIterations / 2) < 1) {
                return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
            }
            return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
        },

        easeInQuart: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * Math.pow (currentIteration / totalIterations, 4) + startValue;
        },

        easeOutQuart: function(currentIteration, startValue, changeInValue, totalIterations) {
            return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
        },

        easeInOutQuart: function(currentIteration, startValue, changeInValue, totalIterations) {
            if ((currentIteration /= totalIterations / 2) < 1) {
                return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
            }
            return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
        },

        easeInQuint: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * Math.pow (currentIteration / totalIterations, 5) + startValue;
        },


        easeOutQuint: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
        },

        easeInOutQuint: function(currentIteration, startValue, changeInValue, totalIterations) {
            if ((currentIteration /= totalIterations / 2) < 1) {
                return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
            }
            return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
        },


        easeInSine: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
        },

        easeOutSine: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
        },


        easeInOutSine: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
        },

        easeInExpo: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
        },

        easeOutExpo: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
        },

        easeInOutExpo: function(currentIteration, startValue, changeInValue, totalIterations) {
            if ((currentIteration /= totalIterations / 2) < 1) {
                return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
            }
            return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
        },

        easeInCirc: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
        },

        easeOutCirc: function(currentIteration, startValue, changeInValue, totalIterations) {
            return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
        },

        easeInOutCirc: function(currentIteration, startValue, changeInValue, totalIterations) {
            if ((currentIteration /= totalIterations / 2) < 1) {
                return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
            }
            return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
        }
    };

})();


/**
 * http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 *
 * request animation frame polyfill
 */
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());