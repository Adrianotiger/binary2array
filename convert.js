let Converter = new class
{
  constructor()
  {
    this.div = null;
    this.text = null;
  }

  showDialog()
  {
    if(this.div != null) return;
    
    this.text = _CN("textarea");
    this.div = _CN("div", {class:"dialog2"}, [this.text], document.body);
  }

  convert(file, options)
  {
    this.text.textContent = "";

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        this.showContents(file, event.target.result, options);
    });
    reader.readAsArrayBuffer(file);
  }

  clear()
  {
    if(this.text != null)
    {
      this.text.textContent = "press 'CONVERT'";
    }
  }

  showContents(file, buffer, options)
  {
    let arr = null;
    let bits = 8;
    let radix = 16;
    let txt = "";
    let padStart = 0;
    let padChar = '0';
    let newLine = parseInt(options["columns"].value);
    const pad = options["pad"].checked;
    const prefix = options["prefix"].value.trim();
    const suffix = options["suffix"].value.trim();
    switch(options["datatype"].value)
    {
      case "uint8_t": arr = new Uint8Array(buffer); bits = 8; break;
      case "uint16_t": arr = new Uint16Array(buffer); bits = 16; break;
      case "uint32_t": arr = new Uint32Array(buffer); bits = 32; break;
      default: arr = new Uint8Array(buffer); break;
    }
    switch(options["format"].value)
    {
      case "hex": radix = 16; if(pad) padStart = 2 * (bits / 8); break;
      case "dec": radix = 10; if(pad) {const sp = [3,5,8,10]; padStart = sp[bits / 8];} padChar = ' '; break;
      case "bin": radix = 2; padStart = bits; break;
      default: arr = new UInt8Array(buffer); break;
    }

    const skipBytes = parseInt(options["skipbytes"].value) / (bits/8);
    if(skipBytes > 0) arr = arr.slice(skipBytes);
    const arrLen = arr.length;
    if(newLine == 0) newLine = arrLen;
    let numIndex = 0;
    this.text.textContent = "static const " + options["datatype"].value + " " + file.name.replace(" ", "_").substring(0, file.name.indexOf(".")) + "[" + arrLen + "] = {\n";
    arr.forEach(a=>{
      txt += prefix + arr[numIndex].toString(radix).padStart(padStart, padChar) + suffix;
      if(++numIndex < arrLen) txt += ", ";
      if((numIndex % newLine) == 0) txt += '\n';

      if((numIndex % 1000) == 0) {this.text.textContent += txt; txt = "";}
    });

    this.text.textContent += txt + "\n};\n";
    console.log(buffer);
    console.log(options);
  }
};