;(function($) {

    $.ctrlZ = function(element, options) {

        var defaults = {

            undo: true,
            redo: true,
			interval:1, // seconds

        }
	
        var plugin = this;
		var plugin.qty = 0;
		
		plugin.undo_buffer = {};
		plugin.infos = {};
        plugin.settings = {}

        var $element = $(element), 
             element = element;    

        plugin.init = function() {

            plugin.settings = $.extend({}, defaults, options);


			$element.each(function(){
				plugin.qty++;
				console.log(qty);
				var _id = false;
				if(!(_id = $(this).attr('id'))) {
					_id = 'ctrlZ_'+plugin.qty;
					$(this).attr('id',_id);
				}
				plugin.undo_buffer[_id]=new Array();
				plugin.infos[_id]={ctrl:false,rang:0,prec:''};
			}).keyup(function(e){
				var _id = $(this).attr('id');
				var _key = getKey(e)
				console.log('keyup '+_key);
				if(_key == 17){
					plugin.infos[_id].ctrl=false;
				}
			}).keydown(function(e){
				var _obj = $(this);
				var _id = _obj.attr('id');
				var _key = getKey(e)
				console.log('kedown '+_key);
				if(_key == 17){
					plugin.infos[_id].ctrl=true;
				}
				if(_key == 89 && plugin.infos[_id].ctrl){
					e.preventDefault();
					if(plugin.infos[_id].rang<plugin.undo_buffer[_id].length) {
						try {
							plugin.infos[_id].rang++;
							console.log(plugin.infos[_id].rang);
							var _tmp_val = plugin.undo_buffer[_id][plugin.infos[_id].rang];
							plugin.infos[_id].prec_val=_tmp_val
							_obj.val(_tmp_val);
						}catch (Everything){}
					}
				}
				if(_key == 90 && plugin.infos[_id].ctrl){
					e.preventDefault();
					if(plugin.infos[_id].rang>0) {
						try {
							plugin.infos[_id].rang--;
							console.log(plugin.infos[_id].rang);
							var _tmp_val = plugin.undo_buffer[_id][plugin.infos[_id].rang];
							plugin.infos[_id].prec_val=_tmp_val
							_obj.val(_tmp_val);
						}catch (Everything){}
					}
				}
			});

			//daemon();
        }
		
		var getKey = function(e) {
			return e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
		}

        var daemon = function() {
			setInterval(function(){
				var _mod=false;
				for (var _tmp_id in plugin.undo_buffer) {
				  if (plugin.undo_buffer.hasOwnProperty(_tmp_id)) {
					  console.log(_tmp_id);
					 var _tmp_obj = $('#'+_tmp_id);
					 var _val = _tmp_obj.val();
					if(plugin.infos[_tmp_id].tmp_val!=_val) {
						plugin.infos[_tmp_id].rang++;
						console.log(plugin.infos[_tmp_id].rang);
						plugin.undo_buffer[_tmp_id].push(_val);
						plugin.infos[_tmp_id].prec_val = _val;
						_mod=true;
					}
				  }
				}
				if(_mod) {
					console.log(plugin.undo_buffer);
				}
			},plugin.settings.interval*1000);

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