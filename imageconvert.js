let ImageConverter = new class
{
  constructor()
  {
    this.zip = null;
  }

  convertJpeg(image, options)
  {
    let buffer = null;

    var quality = Number.parseFloat(options["quality"].value);
    if(quality < 0 || quality > 100) quality = 1;
    else if(quality <= 1) quality = quality;
    else quality /= 100.0;

    var dataUrl = image.toDataURL("image/jpeg", quality);
    var startPos = dataUrl.indexOf(",") + 1;
    const byteCharacters = atob(dataUrl.substring(startPos));

    buffer = new ArrayBuffer(byteCharacters.length);
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < byteCharacters.length; i++) { bytes[i] = byteCharacters.charCodeAt(i); }

    return buffer;
  }

  convertPng(image, options)
  {
    let buffer = null;

    // todo: add 24bit support, instead of 32-bit images
    // todo: add alpha support
    // todo: add compression support
    // todo: add some PNG library to the project to create better PNGs...

    var dataUrl = image.toDataURL("image/png");
    var startPos = dataUrl.indexOf(",") + 1;
    const byteCharacters = atob(dataUrl.substring(startPos));

    buffer = new ArrayBuffer(byteCharacters.length);
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < byteCharacters.length; i++) { bytes[i] = byteCharacters.charCodeAt(i); }

    return buffer;
  }

  async convertRaw(image, options, rawType)
  {
    let buffer = null;
    let bytes = null;

    const RGBbits = options["rgb"].value;
    var ctx = image.getContext("2d");
    var data = ctx.getImageData(0,0,image.width,image.height); /* Uint8ClampedArray (4 bytes for each pixel) */

    if(RGBbits == "16bit")
    {
      buffer = new ArrayBuffer(data.data.length / 2);
      bytes = new Uint16Array(buffer);
      for(var j=0;j<data.data.length / 4;j++)
      {
        bytes[j] = ((data.data[j * 4 + 0] / 8) << 11) + ((data.data[j * 4 + 1] / 4) << 5) + (data.data[j * 4 + 2] / 8);
      }
    }
    else // 8bits
    {
      buffer = new ArrayBuffer(data.data.length / 4);
      bytes = new Uint8Array(buffer);
      for(var j=0;j<data.data.length / 4;j++)
      {
        bytes[j] = ((data.data[j * 4 + 0] / 32) << 5) + ((data.data[j * 4 + 1] / 32) << 2) + (data.data[j * 4 + 2] / 64);
      }
    }

    if(rawType == "raw_compact")
    {
      var temp = this.compressData(bytes);
      buffer = new ArrayBuffer(temp.length * bytes.BYTES_PER_ELEMENT);
      var bytes2 = null; 
      if(RGBbits == "16bit") bytes2 = new Uint16Array(buffer);
      else bytes2 = new Uint8Array(buffer);
      for(var j=0;j<temp.length;j++) bytes2[j] = temp[j];
    }
    else if(rawType == "raw_zip")
    {
      var zip = new JSZip();
      zip.file("image.raw", buffer, {binary:true, compressionOptions:{level:parseInt(options["level"].value)}});
      buffer = null;
      var x = await zip.generateAsync({type : "arraybuffer", compression: "DEFLATE"});
      console.log(x);
      buffer = x;
    }

    return buffer;
  }

  compressData(data)
  {
    let buffer = [];
    let START_VAL = 0;
    if(data.BYTES_PER_ELEMENT == 2) 
        START_VAL = 0xcdcd;
    else 
        START_VAL = 0xcd;

    
    let ret = 0;
    let valo = START_VAL;
    let same = 1;
    let inc = false;
    for(var x=0;x<data.length;x++)
    {
      inc = false;
      if(same >= 2)
      {
        if(data[x] == valo && x < data.length - 1) 
        {
          same++;
        }
        else
        {  
          inc = true;
          same -= 2;
          if(data.BYTES_PER_ELEMENT == 1)
          {
            while (same >= 0xff)
            {
              buffer[ret++] = 0xff;
              same -= 0xff;
            }
          }
          else if(data.BYTES_PER_ELEMENT == 2)
          {
            while (same >= 0xffff)
            {
              buffer[ret++] = 0xffff;
              same -= 0xffff;
            }
          }
          buffer[ret++] = same;
          same = 1;
          valo = data[x];
        }
      }
      else
      {
        inc = true;
        if(data[x] == valo) 
          same++;
        else 
          same = 1;
        valo = data[x];
      }

      if(inc)
        buffer[ret++] = data[x];
    }
    return buffer;
  }
};