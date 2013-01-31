import os

deployed_files = ["*"] #os.listdir('w')

for fn in deployed_files:
    os.system('scp -r w/%(filename)s %(username)s@%(hostname)s:html'
              % dict(filename=fn, 
                     username='shachar', hostname='nova.cs.tau.ac.il'))
