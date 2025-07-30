import requests
import json
url = "http://localhost:3000/api/product"

payload = { "barcode" : "0065633158184" }

headers = {"Content-type": "application/json"}

response = requests.delete(url, data=json.dumps(payload), headers = headers)
print(response)
