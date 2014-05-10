# -*- coding: utf-8 -*-
"""
# Copyright (C) 2014
# Distributed under the terms of the BSD License.
"""

""" 
Tornado websocket server to save images received from web browser and reply 
with URL of stored image.
This is required for drag&drop of images in the IPython notebook
 
The websocket port can be configured in ipython_notebook_config.py:
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
import hashlib
from multiprocessing import Process
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

def md5sum(fname, block_size=2**20):
    f = open(fname, 'rb')
    md5 = hashlib.md5()
    while True:
        data = f.read(block_size)
        if not data:
            break
        md5.update(data)
    f.close()
    return md5.hexdigest()

class WebSocketHandler(tornado.websocket.WebSocketHandler):
    """ Handle websocket connections from web browser 
    """
    def open(self): 
        GLOBALS['sockets'].append(self)
        
    def on_close(self):
        GLOBALS['sockets'].remove(self)

    def on_message(self, message):
        """ Receive image from web browser
            Save it to the local 'images' directory under it's name.
            If filename already exists, md5-check if identical, otherwise rename.
            If no filename is given, create unique ID.
        """
        x=json.loads(message)
        url = x['url']
        eventtype = x['type']

        if eventtype == 'file':
            filename =  x['name']
            path = nb_dir + u'\\' + x['path'] + u'\\images\\'
            ensure_dir(path)
            data = x['data'].split(',') # [0] is header, [1] b64 data
            png = base64.b64decode(data[1])
            # check if file exists: skip if identical, rename if new
            if os.path.exists(path+filename):
#                print('File %s already exists' % filename)
                # compare md5sum
                md5_file = md5sum(path+filename)
                d = hashlib.md5()
                d.update(png)
                md5_websocket = d.hexdigest()
                if md5_file != md5_websocket:
                    i = 0
                    while True:
                        if not os.path.exists('%s%0d_%s' % (path, i, filename)):
                            break  
                    filename = '%0d_%s' % (i, filename)
                    f = open(path+filename, 'wb')
                    f.write(png)
                    f.close()
            else:
                f = open(path+filename, 'wb')
                f.write(png)
                f.close()
            status = "OK"
            #reply = {"status": status, "name": 'images/' + filename }
            # send url instead of file path, otherwise it won't work for nbconvert
            url_path = url + '/notebooks' + x['path'] + '/images/' + filename
            reply = {"status": status, "name": url_path}
            self.write_message(reply)             
        else:
            # just reply already existing url 
            status = "OK"
            reply = {"status": status, "name": url }
            self.write_message(reply) 
 
application = tornado.web.Application([
    (r"/websocket", WebSocketHandler),
])


def websocket_server(webport, nbdir):
    global nb_dir
    nb_dir = nbdir
    ioloop.install()
    try:
        application.listen(webport)
    except:
#        print('Port %d already in use!' % webport)
        sys.exit(2)
    main_loop = tornado.ioloop.IOLoop.instance()
    main_loop.start()


def start_server(webport,nb_dir):
    print('webport is %s' % webport)
    print('notebook directory is %s' % nb_dir)

    if webport < 1000 or webport > 65535:
        print('Illegal webport adress %d' % webport)
        sys.exit(2)

    if not os.path.exists(nb_dir):
        print('Directory %s does not exist' % nb_dir)
        sys.exit(2)

    p = Process(target=websocket_server, args=(webport,nb_dir))
    p.start()
