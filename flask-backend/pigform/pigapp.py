from app import create_app
from gevent.pywsgi import WSGIServer
from gevent import monkey
monkey.patch_all()

app = create_app()
httpServer = WSGIServer(('127.0.0.1',5000),application=app)

if __name__ == '__main__':
    httpServer.serve_forever()




