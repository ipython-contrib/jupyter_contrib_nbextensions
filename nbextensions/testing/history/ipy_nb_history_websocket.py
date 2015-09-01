# -*- coding: utf-8 -*-
"""
Created on Tue Apr 09 09:45:06 2013

@author: Juergen Hasch, python@elbonia.de

Distributed under the terms of the BSD License. 
"""

""" 
Tornado websocket server
Store cell text under unique id in dict
*This is a proof of concept only*

TODO:
    - multiple connects
    - persistent storage
"""                         

import time
import os.path

import numpy as np

import tornado.web
import tornado.websocket
import tornado.ioloop

import random
import json

from zmq.eventloop import ioloop, zmqstream

pushaddress = "tcp://127.0.0.1:5555"
webport = 8889 # port address for web client
 
GLOBALS={
    'sockets': []
}
 
 
HISTORY= {}
POSITION = {}
 
class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):      
        GLOBALS['sockets'].append(self)
        
    def on_close(self):
        GLOBALS['sockets'].remove(self)

    def on_message(self, message):
#        print 'message received %s' % message
        x=json.loads(message)
        id = x['id']
        if ('action' in x.keys()) and ( id in POSITION.keys()) :
            if x['action'] == 'forward':
                idx = POSITION[id]
                imax = len(HISTORY[id])
                if idx < (imax-1):
                    idx += 1
                    POSITION[id] = idx
                    reply_str = HISTORY[id][idx]
                    reply = {"text": reply_str, "id" : id, "idx" : idx, "imax": imax }
                    self.write_message(json.dumps(reply))
            elif x['action'] == 'back':
                idx = POSITION[id]
                imax = len(HISTORY[id])
                if idx > 0:
                    idx -= 1  
                    POSITION[id] = idx
                    reply_str = HISTORY[id][idx]
                    reply = {"text": reply_str, "id" : id, "idx" : idx, "imax": imax }
                    self.write_message(json.dumps(reply))
            elif x['action'] == 'latest':
                if HISTORY.has_key(id):
                    imax = len(HISTORY[id])
                    idx = imax-1
                    POSITION[id] = idx
                    reply_str = HISTORY[id][idx]
                    reply = {"text": reply_str, "id" : id, "idx" : idx, "imax": imax }
                    self.write_message(json.dumps(reply))
        if 'text' in x.keys():
            # push in list
            if HISTORY.has_key(id):
                HISTORY[id].append(x['text'])
                POSITION[id] = len(HISTORY[id])-1
            else:
                HISTORY[id] = [x['text']]
                POSITION[id] = 0
 
application = tornado.web.Application([
    (r"/websocket", WebSocketHandler),
])
 
if __name__ == "__main__":
    
    application.listen(webport)
    main_loop = tornado.ioloop.IOLoop.instance()
    main_loop.start()

