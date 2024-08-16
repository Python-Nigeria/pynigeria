from pathlib import Path
import shutil
import sys

default = 'C:/Users/User/'

def copyFolder(repeat=False):
    pathInput = input('path of folder you want to copy')
    if pathInput == '':
        print('path of folder is required')
        return None
    path = default + pathInput.strip()
    default_name = 'My Folder'
    if repeat:
        b=repeat
    else:
        destination = input('Enter Destination: ')
        b = default + destination.strip()
    name = input(f'Enter directory name, default is {default_name}:  ')
    b = Path(b)
    if name:
        dest = str(b) + '/' + name
    else:
        dest = str(b) + '/' + default_name
    try:
        print('creating..')
        shutil.copytree(path,dest)
        print('Folder created successfully')
    except FileExistsError:
        print('Folder already exist,kindly change name')
        reactTemplate(repeat=b)        
    return None


def createFolder():
    print('Stater Loading')
    path = input('path default path is current path ')
    inputFolder = input('Type folder to create, seperate each folder with comma')
    if inputFolder:
        folders_to_create = inputFolder.split(',')
    else:
        folders_to_create = ['static','template','media']
    
    if path:
        base = Path(default+path)
    else: 
        base = Path(__file__).resolve().parent.parent

    for folder in folders_to_create:
        folder_path = base / folder
        folder_path.mkdir(parents=True,exist_ok=True)
        print(f'{folder} created successfully')

    return None

if len(sys.argv) > 1:
    if sys.argv[1] == 'createFolder':
        createFolder()
    elif sys.argv[1] == 'copyFolder':
        copyFolder()
    else:
        print('invalid option')
else:
    print('coming soon')