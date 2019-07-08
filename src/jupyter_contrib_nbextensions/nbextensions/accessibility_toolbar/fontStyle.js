define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'base/js/utils'
], function(Jupyter, $) 
{
    "use strict";

    var fontStyle=function()
    {             
        var dp_menu_flag=false;
        var fs_flag=false;
        var boostrap_toggle="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css";
        var boostrap_toggle_js="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js";

        fontStyle.prototype.fs_click=function(){}

    

        fontStyle.prototype.fs_css_initial=function(url)
        { //css_initial
            var link=document.createElement("link");
            link.rel="stylesheet";
            link.type="text/css"
            link.href=requirejs.toUrl(url);
            document.getElementsByTagName("head")[0].appendChild(link);
        }

        fontStyle.prototype.fs_js_initail=function(url)
        { //js_initail
            var script=document.createElement("script");
            script.src=requirejs.toUrl(url);
            document.getElementsByTagName("head")[0].appendChild(script);  
        }

        fontStyle.prototype.fs_initial=function()
        { //fs_initia
            this.fs_css_initial("../../nbextensions/accessibility_toolbar/fontStyle.css");//spc_flag
            this.fs_css_initial(boostrap_toggle);
            this.fs_js_initail(boostrap_toggle_js);
            //find Customise font  utton on the page
			var l=document.querySelectorAll('button[title]');
    		for(var i=0;i<l.length;i++)
    		{
        		var btn=l[i];
        		if(btn.title=="Customise font")
        		{
           		var fs=btn;
       			}
    		}
    		fs.className+="dropdown-toggle";
   			fs.setAttribute("data-toggle","dropdown")
   			this.fs_dropdown_initial(fs);
        }//end fs_initial

        fontStyle.prototype.fs_dropdown_initial=function(fs)
        {
            //Create the dropdown menu
            if(dp_menu_flag==false)
            {
       		var dropMenu=document.createElement("ul");
       		dropMenu.className="dropdown-menu";
       		dropMenu.id-"fs_dropdown";
        	dp_menu_flag=true;
    		}
		//Create the contents of dropdown menu
		//Predefined style
		    var fs_menuitem1=document.createElement("li");
		    var fs_Predefined_styles=document.createElement("a");
		    fs_Predefined_styles.text="Predefined styles";
		    fs_menuitem1.appendChild(fs_Predefined_styles);
		    dropMenu.appendChild(fs_menuitem1); 
		    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
		    //&submenu
		    //&end submenu


		    //Font color
		    var fs_menuitem2=document.createElement("li");
		    var fs_font_color=document.createElement("a");
		    fs_font_color.text="Font color";
		    fs_menuitem2.appendChild(fs_font_color);
		    dropMenu.appendChild(fs_menuitem2); 
		    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
		    //end 

		    //Font name
		    var fs_menuitem3=document.createElement("li");
		    var fs_font_name=document.createElement("a");
		    fs_font_name.text="Font name";
		    fs_menuitem3.appendChild(fs_font_name);
		    dropMenu.appendChild(fs_menuitem3); 
		    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
		    //end

		    //Font size
		    var fs_menuitem4=document.createElement("li");
		    var fs_font_size=document.createElement("a");
		    fs_font_size.text="Font size";
		    fs_menuitem4.appendChild(fs_font_size);
		    dropMenu.appendChild(fs_menuitem4); 
		    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
		    //end

		    //Background color
		    var fs_menuitem5=document.createElement("li");
		    var fs_bg_color=document.createElement("a");
		    fs_bg_color.text="Background color";
		    fs_menuitem5.appendChild(fs_bg_color);
		    dropMenu.appendChild(fs_menuitem5); 
		    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
		    //end

		    //Line spacing
		    var fs_menuitem6=document.createElement("li");
		    var fs_line_spacing=document.createElement("a");
		    fs_line_spacing.text="Line spacing";
		    fs_menuitem6.appendChild(fs_line_spacing);
		    dropMenu.appendChild(fs_menuitem6); 
		    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
		    //end

		    //Letter spacing
		    var fs_menuitem7=document.createElement("li");
		    var fs_letter_spacing=document.createElement("a");
		    fs_letter_spacing.text="Letter spacing";
		    fs_menuitem7.appendChild(fs_letter_spacing);
		    dropMenu.appendChild(fs_menuitem7); 
		    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
		    //end

		    //Transform
		    var fs_menuitem8=document.createElement("li");
		    var fs_transform=document.createElement("a");
		    fs_transform.text="Transform";
		    fs_menuitem8.appendChild(fs_transform);
		    dropMenu.appendChild(fs_menuitem8); 
		    fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
		    //end
		    
		    //On/off                
                var fs_menuitem9=document.createElement("li");
                fs_menuitem9.className="switch";
                var fs_switch=document.createElement("input");
                fs_switch.id="fs_switch";
                fs_switch.type="checkbox";
                fs_switch.setAttribute("data-toggle","toggle");
                fs_menuitem9.addEventListener('click', function () 
                {
                    if(fs_flag==false)
                    {
                        fs_flag=true;
                    }
                    else
                    {
                        fs_flag=false;
              		}
                });
                fs_menuitem9.appendChild(fs_switch);
                dropMenu.appendChild(fs_menuitem9);
                fs.parentNode.insertBefore(dropMenu,fs.nextSibling);
                //end
          
        }
	}

   
    return fontStyle;
})