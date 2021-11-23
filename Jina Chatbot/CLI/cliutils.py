## CLI UTILS AHEAD ----->>>>>>>


import os
import requests
from time import sleep
# from untils.utils import datafile
datafile = 'path_to_dataFile'

def clear_everything():
    os.system('cls' if os.name == 'nt' else 'clear')

def type_writer_anim(textBlob):
    for char in textBlob:
        print(char, end="", flush=True)
        sleep(0.02)



def get_ans(text):

    
    headers = {
        'Content-Type': 'application/json',
    }

    data = '{"top_k":1,"mode":"search","data":["' + text + '"]}'

    response = requests.post(
        'http://0.0.0.0:34567/search', headers=headers, data=data)

    res = response.json()
    # print(res)
    return_text = res["data"]['docs'][0]['matches'][0]['tags']['ans']
   
    
    print('\n')
    type_writer_anim(return_text)
    