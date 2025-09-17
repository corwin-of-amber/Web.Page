import fs from 'fs';
import Vue from 'vue';

import { FileStore } from './infra/store';
import Pub, { IPub } from './components/pub.vue';
import { BibEntry, VenueDB } from './bib';
import { quicktex } from './latex';

import bib from '../data/bib.json';
import '../w/site.css';


function main() {
    Object.assign(window, {tog, quicktex, exportHtml});

    let db = new DB();
    db.load();

    var moreBib = BibEntry.parseBibFile('data/bib.bib');
    moreBib = new VenueDB(db.venues).normalizeEntries(moreBib);
    bib.unshift(...moreBib.reverse());

    if (false)
        db.abstracts['PLDI2023'] =
            quicktex(fs.readFileSync('data/abstract.tex', 'utf-8')).innerHTML;

    let pub = Vue.createApp(Pub).mount('#publications') as IPub;
    pub.bib = bib;
    pub.db = db;
    Object.assign(window, {pub, db});
}


class DB {
    abstracts: {[key: string]: string} = {}
    venues: {[key: string]: BibEntry.Venue} = {}

    store = {
        abstracts: new FileStore('data/abstracts.json', JSON),
        venus: new FileStore('data/venues.json', JSON)
    }

    load() {
        this.abstracts = this.store.abstracts.load();
        this.venues = this.store.venus.load();
    }

    save() {
        this.store.abstracts.save(this.abstracts);
    }
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

export { DB }