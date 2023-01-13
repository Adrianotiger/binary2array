# binary2array
Convert a binary file to a C array

Just another online converter, to convert a binary file to a C header array.

Simple and easy to add more features.

1. Open https://adrianotiger.github.io/binary2array/
2. Drop a file
3. Set up the options to convert the file
4. Press convert

![image](https://user-images.githubusercontent.com/7373079/211860291-09249916-506d-432b-aaa2-6ef4a7221a91.png)

## Converting Settings
### Format
The number format in the output.
- HEX (0x3c, 0x21, 0x44, 0x4f, 0x43, 0x54, 0x59, ...)
- DEC ( 60,  33,  68,  79,  67,  84,  89, ...)
- BIN (b00111100, b00100001, b01000100, b01001111, b01000011, b01010100, b01011001, ...)
### Prefix
What text you want add to the number.  
In C and as HEX, it is `0x` (0x5A), but you can also set '\x' or leave it empty.
### Suffix
What text you want add after the number.  
For example in VB and HEX, you need the `h` after the hex number (5Ah)
### Pad
If you want fill the numbers with '0' (or ' ' for DEC) to have them aligned.  
For example a 0x5 will be converted to 0x05 with 8-bit numbers and to 0x0005 with 16-bit numbers
### Datatype
 - uint8_t for a 8 bit array
 - uint16_t for a 16 bit array
 - uint32_t for a 32 bit array
Array size is updated automatically. You can set it only if the file is divisible by this data type length.
### Columns
The quantity of numbers for each row. Set to 0 if you want all data on a single line.
### Skip Bytes
Bytes to skip. Sometimes you have some headers to remove. If so, set the number of bytes you want to remove from the file, before the array is generated.

## Image Settings
If you import an image, another settings box will appear. So you can do some image manipulations before create the binary array.
### Convert To
#### none
Image is converted like any other image
#### jpeg
Image is converted to a JPEG before converting it
#### png
Image is converted to a PNG before converting it
#### raw
Image is converted to a raw file. It means that every pixel is a integer written as array.  
Example: On a 240x240 display with 16bit, it creates an array of 240*240*2=115'200 bytes.  
It is a good option if you use an Arduino with a TFT, since you can output directly the data read by this array without converting it.
#### raw compressed
A simple compression method to group pixels with the same color.  
On Arduino, you can use the same TFT buffer and decompress it directly on the same buffer.  
A compressed RAW can be 20% to 60% smaller if the image is simple.
#### raw zip
The raw image will be zipped.  You need this library on Arduino: https://github.com/bitbank2/unzipLIB to unzip it.  
A zipped RAW can be 50% to 90% smaller if the image is simple. But you need more time to unzip it.  
### RGB
As RAW, you can choose if you want a 8-bit pixel (RGB332) or 16-bit pixel (RGB565).
### Quality
As JPEG, you can choose the quality of the image (1-100%). Normally for a jpeg this value is from 90 to 95.
### Level
As Zipped RAW, you can choose a compression level (1 to 9). A simple compression is faster to decompress but need more space.

## Credits
Zip on Javascript: https://github.com/Stuk/jszip