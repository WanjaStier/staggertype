StaggerType.js
=========
Displays animated text by showing character by character. Can also display a string of random characters to create an old airport/train station display effect

### Usage:
StaggerType can be applied to any HTML element containing text
example HTML markup:
```html
<div class="container">
    <p class="el">Lorem ipsum dolor sit amet.</p>
</div>
```

```javascript
var options = {
  fps:60,
  autoStart: true,
  duration:1.5,
  scrambleText:true,
  ease: 'easeOutSine'
};
var element = document.querySelector('.el');
var staggerType = new StaggerType( element, options );
    staggerType.subscribe( staggerType.Events.FADE_IN_COMPLETE, function() {
                      console.log( 'done showing')
                  } )
```
##Options


| Option        | Type           | Default  | Description
| ------------- |:-------------:| -----:| -------------
| autoStart      | Boolean | true | Wether or not to automatically start animating on instantiation
| fps     | Number      |   60 | frames per second. Lower numbers will cause the animation to play less smoothly
| scrambleText | Boolean     |    true | Show airport display style random letter effect
| characters | string | ABCDEFGHIJK LMNOPQRSTUVWX YZabcdefgh ijklmnop qrstuvwxyz0123456789 | string of characters to be used for random letter effect
| ease | string | easeOutQuart | easing function to be applied to the animation

##Methods
###show()
Starts the animation if ```autoStart:false```
###pause()
Pauses the animation
###resume()
resumes the animation if paused.
###subscribe( type (string), handler (function) )
adds an event listener to staggertype
###unsubscribe( type (string), handler (function) )

##Events
###StaggerType::fadeInComplete
dispatched when the animation has finished playing

##Easing
Use one of the easing methods below. A demo of each easing type can be found [here](http://www.robertpenner.com/easing/easing_demo.html)

#####linearEase
#####easeInQuad
#####easeOutQuad
#####easeInOutQuad
#####easeInCubic
#####easeOutCubic
#####easeInOutCubic
#####easeInQuart
#####easeOutQuart
#####easeInOutQuart
#####easeInQuint
#####easeOutQuint
#####easeInOutQuint
#####easeInSine
#####easeOutSine
#####easeInOutSine
#####easeInExpo
#####easeOutExpo
#####easeInOutExpo
#####easeInCirc
#####easeOutCirc
#####easeInOutCirc
