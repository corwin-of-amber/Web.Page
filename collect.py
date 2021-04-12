"""
Locates all downloads across the multiverse.
"""

import re
import os
import zipfile
from filesystem.search.locate import SpotlightLocate



def get_dl(html_fn):
    html = open(html_fn).read().decode('utf-8')
    pat = re.compile(r'"dl/(.*?)"', re.MULTILINE)
    return pat.findall(html)


if __name__ == '__main__':
    sl = SpotlightLocate()
    sl.mdfind_args += ['-onlyin', os.environ["HOME"]]
    sl.filters += [lambda fn: "/Library/" not in fn]   # might catch some mail attachments
    
    z = zipfile.ZipFile("tmp-dl.zip", "w", zipfile.ZIP_DEFLATED)
    
    for dl_fn in get_dl("w/index.html"):
        print "%-25s" % dl_fn,
        try:
            ul_fn = sl(dl_fn)
            print ul_fn
            z.write(ul_fn, "dl/%s" % dl_fn)
        except sl.FileNotFound:
            print "* missing *"

    z.close()
    