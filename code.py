import http.server
import socketserver
import os
import requests
import uuid
from io import BytesIO

PORT = 8000
DIRECTORY = "."

class SimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/upload':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            boundary = self.headers['Content-Type'].split("boundary=")[1].encode()
            parts = post_data.split(boundary)
            file_data = None

            for part in parts:
                if b'Content-Disposition: form-data; name="file"' in part:
                    file_start = part.find(b'\r\n\r\n') + 4
                    file_end = part.find(b'\r\n--', file_start)
                    file_data = part[file_start:file_end]

            if file_data:
                # Salva o arquivo enviado
                image_path = os.path.join('uploads', 'uploaded_image.jpg')
                os.makedirs(os.path.dirname(image_path), exist_ok=True)
                
                with open(image_path, 'wb') as f:
                    f.write(file_data)

                # Chame a função para upload e processamento aqui
                try:
                    asset_id = _upload_asset(BytesIO(file_data), "Input Image")
                    # Redireciona para a página de resultados
                    self.send_response(302)
                    self.send_header('Location', '/result')  # Atualize conforme necessário
                    self.end_headers()

                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(bytes(str(e), 'utf-8'))
            else:
                self.send_response(400)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'No file uploaded')
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        if self.path == '/result':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<html><body><h1>Upload bem-sucedido!</h1></body></html>')
        else:
            super().do_GET()

def _upload_asset(input_file, description):
    """
    Uploads an asset to the NVCF API.
    :param input_file: The file object to upload
    :param description: A description of the asset
    :return: UUID of the uploaded asset
    """
    assets_url = "https://api.nvcf.nvidia.com/v2/nvcf/assets"
    header_auth = "Bearer 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"

    headers = {
        "Authorization": header_auth,
        "Content-Type": "application/json",
        "accept": "application/json",
    }

    s3_headers = {
        "x-amz-meta-nvcf-asset-description": description,
        "content-type": "image/jpeg",
    }

    payload = {"contentType": "image/jpeg", "description": description}
    response = requests.post(assets_url, headers=headers, json=payload, timeout=30)
    response.raise_for_status()

    asset_url = response.json()["uploadUrl"]
    asset_id = response.json()["assetId"]

    response = requests.put(asset_url, data=input_file, headers=s3_headers, timeout=300)
    response.raise_for_status()
    return uuid.UUID(asset_id)

def run(server_class=http.server.HTTPServer, handler_class=SimpleHTTPRequestHandler):
    server_address = ('', PORT)
    httpd = server_class(server_address, handler_class)
    print(f'Servidor rodando em http://localhost:{PORT}')
    httpd.serve_forever()

if __name__ == "__main__":
    run()
