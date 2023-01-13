# Conversion Settings

### Format
The number format in the output.
- HEX (Example: 0x3c, 0x21, 0x44, 0x4f, 0x43, 0x54, 0x59, ...)
- DEC (Example:  60,  33,  68,  79,  67,  84,  89, ...)
- BIN (Example: b00111100, b00100001, b01000100, b01001111, b01000011, b01010100, b01011001, ...)

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
