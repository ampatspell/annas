import io
import os
import socket
from string import Template
from threading import Condition
import tornado.ioloop
import tornado.web
import tornado.websocket
from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import Output

serverPort = 3001
framerate = 30

picam2 = Picamera2()
picam2.configure(picam2.create_video_configuration(main={"size": (1920, 1080)}))

class StreamingOutput(Output):
    def __init__(self):
        super().__init__()
        self.loop = None
        self.buffer = io.BytesIO()

    def setLoop(self, loop):
        self.loop = loop

    def outputframe(self, frame, keyframe=True, timestamp=None, packet=None, audio=None):
        self.buffer.write(frame)
        if self.loop is not None and wsHandler.hasConnections():
            self.loop.add_callback(callback=wsHandler.broadcast, message=self.buffer.getvalue())
        self.buffer.seek(0)
        self.buffer.truncate()


class wsHandler(tornado.websocket.WebSocketHandler):
    connections = []

    def open(self):
        self.connections.append(self)

    def on_close(self):
        self.connections.remove(self)

    def on_message(self, message):
        pass

    @classmethod
    def hasConnections(cl):
        if len(cl.connections) == 0:
            return False
        return True

    @classmethod
    async def broadcast(cl, message):
        for connection in cl.connections:
            try:
                await connection.write_message(message, True)
            except tornado.websocket.WebSocketClosedError:
                pass
            except tornado.iostream.StreamClosedError:
                pass

    def check_origin(self, origin):
        return True

requestHandlers = [
    (r"/", wsHandler),
]

try:
    output = StreamingOutput()
    encoder = H264Encoder(repeat=True, framerate=framerate, qp=23)
    encoder.output = output
    picam2.start_recording(encoder, output)

    application = tornado.web.Application(requestHandlers)
    application.listen(serverPort)
    loop = tornado.ioloop.IOLoop.current()
    output.setLoop(loop)
    loop.start()
except KeyboardInterrupt:
    picam2.stop_recording()
    loop.stop()
