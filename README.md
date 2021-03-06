StaggerType.js
=========
Displays animated text by sequentially showing characters with easing methods. Can also display a string of random characters to create an old airport/train station display effect

### Download

[Minified](https://github.com/WanjaStier/staggertype/raw/master/dist/staggertype.min.js) (~2kb gzipped)

### Usage:
StaggerType can be applied to any HTML element containing text

example HTML markup:
```html
<div class="container">
    <p class="el">Lorem ipsum dolor sit amet.</p>
</div>
```

```javascript

var element = document.querySelector('.el');

// instantiate a StaggerType instance, passing the text element and overriding some default options.
// see below for a list of all possible options
var staggerType = new StaggerType( element, {duration:1.5, ease: 'easeOutSine'} );
    staggerType.subscribe( staggerType.Events.FADE_IN_COMPLETE, onAnimationComplete)
    
var onAnimationComplete = function() {
    //do stuff
}
```
##Options


| Option        | Type           | Default  | Description
| ------------- |-------------| -----| -------------
| autoStart      | Boolean | true | Wether or not to automatically start animating on instantiation
| fps     | Number      |   60 | frames per second. Lower numbers will cause the animation to play less smoothly
| scrambleText | Boolean     |    true | Show airport display style random letter effect
| characters | string | ABCDEFGHIJK LMNOPQRSTUVWX YZabcdefgh ijklmnop qrstuvwxyz0123456789 | string of characters to be used for random letter effect
| ease | string | easeOutQuart | easing function to be applied to the animation
| duration | Number | 1 |  the total duration of the text animation
##Methods
###show()
Starts the animation if ```autoStart:false```
###pause()
Pauses the animation
###resume()
resumes the animation if paused.
###on( type (string), handler (function) )
adds an event listener to staggertype
###off( type (string), handler (function) )

##Events
###StaggerType::fadeInComplete
dispatched when the animation has finished playing

##Easing
Use one of the easing methods below. A demo of each easing type can be found [here](http://www.robertpenner.com/easing/easing_demo.html)

* linearEase
* easeInQuad
* easeOutQuad
* easeInOutQuad
* easeInCubic
* easeOutCubic
* easeInOutCubic
* easeInQuart
* easeOutQuart
* easeInOutQuart
* easeInQuint
* easeOutQuint
* easeInOutQuint
* easeInSine
* easeOutSine
* easeInOutSine
* easeInExpo
* easeOutExpo
* easeInOutExpo
* easeInCirc
* easeOutCirc
* easeInOutCirc
