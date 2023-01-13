let Options = new class
{
  constructor()
  {
    this.file = null;
    this.div = null;
    this.image = null;
    this.divs = [];
    this.settings = {format:["hex", "dec", "bin"], prefix:"0x", suffix:"", pad:true, datatype:["uint8_t", "uint16_t", "uint32_t"], columns:16, skipbytes:0};
    this.imageSettings = {convertto:["none", "raw", "raw_compact", "raw_zip", "jpeg", "png"], rgb:["16bit", "8bit"], quality:95, level:2};
    this.typeSettings = {none:[], raw:["rgb"], raw_compact:["rgb"], raw_zip:["rgb", "level"], jpeg:["quality"], png:[]};
    this.inputs = [];
  }

  createDialog(f)
  {
    this.file = f;

    if(this.div != null) 
    {
        this.fillFileInfo();
        return;
    }

    this.div = _CN("div", {class:'dialog'}, null, document.body);
    this.divs['fileinfo'] = _CN("div", null, null, this.div);
    let butt = _CN("button", {}, ["convert"], this.div);
    this.divs['conversion'] = _CN("div", null, null, this.div);
    this.divs['image'] = _CN("div", {style:"display:none;"}, null, this.div);

    this.fillFileInfo();
    this.fillConversionSettings();
    this.fillImageConversionSettings();

    butt.addEventListener("click", ()=>{
      if(this.image != null && this.inputs["convertto"].value != "none")
      {
        Converter.convertImage(this.image, this.inputs);
      }
      else
      {
        Converter.convert(this.file, this.inputs);
      }
    });
  }

  fillFileInfo()
  {
    this.divs['fileinfo'].innerHTML = "";
    _CN("h2", null, ["File Info:"], this.divs['fileinfo']);
    _CN("span", null, [_CN("b",null, ["name: "]), this.file.name], this.divs['fileinfo']);
    _CN("span", null, [_CN("b",null, ["type: "]), this.file.type], this.divs['fileinfo']);
    _CN("span", null, [_CN("b",null, ["size: "]), this.file.size.toLocaleString() + " bytes"], this.divs['fileinfo']);
    createImageBitmap(this.file).then(im=> {
      console.log(im);
      this.image = _CN("canvas", {width:im.width, height:im.height});
      _CN("span", null, [
        this.image,
        " : " + this.image.width + "x" + this.image.height
      ], this.divs['fileinfo']);
      this.divs['image'].style.display = "inline-grid";
      let ctx = this.image.getContext("2d");
      ctx.drawImage(im,0,0,this.image.width,this.image.height,0,0,this.image.width,this.image.width);
    }).catch(ex=>{
      this.image = null;
      this.divs['image'].style.display = "none";
      console.log("not an image");
    });
  }

  fillConversionSettings()
  {
    this.divs['conversion'].innerHTML = "";
    let convTitle = _CN("h2", null, ["Conversion:"], this.divs['conversion']);
    Object.keys(this.settings).forEach(k=>{
      let span = _CN("span", null, null, this.divs['conversion']);
      _CN("b", null, [k], span);
      this.inputs[k] = this.createInput(this.settings[k], span);
    });

    this.inputs["format"].addEventListener("change", ()=>{
      switch(this.inputs["format"].value)
      {
        case "hex": this.inputs["prefix"].value = "0x"; break;
        case "dec": this.inputs["prefix"].value = ""; break;
        case "bin": this.inputs["prefix"].value = "b"; break;
      }
    });

    convTitle.addEventListener("click", ()=>{
      Converter.showHelp("https://github.com/Adrianotiger/binary2array/wiki/Conversion-Settings");
    });
  }

  fillImageConversionSettings()
  {
    this.divs['image'].innerHTML = "";
    _CN("h2", null, ["Image Settings:"], this.divs['image']);
    Object.keys(this.imageSettings).forEach(k=>{
      let span = _CN("span", null, null, this.divs['image']);
      _CN("b", null, [k], span);
      this.inputs[k] = this.createInput(this.imageSettings[k], span);
      if(k != "convertto")
        this.inputs[k].style.visibility = "hidden";
    });

    this.inputs["convertto"].addEventListener("change", ()=>{
      var sels = this.divs['image'].getElementsByTagName("select");
      var inps = this.divs['image'].getElementsByTagName("input");
      var list = []
        .concat(Array.from(sels))
        .concat(Array.from(inps));
      for(var j=1;j<list.length;j++) list[j].style.visibility = "hidden";
      this.typeSettings[this.inputs["convertto"].value].forEach(k=>{this.inputs[k].style.visibility = "visible";});
    });
  }

  createInput(setting, parent)
  {
    let inp = null;
    if(Array.isArray(setting))
    {
      inp = _CN("select", null, null, parent);
      setting.forEach(o=>{_CN("option", {value:o}, [o], inp)});
    }
    else if(typeof setting == "boolean")
    {
      inp = _CN("input", {type:"checkbox", checked:setting}, null, parent);
    }
    else if(typeof setting == "number")
    {
      inp = _CN("input", {type:"number", value:setting}, null, parent);
    }
    else
    {
      inp = _CN("input", {type:"text", value:setting}, null, parent);
    }
    return inp;
  }
};