<template>
  <div>
    <template v-for="e in bib">
      <p><b>
        {{titleCase(e.title)}}</b>{{e.remark}}
        <span class="side-links">
          <!-- toggle should work in PLAIN HTML (when exported), which is why `onclick` is used here -->
          <a v-if="getAbstract(e)" :onclick="`tog('abstract-${bibKey(e)}'); return false`" href="#">Abstract</a>&nbsp;
          <a v-if="getPdf(e)" href="dl/onward2016.pdf">PDF</a>
        </span>
        <br/>
        <template v-for="(a,$i) in e.authors">
          {{$i > 0 ? ', ' : ''}}{{a}}
        </template>.
        <i v-if="e.in">In {{e.in.conf || e.in.journal}} {{e.in.year}}
          <template v-if="e.in.long">
            ({{e.in.long}}<!--
            --><template v-if="e.in.place">, {{e.in.place}}</template><!--
            --><template v-if="e.in.year">, {{e.in.month}} {{e.in.year}}</template>)
          </template>
        </i>
      </p>
      <div :id="`abstract-${bibKey(e)}`" v-if="getAbstract(e)"
           class="abstract" style="display: none;" v-html="getAbstract(e)">
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, toNative } from 'vue-facing-decorator';
import { titleCase } from 'title-case';

import type { DB } from '../dev';


@Component
class IPub extends Vue {
    me = 'shachari'
    bib = undefined

    db: DB = undefined

    bibKey(bibentry) { return bibKey(bibentry); }
    titleCase(s) { return titleCase(s); }

    getAbstract(bib) {
        return this.db.abstracts[bibKey(bib)];
    }
    getPdf(bib) { return undefined;  /** @todo */ }
}

function bibKey(bibentry) {
    if (bibentry.key) return bibentry.key;
    var e = bibentry.in;
    return (e.conf || e.journal) + e.year;
}

export { IPub }
export default toNative(IPub)
</script>