;(function($) {

    $.ctrlZ = function(element, options) {

        var defaults = {

            undo: true,
            redo: true,
			interval:0.1, // seconds

        }
	
        var plugin = this;
		
		var _debug = false; /* todo */
		
		plugin.qty = 0;
		plugin.undo_buffer = {};
		plugin.infos = {};
        plugin.settings = {}

        var $element = $(element), 
             element = element;    

        plugin.init = function() {

            plugin.settings = $.extend({}, defaults, options);


			$element.each(function(){
				plugin.qty++;
				var _id = false;
				if(!(_id = $(this).attr('id'))) {
					_id = 'ctrlZ_'+plugin.qty;
					$(this).attr('id',_id);
				}
				/** 
					This is the undo buffer, it works like a stack inside wich 
					we will travel by pressing ctrl+z or ctrl+y 
				*/
				plugin.undo_buffer[_id]=new Array();

				/* This is an array of informations about each textareas 
				implementing ctrlZ */
				plugin.infos[_id]={scan:true,ctrl:false,rang:0,prec:''};

			}).keyup(function(e){
				var _id = $(this).attr('id');
				var _key = getKey(e)
				if(_key == 17){
					plugin.infos[_id].ctrl=false;
				}
			}).keydown(function(e){
				var _id = $(this).attr('id');
				var _key = getKey(e)
				/** Ctrl is pressed, and that's a good start **/
				if(_key == 17){
					plugin.infos[_id].ctrl=true;
				} 
				/** We pressed ctrl+y to redo **/
				if(_key == 89 && plugin.infos[_id].ctrl){
					e.preventDefault();
					if(plugin.infos[_id].rang<plugin.undo_buffer[_id].length-1) {
						try {
							plugin.infos[_id].scan=false;
							plugin.infos[_id].rang++;
							plugin.infos[_id].prec_val = plugin.undo_buffer[_id][plugin.infos[_id].rang];
							$(this).val(plugin.infos[_id].prec_val);
						}catch (Everything){}
					}
				}
				/** We pressed ctrl+z to undo **/
				if(_key == 90 && plugin.infos[_id].ctrl){
					e.preventDefault();
					if(plugin.infos[_id].rang>0) {
						try {
							plugin.infos[_id].scan=false;
							plugin.infos[_id].rang--;
							plugin.infos[_id].prec_val = plugin.undo_buffer[_id][plugin.infos[_id].rang];
							$(this).val(plugin.infos[_id].prec_val);
						
						}catch (Everything){}
					}
				}
			});

			daemon();
        }
		
		var getKey = function(e) {
			return e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
		}

        var daemon = function() {
			setInterval(function(){
				for (var _tmp_id in plugin.undo_buffer) {
				  if (plugin.undo_buffer.hasOwnProperty(_tmp_id)) {
					 var _val = $('#'+_tmp_id).val();
					 if(plugin.infos[_tmp_id].scan) {
						if(plugin.infos[_tmp_id].prec_val!=_val) {
							plugin.infos[_tmp_id].rang++;
							plugin.undo_buffer[_tmp_id][plugin.infos[_tmp_id].rang] = _val;
							plugin.infos[_tmp_id].prec_val = _val;
						}
					 } else {
						if(plugin.infos[_tmp_id].prec_val!=_val) {
							plugin.infos[_tmp_id].scan=true;
						}
					 }
				  }
				}
				debug();
			},plugin.settings.interval*1000);

        }

		var debug = function(){
			if(!_debug) {
				$('<pre id="debug" style="padding:10px;color:white;position:fixed;top:0;right:0;background:black;"></pre>').appendTo('body');
				_debug = $('#debug');
			}
			setInterval(function(){

				_debug.text(function(){
					var _out = '';
					for (var _tmp_id in plugin.undo_buffer) {
					  if (plugin.undo_buffer.hasOwnProperty(_tmp_id)) {
						var _elt = plugin.undo_buffer[_tmp_id]
						for (var _v in _elt) {
						  if (_elt.hasOwnProperty(_v)) {
								_out+="\n- - - - - - - - - - - - \n"+_v+(plugin.infos[_tmp_id].rang == _v ? '*' : ' ')+': '+(_elt[_v] ? _elt[_v] : 'vide');
						  }
						}
					  }
					}
					return plugin.infos[_tmp_id].rang+''+_out+'';
				});
			},100);
			
		}
        plugin.init();

    }

    $.fn.ctrlZ = function(options) {

        return this.each(function() {

            if (undefined == $(this).data('ctrlZ')) {


                var plugin = new $.ctrlZ(this, options);

                $(this).data('ctrlZ', plugin);

            }

        });

    }

})(jQuery);