import os

deployed_files = ["*"] #os.listdir('w')

for fn in deployed_files:
    os.system('scp -r w/%(filename)s %(username)s@%(hostname)s:public_html'
              % dict(filename=fn, 
                     username='shachari', hostname='login.csail.mit.edu'))
