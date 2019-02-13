import requests

r = requests.post('http://127.0.0.1:3000/bme_sensor', data = {'temperature':'20.78', 'humidity': '43.34', 'pressure': '1134.98'})