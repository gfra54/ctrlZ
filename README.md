# CtrlZ jQuery plugin
## Presentation

With this plugins, you can use ctrl+z and ctrl+y on your textareas, even when 
they are modified by external plugins or javascript routines.

It works with **jQuery 1.8.x** and upper.


File jquery.ctrlZ.debug.js is used to debug the undo buffer navigation.
You don't need it !


## How to install ?

Upload jquery.crtlZ.js to your server, in any directory. Let's choose /js/, because we are being so silly.
Of course, you need jQuery 1.8 or up for this to work. Because, you know, it is jQuery plugin.

Then, simply link to the js file in your HTML and the activate crtlZ by calling the ctrlZ method :

```
<script src="js/jquery.min.js" language="javascript"></script>
<script src="js/jquery.ctrlZ.js" language="javascript"></script>

<script type="text/javascript">
jQuery(document).ready(function () {

	$("textarea").ctrlZ();

});
</script>

```

## Bugs and errors

This is still a bit early so feel free to contact me if you detect something wrong.


Author : Gilles FRANCOIS / gilles@sofoot.com

http://betterinternets.com

