
const MACROS = ['emph', 'textit', 'textbf', 'item', 'eg'],
    MACRO_TEXT = {
        'eg': 'e.g.',
        'item': '◦'
    };

function quicktex(tex: string) {
    var t = tex.replace(/%.*\n/g, '');

    var div = document.createElement('div');
    for (let para of t.split(/\s*\n\s*\n\s*/)) {
        para = para.trim();
        if (para) div.append(aux(para));
    }

    return div;

    function aux(t: string) {
        var pos = 0, p = document.createElement('p'),
            mkText = (s: string) => document.createTextNode(s);

        for (let mo of t.matchAll(/\\(\w+)(?:\{(.*?)\})?/g)) {
            p.append(mkText(t.slice(pos, mo.index)));
            if (MACROS.includes(mo[1])) {
                var span = document.createElement('span');
                span.classList.add(mo[1]);
                span.textContent = mo[2] || MACRO_TEXT[mo[1]] || '';
                p.append(span);
            }
            pos = mo.index + mo[0].length;
        }
        p.append(mkText(t.slice(pos)));
        return p;
    }
}

export { quicktex }