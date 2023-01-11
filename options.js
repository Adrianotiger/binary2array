let Options = new class
{
  constructor()
  {
    this.file = null;
    this.div = null;
    this.divs = [];
    this.settings = {format:["hex", "dec", "bin"], prefix:"0x", suffix:"", pad:true, datatype:["uint8_t", "uint16_t", "uint32_t"], columns:16, skipbytes:0};
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

    this.fillFileInfo();
    this.fillConversionSettings();

    butt.addEventListener("click", ()=>{
      Converter.convert(this.file, this.inputs);
    });
  }

  fillFileInfo()
  {
    this.divs['fileinfo'].innerHTML = "";
    _CN("h2", null, ["File Info:"], this.divs['fileinfo']);
    _CN("span", null, [_CN("b",null, ["name: "]), this.file.name], this.divs['fileinfo']);
    _CN("span", null, [_CN("b",null, ["type: "]), this.file.type], this.divs['fileinfo']);
    _CN("span", null, [_CN("b",null, ["size: "]), this.file.size.toLocaleString() + " bytes"], this.divs['fileinfo']);
  }

  fillConversionSettings()
  {
    this.divs['conversion'].innerHTML = "";
    _CN("h2", null, ["Conversion Settings:"], this.divs['conversion']);
    Object.keys(this.settings).forEach(k=>{
      let span = _CN("span", null, null, this.divs['conversion']);
      _CN("b", null, [k], span);
      if(Array.isArray(this.settings[k]))
      {
        this.inputs[k] = _CN("select", null, null, span);
        this.settings[k].forEach(o=>{_CN("option", {value:o}, [o], this.inputs[k])});
      }
      else if(typeof this.settings[k] == "boolean")
      {
        this.inputs[k] = _CN("input", {type:"checkbox", checked:this.settings[k]}, null, span);
      }
      else if(typeof this.settings[k] == "number")
      {
        this.inputs[k] = _CN("input", {type:"numeric", value:this.settings[k]}, null, span);
      }
      else
      {
        this.inputs[k] = _CN("input", {type:"text", value:this.settings[k]}, null, span);
      }
      
      console.log(k, typeof this.settings[k]);
    });

    this.inputs["format"].addEventListener("change", ()=>{
      switch(this.inputs["format"].value)
      {
        case "hex": this.inputs["prefix"].value = "0x"; break;
        case "dec": this.inputs["prefix"].value = ""; break;
        case "bin": this.inputs["prefix"].value = "b"; break;
      }
    });
  }
};