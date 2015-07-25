// Add navigation panel to side of Notebook
// - Single click on a heading and the notebook
//   focuses on it.
// - click and drag to move entire section 
//   and subsections.
// - ctrl + click to select entire section and subsections
//   for the chrome-clipboard


define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events',
    'codemirror/lib/codemirror',
    'codemirror/addon/fold/foldgutter',
    'codemirror/addon/fold/foldcode',
    'codemirror/addon/fold/brace-fold',
    'codemirror/addon/fold/indent-fold'
],  function(IPython, $, require, events, codemirror) 
    {
    "use strict";
    // creates a table of the section headings.
    var table = document.createElement('TABLE');
    var tableBody = document.createElement('TBODY');
    var NavPanelOn = false;
    tableBody.id= "MyTableBody"
    tableBody.dragndrop=false // are we draggin' and dropping?
    tableBody.dragndrop_i=0 // the cell number under which heading the drag started
    tableBody.dragndrop_HeadingLevel=0 // the headinglevel of the cell under which the drag started
    tableBody.onmouseout = NavBarMouseOut
    table.onmouseover = NavBarMouseOver
    table.appendChild(tableBody);
    table.className = "NavPanelTable"
    build_NavBar(tableBody)
    
    
    
    function build_NavBar()
    {
        var ncells = IPython.notebook.ncells();
        var cells = IPython.notebook.get_cells();
        var l_NavBar=tableBody.childNodes.length
        tableBody.sectionheadings_i=[[],[],[],[],[]] // Contains the section hierarchy
        var section=[0,0,0,0,0] // the current section indices
        var heading_number = 0
		// builds a table of the various sections and subsections.
        for (var i=0; i<ncells; i++) 
            { 
            var _cell=cells[i];
            if (_cell.cell_type=="markdown") // All section headings are markdown cells
                {
                var _cell_text=_cell.get_text()
                
                // counts the number of leading # which tells us the heading level
                var j=0
                var _thischar=_cell_text.charAt(0)
                while (_thischar=="#" && j<5)
                    {
                    j++
                    _thischar=_cell_text.charAt(j)
                    }
                    
                if (j>0) // j=0 is not a heading
                    {
                    if (tableBody.childNodes.length<=heading_number)
                        { 
                        // create new row if number of sections have increased
                        // for some reason we can't just remove all tablerows 
                        // like "while ( tableBody.firstChild ) tableBody.removeChild( tableBody.firstChild );"     
                        //  - it breaks the event listeners added to the new
                        // NavBarCell's for some reason...
                        var tr = document.createElement('TR');
                        tableBody.appendChild(tr);
                        var td = document.createElement('TD');
                        tr.appendChild(td);
                        // event linking
                        td.onclick = NavBarCellClick
                        td.onmousedown = NavBarCellMousedown
                        td.onmouseup = NavBarCellMouseup
                        td.appendChild(document.createTextNode(""))
                        }
                    else
                        {// create new table cells if number of sections was increased
                        var td=tableBody.childNodes[heading_number].childNodes[0]
                        }
                    // inserts heading in table
                    tableBody.sectionheadings_i[j-1].push(i)
                    td.id="cell "+i
                    td.MyCell_i=i
                    td.HeadingLevel=j-1
                    td.className = "NavPanelCell NavPanelCell"+"X".repeat(j) // one class for each level
                    
                    
                    
                    // creates proper labels for the headings
                    section=update_section(j-1, section) // numbering the headings.
                    td.childNodes[0].nodeValue=(section_to_string (section)+" "+_cell_text.replace(/#/gi,""));
                    heading_number++
                    }
                }

            }
        // delete extra cells i.e. if a heading was removed since last update.
        if (tableBody.childNodes.length>heading_number)
            {
            tableBody.removeChild( tableBody.lastChild );
            }
    
    }
    
    function update_section (newsectionlevel, oldsection)
		// used for getting the actual section in build_NavBar()
        {
        oldsection[newsectionlevel]++; //adds one to the current section at the proper level 
        for (var j = newsectionlevel+1 ; j<5 ; j++)
            {
            oldsection[j]=0 // resets subsections 
            }
        return oldsection
        }
    
    function any_lower_subdivisions(section,j0)
		// Check for subsections in the current (sub)section
        {
        for (var j=j0 ; j<5 ; j++) 
            {
            if (section[j]!=0) return true
            }
        return false
        }
    
    function section_to_string (section)
		// Returns a string representation of the section array
        {
        var newstr=""
        for (var j = 0 ; j<5 ; j++)
            {
                if (section[j]!=0 || any_lower_subdivisions(section,j))
                    {
                    if (j>0)
                        {newstr=newstr+"."}
                    newstr=newstr+section[j].toString()
                    }
            }
        return newstr
        }
    
    
    
    function toggleNavPanel () 
        {
		// Is NavPanel on?
        var x = $("#NavPanel").html();
        if ( x == undefined ) 
            {
            NavPanelOn = true
            /* reduce notebook width */
            //$("#notebook_panel").css({"float": "right","overflow-x": "hidden","height": "100%","width": "80%"});
            $("#notebook_panel").css({"overflow-x": "hidden","height": "100%","width": "80%",
                                        "position":"absolute", "left":"20%"});
            $(".cell").css({"width":"80%"})
            /* add panel to the right of notebook */
            var NavPanel = '<div id="NavPanel"></div>';
            $("#ipython-main-app").append(NavPanel);
            document.getElementById("NavPanel").appendChild(table);
            build_NavBar(tableBody)
            //show_sections()
            }
        else 
            {
            NavPanelOn = false
            $("#notebook_panel").css({"width": "100%","left":"0%"});
            $(".cell").css({"width":"100%"})
            $('#NavPanel').remove();
            }
        }

    // add button
    IPython.toolbar.add_buttons_group([
            {
                id : 'Nav_Panel_button',
                label : 'Show Navigation panel',
                icon : 'fa-bars',
                callback : toggleNavPanel
            }
      ]);
      
    function NavBarCellClick(event) 
            {
            console.log("clicked")
            if(cntrlIsPressed)
                {
				// flips the selection of section and subsections for the chrome clipboard
                //console.log("CTRL")
                var i_start = event.currentTarget.MyCell_i
                var sectionheadings_i = tableBody.sectionheadings_i
                var HeadingLevel = event.currentTarget.HeadingLevel
                var i_slut=get_section_end(i_start,HeadingLevel,sectionheadings_i)
                var cells=IPython.notebook.get_cells()
                for (var i=i_start; i<=i_slut;i++)
                    {
                    var _cell=cells[i]
                    if (_cell.metadata.selected!=undefined)
                        {delete _cell.metadata.selected
                        _cell.element.removeClass('multiselect')}
                    else
                        {_cell.metadata.selected=true
                        _cell.element.addClass('multiselect')}
                    }
                    //$(".multiselect").css({"outline": "green dotted thick"})
                }
            else
                {// selects and focuses on heading
                IPython.notebook.select(event.currentTarget.MyCell_i);
                IPython.notebook.focus_cell()
                }
            };
    function NavBarCellMousedown(event) 
            {
			// initiates dragndrop
            //console.log("NavBarMousedown")
            tableBody.dragndrop=true
            tableBody.dragndrop_i=event.currentTarget.MyCell_i
            tableBody.dragndrop_HeadingLevel=event.currentTarget.HeadingLevel
            //console.log(event.currentTarget.parentElement.parentElement.dragndrop + " " + event.currentTarget.parentElement.parentElement.dragndrop_i)
            };
    function NavBarCellMouseup(event) 
            {
            // terminates dragndrop
            //console.log("NavBarMouseup")
            if (tableBody.dragndrop == true && tableBody.dragndrop_i != event.currentTarget.MyCell_i)
            {
                rearrangeCells(event)
            }
            tableBody.dragndrop=false
            tableBody.dragndrop_i=0
            tableBody.dragndrop_HeadingLevel=0
            //console.log(event.currentTarget.parentElement.parentElement.dragndrop + " " + event.currentTarget.parentElement.parentElement.dragndrop_i)
            };
    function NavBarMouseOut(event) 
            {
            // cancels the dragndrop if the mouse moves out of the list.
            if (event.currentTarget != event.relatedTarget.parentElement.parentElement)
            {
                event.currentTarget.dragndrop=false
                event.currentTarget.dragndrop_i=0
            }
            //console.log(event.currentTarget.dragndrop + " " + event.currentTarget.dragndrop_i)
            };
            
    function NavBarMouseOver(event) 
            {
            if (event.relatedTarget.className!="NavPanelCell")
            {
                // Updates the NavBar if mouse enters it from outside
                updateNavPanel()
            }
            };
            


    // checks if ctrl is pressed
    var cntrlIsPressed = false;
    $(document).keydown(function(event){
        if(event.which=="17")
            cntrlIsPressed = true;
    }                   );
    $(document).keyup(function(){
        cntrlIsPressed = false;
    });




            
            
    function rearrangeCells(event)
        {
		// moves cells after dragndrop
        var i_start = event.currentTarget.parentElement.parentElement.dragndrop_i
        var i_target = event.currentTarget.MyCell_i
        var sectionheadings_i = tableBody.sectionheadings_i
        var HeadingLevel = tableBody.dragndrop_HeadingLevel
        var i_slut=get_section_end(i_start,HeadingLevel,sectionheadings_i)
        console.log("moving cell "+i_start+" to "+i_slut+" to position "+i_target+" Headinglevel "+HeadingLevel)
        for (var i=i_start; i<=i_slut;i++)
            {
            if (i_target>i_start) 
                {
                for (var j=0; j<=Math.abs(i_target-i_start);j++)
                    {
                    move_cell_down(i_start+j)
                    }
                }
            if (i_target<i_start)
                {
                for (var j=0; j<Math.abs(i_target-i_start);j++)
                    {
                    move_cell_up(i-j)
                    }
                }
            }
        updateNavPanel()
        };
      
    function get_section_end(i_start,HeadingLevel,sectionheadings_i)
    {
        // exits at the first case of a heading of higher or equal rank to the moving one that has a higher index.
        var i_slut =99999999999
        for (var j = 0; j<=HeadingLevel;j++) // looks at all headings equal to or larger than the selection parent
        {
            for (var k = 0,len = sectionheadings_i[j].length; k < len; k++)
            {
                if (sectionheadings_i[j][k] > i_start)
                {   
                    if (sectionheadings_i[j][k] < i_slut)
                        {i_slut = sectionheadings_i[j][k]-1}
                        //console.log("islut",i_slut,k,j)
                    break // only looks at the first entry with i bigger than i_start
                }
            }
        }
        if (i_slut==99999999999){i_slut = IPython.notebook.get_cells().length-1} // if end is near
        //console.log(" i_start "+i_start+" i_start kontrol "+sectionheadings_i[HeadingLevel][i]+" i_slut "+i_slut+" HeadingLevel "+HeadingLevel+" "+sectionheadings_i[HeadingLevel])
        return i_slut 
    }
    function move_cell_down(i) {
        console.log("down")
        if (IPython.notebook.is_valid_cell_index(i) && IPython.notebook.is_valid_cell_index(i+1)) {
            var pivot = IPython.notebook.get_cell_element(i+1);
            var tomove = IPython.notebook.get_cell_element(i);
            if (pivot !== null && tomove !== null) {
                tomove.detach();
                pivot.after(tomove);
            }
        }
    };
    
    function move_cell_up(i) {
        if (IPython.notebook.is_valid_cell_index(i) && IPython.notebook.is_valid_cell_index(i-1)) {
            console.log("moving cell up:",i,i-1)
            var pivot = IPython.notebook.get_cell_element(i-1);
            var tomove = IPython.notebook.get_cell_element(i);
            if (pivot !== null && tomove !== null) {
                tomove.detach();
                pivot.before(tomove);
            }
        }
    };
    
    
    

      
      
      
      
/**
     * Add CSS file
     *
     * @param name filename
     */
    var load_css = function (name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);
      };

    function load_my_css() 
        // Finds the url of main.js (the present script) and uses it to find main.css who should be in the same dir.
        {
        var scripts = document.getElementsByTagName("script"),
        src = scripts[scripts.length-1].src;
        for (var script in scripts)
            {
            if (scripts[script].src != null)
                {
                var MyIndex = scripts[script].src.indexOf("NavPanel/main.js")
                if (scripts[script].src != null && MyIndex > -1) 
                    {
                    var css_url = scripts[script].src.slice(0,MyIndex+13)+".css"
                    console.log(css_url)
                    load_css(css_url)
                    }
                }
            }

        }
    load_my_css()
    //ensures update when the headings are changed/added/deleted
    function updateNavPanel () {
                        //console.log("updating")
                        if (NavPanelOn == true)
                        {build_NavBar(document.getElementById("MyTableBody"))};
                     };
    function createCell_update () {
        updateNavPanel();
        if (NavPanelOn == true)
            {$(".cell").css({"width":"80%"})};
        }
    events.on('rendered.MarkdownCell', updateNavPanel);
    events.on('delete.Cell', updateNavPanel);
    events.on('create.Cell', createCell_update);
    /* There should also be checks for moving cells, but I don't think they exist.
    Instead we use events on the buttons. Also we use the table.onmouseover = NavBarMouseOver 
    in show_sections to ensure
    that the NavPanel is at least updated when the mouse enters. */
    $("[title='move selected cell up']")[0].addEventListener("click", updateNavPanel);
    $("[title='move selected cell down']")[0].addEventListener("click", updateNavPanel);
    $("#move_cell_up")[0].addEventListener("click", updateNavPanel);
    $("#move_cell_down")[0].addEventListener("click", updateNavPanel);
    
    

                    
});
