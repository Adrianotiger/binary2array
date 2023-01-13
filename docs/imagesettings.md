# Image Settings
If you import an image, another settings box will appear. So you can do some image manipulations before create the binary array.

## Convert To
### none
Image is converted like any other file
### jpeg
Image is converted to a JPEG before converting it
### png
Image is converted to a PNG before converting it
### raw
Image is converted to a raw file. It means that every pixel is a integer written as array.  
Example: On a 240x240 display with 16bit, it creates an array of 240*240*2=115'200 bytes.  
It is a good option if you use an Arduino with a TFT, since you can output directly the data read by this array without converting it.
### raw compressed
A simple compression method to group pixels with the same color.  
On Arduino, you can use the same TFT buffer and decompress it directly on the same buffer.  
A compressed RAW can be 20% to 60% smaller if the image is simple.
### raw zip
The raw image will be zipped.  You need this library on Arduino: https://github.com/bitbank2/unzipLIB to unzip it.  
A zipped RAW can be 50% to 90% smaller if the image is simple. But you need more time to unzip it.  

## RGB
As RAW, you can choose if you want a 8-bit pixel (RGB332) or 16-bit pixel (RGB565).

## Quality
As JPEG, you can choose the quality of the image (1-100%). Normally for a jpeg this value is from 90 to 95.

## Level
As Zipped RAW, you can choose a compression level (1 to 9). A simple compression is faster to decompress but need more space.
