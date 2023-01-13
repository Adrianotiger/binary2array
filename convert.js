let Converter = new class
{
  constructor()
  {
    this.div = null;
    this.text = null;
    this.help = null;
    this.array = null;
    this.download = null;
  }

  showDialog()
  {
    if(this.div != null) return;
    
    this.text = _CN("textarea");
    this.help = _CN("div", {class:"help", style:"display:none;"});
    let saveButt = _CN("span", {class:"icon", style:"top:5px;right:25px;position:absolute;", title:"Save C file"}, ["💾"]);
    this.download = _CN("span", {class:"icon", style:"top:5px;right:60px;position:absolute;", title:"Download binary"}, ["⬇"]);
    this.div = _CN("div", {class:"dialog2"}, [this.text, saveButt, this.download, this.help], document.body);

    saveButt.addEventListener("click", ()=>{this.saveFile(false);});
    this.download.addEventListener("click", ()=>{this.saveFile(true);});
    this.help.addEventListener("click", ()=>{this.help.style.display = "none";});
  }

  showHelp(link)
  {
    fetch("https://raw.githubusercontent.com/Adrianotiger/binary2array/main/docs/" + link).then(r=>{
      return r.text();
    }).then(t=>{
      console.log(t);
      t = t.replace(/#### (.*$)/gm, "<h4>$1</h4>");
      t = t.replace(/### (.*$)/gm, "<h3>$1</h3>");
      t = t.replace(/## (.*$)/gm, "<h2>$1</h2>");
      t = t.replace(/# (.*$)/gm, "<h1>$1</h1>");
      t = t.replace(/!\[(.*)\]\((.*)\)/gm, "<img src='$2' title='$1' style='max-width:80%;'>");
      t = t.replace(/[ |^]+(https:\/\/[.]*[^ ]+)/gm, "<a href='$2' target='_blank'>$2</a>");
      t = t.replace(/^[ ]*-/gm, "<li>");
      t = t.replace(/\s$/gm, "<br>");
      this.help.style.display = "block";
      this.help.innerHTML = t;
    });
  }

  convert(file, options)
  {
    this.text.textContent = "";
    this.download.style.display = "none";

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        this.showContents(file.name, event.target.result, options);
    });
    reader.readAsArrayBuffer(file);
  }

  async convertImage(image, options)
  {
    this.text.textContent = "";
    this.download.style.display = "inline-block";

    const convertTo = options["convertto"].value;
    let buffer = null;

    if(convertTo == "raw" || convertTo == "raw_compact" || convertTo == "raw_zip")
    {
      buffer = await ImageConverter.convertRaw(image, options, convertTo);
    }
    else if(convertTo == "png")
    {
      buffer = ImageConverter.convertPng(image, options);
    }
    else if(convertTo == "jpeg")
    {
      buffer = ImageConverter.convertJpeg(image, options);
    }

    this.showContents(convertTo, buffer, options);
  }

  clear()
  {
    if(this.text != null)
    {
      this.text.textContent = "press 'CONVERT'";
    }
  }

  saveFile(saveAsBinary)
  {
    if(this.array == null || Options.file == null) return;

    if(window.showSaveFilePicker)
    {
      let options = {
        suggestedName: Options.file.name.substring(0, Options.file.name.indexOf(".")), 
        excludeAcceptAllOption: true,
        types:[]
      };
      var mime = "octet/stream";
      if(saveAsBinary)
      {
        var accept = {};
        var description = "Image file";
        switch(Options.inputs["convertto"].value) 
        {
          case "jpeg": mime = "image/jpeg"; accept[mime] = ['.jpg', '.jpeg']; break;
          case "png": mime = "image/png"; accept[mime] = ['.png']; break;
          default: accept[mime] = ['.raw']; description = "Binary file"; break;
        }
        options.types.push({description:description, accept:accept});
      }
      else
      {
        options.types.push({description:"C File", accept:{'text/plain':['.cpp', '.h', '.c']}});
      }
      window.showSaveFilePicker(options).then((fh)=>{
        console.log(fh);
        fh.getFile().then(fp=>{
          console.log(fp);
          fh.createWritable().then(async fw=>{
            var contents = null;
            if(saveAsBinary)
              await fw.write(this.array);
            else
              await fw.write(this.text.textContent);
            fw.close();
          }).catch(ex=>{
            alert("Unable to open file " + fh.name);
          });
        }).catch(ex=>{
          alert("Unable to open file " + fh.name);
        });
      }).catch(ex=>{
        console.log("File picker abort");
      });
    }
    else
    {
      let a = _CN("a", {style:"display:none"}, [" "], document.body);
      var blob = new Blob([this.array], {type: "image/jpeg"});
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "test.jpg";
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }

  showContents(filename, buffer, options)
  {
    this.array = null;
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
      case "uint8_t": bits = 8; break;
      case "uint16_t": bits = 16; break;
      case "uint32_t": bits = 32; break;
    }

    if((buffer.byteLength % (bits / 8) ) != 0)
    {
      this.text.textContent = "ERROR: you can set '" + options["datatype"].value + "' only if the buffer size is divisible by " + (bits / 8) + ".";
      return;
    }

      // Create array from ArrayBuffer with the right data type
    switch(bits)
    {
      case 8: this.array = new Uint8Array(buffer); break;
      case 16: this.array = new Uint16Array(buffer); break;
      case 32: this.array = new Uint32Array(buffer); break;
    }
      // Check the right output format and set the padding
    switch(options["format"].value)
    {
      case "hex": radix = 16; if(pad) padStart = 2 * (bits / 8); break;
      case "dec": radix = 10; if(pad) {const sp = [3,5,8,10]; padStart = sp[bits / 8 - 1];} padChar = ' '; break;
      case "bin": radix = 2; padStart = bits; break;
      default: this.array = new UInt8Array(buffer); break;
    }

      // Remove some bytes if it is set in the options
    const skipBytes = parseInt(options["skipbytes"].value) / (bits/8);
    if(skipBytes > 0) this.array = this.array.slice(skipBytes);
    const arrLen = this.array.length;
    if(newLine == 0) newLine = arrLen;
    let numIndex = 0;

      // Begin to write the output
    this.text.textContent = "static const " + options["datatype"].value + " " + filename.replace(" ", "_").substring(0, filename.indexOf(".")) + "[" + arrLen + "] = {\n";
    this.array.forEach(a=>{
      txt += prefix + this.array[numIndex].toString(radix).padStart(padStart, padChar) + suffix;
      if(++numIndex < arrLen) txt += ", ";
      if((numIndex % newLine) == 0) txt += '\n';

      if((numIndex % 1000) == 0) {this.text.textContent += txt; txt = "";}
    });

    this.text.textContent += txt.trim() + "\n};\n";

      // Output some info in the console
    console.log(buffer);
    console.log(options);
  }
};