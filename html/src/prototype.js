// 文字列をUTF8の16進文字列に変換
function string_to_utf8_hex_string	(text)
{
    var bytes1 = string_to_utf8_bytes(text);
    var hex_str1 = bytes_to_hex_string(bytes1);
    return hex_str1;
}


// UTF8の16進文字列を文字列に変換
function utf8_hex_string_to_string	(hex_str1)
{
    var bytes2 = hex_string_to_bytes(hex_str1);
    var str2 = utf8_bytes_to_string(bytes2);
    return str2;
}

// 文字列をUTF8のバイト配列に変換
function string_to_utf8_bytes (text)
{
    var result = [];
    if (text == null)
        return result;
    for (var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (c <= 0x7f) {
            result.push(c);
        } else if (c <= 0x07ff) {
            result.push(((c >> 6) & 0x1F) | 0xC0);
            result.push((c & 0x3F) | 0x80);
        } else {
            result.push(((c >> 12) & 0x0F) | 0xE0);
            result.push(((c >> 6) & 0x3F) | 0x80);
            result.push((c & 0x3F) | 0x80);
        }
    }
    return result;
}

// バイト値を16進文字列に変換
function byte_to_hex (byte_num)
{
    var digits = (byte_num).toString(16);
    if (byte_num < 16) return '0' + digits;
    return digits;
}

// バイト配列を16進文字列に変換
function bytes_to_hex_string (bytes)
{
    var	result = "";

    for (var i = 0; i < bytes.length; i++) {
        result += byte_to_hex(bytes[i]);
    }
    return result;
}

// 16進文字列をバイト値に変換
function hex_to_byte (hex_str)
{
    return parseInt(hex_str, 16);
}

// バイト配列を16進文字列に変換
function hex_string_to_bytes (hex_str)
{
    var	result = [];

    for (var i = 0; i < hex_str.length; i+=2) {
        result.push(hex_to_byte(hex_str.substr(i,2)));
    }
    return result;
}

// UTF8のバイト配列を文字列に変換
function utf8_bytes_to_string (arr)
{
    if (arr == null)
        return null;
    var result = "";
    var i;
    while (i = arr.shift()) {
        if (i <= 0x7f) {
            result += String.fromCharCode(i);
        } else if (i <= 0xdf) {
            var c = ((i&0x1f)<<6);
            c += arr.shift()&0x3f;
            result += String.fromCharCode(c);
        } else if (i <= 0xe0) {
            var c = ((arr.shift()&0x1f)<<6)|0x0800;
            c += arr.shift()&0x3f;
            result += String.fromCharCode(c);
        } else {
            var c = ((i&0x0f)<<12);
            c += (arr.shift()&0x3f)<<6;
            c += arr.shift() & 0x3f;
            result += String.fromCharCode(c);
        }
    }
    return result;
}