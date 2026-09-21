#!/usr/bin/env python3
"""HTTP server with Range request support for video streaming."""
import os
import mimetypes
import socket
import urllib.parse
import posixpath
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SERVE_DIR = os.path.dirname(os.path.abspath(__file__))

MIME_OVERRIDES = {
    '.webm': 'video/webm',
    '.mp4': 'video/mp4',
    '.ogg': 'video/ogg',
    '.ogv': 'video/ogg',
}


class VideoRequestHandler(BaseHTTPRequestHandler):

    def do_HEAD(self):
        self._handle_request(head_only=True)

    def do_GET(self):
        self._handle_request(head_only=False)

    def _handle_request(self, head_only=False):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            path = os.path.join(path, 'index.html')

        if not os.path.exists(path):
            self.send_error(404)
            return

        file_size = os.path.getsize(path)
        ext = os.path.splitext(path)[1].lower()
        content_type = MIME_OVERRIDES.get(ext) or mimetypes.guess_type(path)[0] or 'application/octet-stream'
        range_header = self.headers.get('Range')

        if range_header and '=' in range_header:
            try:
                range_val = range_header.split('=', 1)[1]
                start_str, end_str = range_val.split('-')
                start = int(start_str) if start_str else 0
                end = int(end_str) if end_str else file_size - 1

                if start >= file_size or end >= file_size:
                    try:
                        self.send_response(416)
                        self.send_header('Content-Type', content_type)
                        self.send_header('Content-Range', f'bytes */{file_size}')
                        self.send_header('Accept-Ranges', 'bytes')
                        self.end_headers()
                    except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError, OSError):
                        pass
                    return

                start = max(0, min(start, file_size - 1))
                end = max(start, min(end, file_size - 1))
                length = end - start + 1

                self.send_response(206)
                self.send_header('Content-Type', content_type)
                self.send_header('Content-Length', str(length))
                self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                self.send_header('Accept-Ranges', 'bytes')
                self.end_headers()

                if not head_only:
                    self._send_file(path, start, length)
            except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError, OSError):
                pass
            return

        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(file_size))
        self.send_header('Accept-Ranges', 'bytes')
        self.end_headers()

        if not head_only:
            self._send_file(path, 0, file_size)

    def _send_file(self, path, offset, length):
        try:
            with open(path, 'rb') as f:
                f.seek(offset)
                remaining = length
                while remaining > 0:
                    chunk = f.read(min(65536, remaining))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
        except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError, OSError):
            pass

    def translate_path(self, path):
        path = path.split('?', 1)[0].split('#', 1)[0]
        path = posixpath.normpath(urllib.parse.unquote(path))
        words = path.split('/')
        words = filter(None, words)
        result = SERVE_DIR
        for word in words:
            result = os.path.join(result, word)
        return result

    def log_message(self, format, *args):
        msg = format % args
        if any(x in msg for x in ['.map', 'favicon', 'devtools', 'appspecific']):
            return
        super().log_message(format, *args)


class VideoHTTPServer(ThreadingHTTPServer):
    """Многопоточный сервер: видео с Range-запросами не блокирует отдачу страницы.

    Браузер держит по несколько одновременных соединений на видео, поэтому
    однопоточного HTTPServer не хватает — остальные запросы просто зависали.
    """

    daemon_threads = True
    allow_reuse_address = True


class DualStackHTTPServer(VideoHTTPServer):
    """Один сокет и для IPv4, и для IPv6.

    Нужен, потому что Windows/Chrome часто резолвят 'localhost' в '::1',
    а сервер на '' слушал только IPv4 — браузер не мог подключиться.
    """

    address_family = socket.AF_INET6

    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()


def create_server(port=8080):
    try:
        return DualStackHTTPServer(('::', port), VideoRequestHandler), 'localhost и 127.0.0.1'
    except OSError:
        # IPv6 недоступен или порт занят IPv4-сокетом — работаем только на IPv4.
        return VideoHTTPServer(('0.0.0.0', port), VideoRequestHandler), '127.0.0.1'


if __name__ == '__main__':
    httpd, addresses = create_server()
    print("Server running at http://localhost:8080  (%s)" % addresses)
    print("Serving directory:", SERVE_DIR)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
