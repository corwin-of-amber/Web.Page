import fs from 'fs';
import bibtexParse from '@orcid/bibtex-parse-js';


class BibEntry {
    key?: string
    title: string
    authors: string[]
    in: BibEntry.Venue

    setAuthors(authors: string | string[]) {
        if (typeof authors === 'string')
            authors = authors.split(/\sand\s/);
        this.authors = authors.map(x => this.cleanup(x));
    }

    cleanup(s: string) {
        return s.trim().replace(/[{}]/g, '').replace(/\n\s*/g, ' ');
    }

    _upto(s: string, term: string) {
        var idx = s.indexOf(term);
        return idx > 0 ? s.slice(0, idx) : s;
    }

    _upfrom(s: string, term: string) {
        var idx = s.indexOf(term), l = term.length;
        return (idx >= 0 && idx + l < s.length) ? s.slice(idx + l) : s;
    }

    setVenue(venue: BibEntry.Venue) {
        var v;
        if (v = venue.conf) {
            var w = this.extractMonth(this._upfrom(v, '' + venue.year));
            if (w) venue.month = w;
            v = this.cleanup(v);
            if (venue.year) v = this._upto(v, '' + venue.year);
            venue.conf = v;
        }
        if (v = venue.journal) {
            venue.journal = this.cleanup(v);
        }
        this.in = venue;
    }

    extractMonth(s: string) {
        let M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            hasWord = (s: string, w: string) => new RegExp(`\\b${w}\\b`, 'i').exec(s);
        for (var m of M) {
            if (hasWord(s, m) || hasWord(s, m.slice(3))) return m;
        }
        return undefined;
    }

    static parseBibFile(filename: string) {
        return BibEntry.parseBib(fs.readFileSync(filename, 'utf-8'));
    }

    static parseBib(content: string) {
        return bibtexParse.toJSON(content)
            .map((e: ParsedBibEntry) => BibEntry.fromParsed(e));
    }

    /**
     * imports data returned from `@orcid/bibtex-parse-js`.
     * @param json 
     */
    static fromParsed(json: ParsedBibEntry) {
        var b = new BibEntry, tags = json.entryTags, v: string;
        if (v = json.citationKey) b.key = v;
        if (v = tags.title) b.title = b.cleanup(v);
        if (v = tags.author) b.setAuthors(v);
        var in_: BibEntry.Venue = {};
        if (v = tags.booktitle) in_.conf = v;
        if (v = tags.journal) in_.journal = v;
        if (v = tags.year) in_.year = v;
        if (v = tags.month) in_.month = v;
        if ((v = tags.number) && !v.match(/^\d/)) in_.sub = v;
        if (Object.keys(in_).length > 0)
            b.setVenue(in_);
        return b;
    }
}

namespace BibEntry {

    export type Venue = {
        journal?: string
        conf?: string
        long?: string
        year?: string | number
        month?: string
        sub?: string
    }
}

type ParsedBibEntry = {
    citationKey?: string,
    entryTags: {[tag: string]: string}
    entryType: string
}


class VenueDB {
    entries: {[name: string]: BibEntry.Venue}

    constructor(entries: {[name: string]: BibEntry.Venue}) {
        this.entries = entries;
    }

    normalize(venue: BibEntry.Venue) {
        for (let [k,v] of Object.entries(this.entries)) {
            var re = new RegExp(`\\b${k}\\b`);
            for (let part of [venue.conf, venue.journal, venue.sub]) {
                if (part && re.exec(part))
                    return Object.assign(venue, v);
            }
        }
        return venue;
    }

    normalizeEntry(bibEntry: BibEntry) {
        if (bibEntry.in) bibEntry.in = this.normalize(bibEntry.in);
        return bibEntry;
    }

    normalizeEntries(bibEntries: BibEntry[]) {
        return bibEntries.map(e => this.normalizeEntry(e));
    }
}


export { BibEntry, ParsedBibEntry, VenueDB }