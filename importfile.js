let ImportFile = new class
{
  constructor()
  {
    
  }

  init()
  {
    document.body.addEventListener("drop", (e)=>{this.dropHandler(e);});
    document.body.addEventListener("dragover", (e)=>{this.dragHandler(e);});
  }

  dropHandler(e)
  {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
    if (e.dataTransfer.items) 
    {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < e.dataTransfer.items.length; i++) 
      {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === 'file') 
        {
          console.log(e.dataTransfer.items[i]);
          this.loadFile(e.dataTransfer.items[i].getAsFile());
          break;
        }
      }
    } 
    console.log(e);
  }

  dragHandler(e)
  {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
  }

  loadFile(f)
  {
    Converter.clear();
    console.log("LOAD FILE: ", f);
    if(!f)
    {
      let input = _CN('input', {type:'file', accept:'.*'});
      input.onchange = () => {      
        if(input.files && input.files.length > 0) this.loadFile(input.files[0]);
      };
      input.click();
    }
    else if(f instanceof File)
    {
      console.log(f);
      if(f.size > 1024 *1024 * 2)
      {
        if(!confirm("The file is big (" + parseInt(f.size / 1024) + " kb). Are you sure you want to convert it?")) return;
      }
      Options.createDialog(f);
      Converter.showDialog();
    }
  }
};

window.addEventListener("load", ()=>{ImportFile.init();});