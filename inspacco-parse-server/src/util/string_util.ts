/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
(String.prototype as any).replaceAll = function(search, replacement) {
    const target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};