// The browser will ignore tabs and repeated spaces in paragraph blocks
// so we replace them with non-breaking-space characters
export function indentWithNBS(str: string):  string {
    const fakeTab = "\u00A0".repeat(4);
    
    str = str.replace(/\t/g, fakeTab);
    str = str.replace(/    /g, fakeTab);
    return str;
}