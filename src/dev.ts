import fs from 'fs';
import Vue from 'vue';
import { titleCase } from 'title-case';

import { BibEntry, VenueDB } from './bib';
import { quicktex } from './latex';

import bib from '../data/bib.json';
import '../w/site.css';

const VENUES_FN = 'data/venues.json',
      ABSTRACTS_FN = 'data/abstracts.json';

var db = {abstracts: {} as {[key: string]: string},
          venues: {} as {[key: string]: BibEntry.Venue}};


function main() {
    
    Object.assign(window, {tog, quicktex, save, exportHtml});

    load();

    var moreBib = BibEntry.parseBibFile('data/bib.bib');
    moreBib = new VenueDB(db.venues).normalizeEntries(moreBib);
    bib.unshift(...moreBib.reverse());

    //db.abstracts['ICFP2021'] =
    //    quicktex(fs.readFileSync('data/abstract.tex', 'utf-8')).innerHTML;

    Vue.createApp({
        data: () => ({me: 'shachari', bib}),
        methods: {
            bibKey,
            titleCase,
            getAbstract(bib) {
                return db.abstracts[bibKey(bib)];
            },
            getPdf(bib) {}
        }
    }).mount('#main');
}

function load() {
    db.abstracts = JSON.parse(fs.readFileSync(ABSTRACTS_FN, 'utf-8'));
    db.venues = JSON.parse(fs.readFileSync(VENUES_FN, 'utf-8'));
}

function save() {
    fs.writeFileSync(ABSTRACTS_FN, JSON.stringify(db.abstracts, null, '  '));
}

function bibKey(bibentry) {
    if (bibentry.key) return bibentry.key;
    var e = bibentry.in;
    return (e.conf || e.journal) + e.year;
}

function exportHtml() {
    var u = document.firstElementChild.cloneNode(true) as HTMLElement;
    for (let s of u.querySelectorAll('script')) s.remove();
    for (let s of u.querySelectorAll('link')) s.remove();
    var h = u.querySelector('head');

    var extra = new DOMParser().parseFromString(`
        <link href="site.css" rel="stylesheet" type="text/css">
        <script src="site.js"></script>
    `, 'text/html');
    for (let inject of [...extra.head.children]) {
        console.log(inject);
        h.appendChild(inject);
    }

    fs.writeFileSync('w/exported.html', u.outerHTML);
    return u.outerHTML;
}

function tog(id) {
    var elt = document.getElementById(id);
    if (elt.style.display == "none")
        elt.style.display = "block";
    else
        elt.style.display = "none";
}


document.addEventListener("DOMContentLoaded", main);
