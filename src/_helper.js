/**
 * Created by yixi on 4/7/16.
 */

// const whitespace = '[\\x20\\t\\r\\n\\f]';
// let rtrim = new RegExp('^' + whitespace + '+|((?:^|[^\\\\])(?:\\\\.)*)' + whitespace + '+$', 'g');
// let rnotwhite = /\S+/g;
// let rclass = /[\t\r\n\f]/g;

// let stylePropertyMapping = {
//     float: ('styleFloat' in document.createElement('div').style) ? 'styleFloat' : 'cssFloat'
// };
// const REG_EXP_CAMELIZE = /\-[a-z]/g;
// let camelize = (str) => {
//     return str.replace(REG_EXP_CAMELIZE, (match) => {
//         return match.charAt(1).toUpperCase();
//     });
// };
let isWindow = (obj) => obj !== null && obj === obj.window;
let getWindow = (ele) => isWindow(ele) ? ele : ele.nodeType === 9 && ele.defaultView;
// let nodeName = (ele, name) => ele.nodeName && ele.nodeName.toLowerCase() === name.toLowerCase();

export default {
    getOffset(element) {
        let doc = element && element.ownerDocument;
        let box = {top: 0, left: 0};
        let docElement;
        let win;
        if (!doc) {
            return null;
        }
        docElement = doc.documentElement;

        if (typeof element.getBoundingClientRect !== (typeof undefined)) {
            box = element.getBoundingClientRect();
        }

        win = getWindow(doc);

        return {
            top: box.top + win.pageYOffset - docElement.clientTop,
            left: box.left + win.pageXOffset - docElement.clientLeft,
            width: box.width,
            height: box.height
        };
    }
}
