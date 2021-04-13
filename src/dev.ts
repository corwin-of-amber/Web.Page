import fs from 'fs';
import Vue from 'vue';

import { BibEntry } from './bib';

import bib from '../data/bib.json';
import abstracts from '../data/abstracts.json';
import '../w/site.css';




function main() {
    var moreBib = BibEntry.parseBibFile('data/bib.bib');

    console.log(moreBib);
    Object.assign(window, {tog});

    bib.unshift(...moreBib.reverse());

    Vue.createApp({
        data: () => ({me: 'shachari', bib}),
        methods: {
            bibKey,
            getAbstract(bib) {
                return abstracts[bibKey(bib)];
            },
            getPdf(bib) {}
        }
    }).mount('#main');
}

function bibKey(bibentry) {
    var e = bibentry.in;
    return (e.conf || e.journal) + e.year;
}

function tog(id) {
    var elt = document.getElementById(id);
    if (elt.style.display == "none")
        elt.style.display = "block";
    else
        elt.style.display = "none";
}


document.addEventListener("DOMContentLoaded", main);
