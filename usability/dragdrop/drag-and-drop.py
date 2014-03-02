# -*- coding: utf-8 -*-
"""
# Copyright (C) 2013

#  Distributed under the terms of the BSD License.  The full license is in
#  the file COPYING, distributed as part of this software. 

@author: juhasch
"""

""" 
Tornado web server to 
 push value received from Pyzmq pull messages
 to web browser using a webscocket connection 
 
 Configuration in ipython_notebook_config.py:
    c.DragDrop.port = 8901
  
"""                         

import time
import os.path
import sys, getopt

import numpy as np

import tornado.web
import tornado.websocket
import tornado.ioloop

import random
import json
import base64
from zmq.eventloop import ioloop, zmqstream

webport = 0
nb_dir = ''

GLOBALS={
    'sockets': []
}

# http://stackoverflow.com/questions/273192/check-if-a-directory-exists-and-create-it-if-necessary
def ensure_dir(f):
    d = os.path.dirname(f)
    if not os.path.exists(d):
        os.makedirs(d)
        
class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def open(self): 
        print "open socket"
        GLOBALS['sockets'].append(self)
        
    def on_close(self):
        print "on_close"
        GLOBALS['sockets'].remove(self)

    def on_message(self, message):
        x=json.loads(message)
        print "Data received"
        url = x['url']
        if len(url) == 0:
            print "Base64"
            filename =  x['name']
            print "Filename: %s" % filename
            
            path = nb_dir + u'\\' + x['path'] + u'\\images\\'
            print "Path: %s" %path

            ensure_dir(path)
            png_b64 = x['data']
            data = png_b64.split(',') # [0] is header, [1] b64 data
            png = base64.b64decode(data[1])
            print "Filename: %s" % filename
            f = open(path+filename, 'wb')
            f.write(png)
            f.close()
            status = "OK"
            reply = {"status": status, "name": 'images/'+filename }
            self.write_message(reply)             
        else:
            print "Url:", url
            status = "OK"
            reply = {"status": status, "name": url }
            self.write_message(reply) 
 
application = tornado.web.Application([
    (r"/websocket", WebSocketHandler),
])


def main(argv):
    global webport, nb_dir
    #try:
    opts, args = getopt.getopt(argv,"hp:d:",["port=","directory="])
    if opts == []:
        print 'drag-and-drop.py -p <port> -d <directory>'
        sys.exit(2)

    for opt, arg in opts:
        if opt == '-h':
            print 'drag-and-drop.py -p <port> -d <directory>'
            sys.exit()
        elif opt in ("-p", "--port"):
            webport = int(arg)
        elif opt in ("-d", "--directory"):
            nb_dir = arg


    print 'webport is "', webport
    print 'notebook directory is "', nb_dir

    if webport < 1000 or webport > 65535:
        print('Illegal webport adress %d' % webport)
        sys.exit(2)

    if not os.path.exists(nb_dir):
        print('Directory %s does not exist' % nb_dir)
        sys.exit(2)

    ioloop.install()
    application.listen(webport)
    main_loop = tornado.ioloop.IOLoop.instance()
    main_loop.start()

if __name__ == "__main__":
    main(sys.argv[1:])



