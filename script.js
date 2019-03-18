const crElement = (isFolder) => {
    console.log('createElement');
    let div = document.createElement('div');
    let img = document.createElement('img');

    img.src = createImgItem(isFolder);

    div.classList.add(isFolder ? 'data-folder' : 'data-file');
    div.appendChild(img);

    addElement(div);
}

const addElement = (element) => {
    console.log('addElement');
    let fileList = document.getElementById('files-list');

    fileList.appendChild(element);

    return fileList;
}

const createImgItem = (isFolder) => {
    console.log('choose img');
    return isFolder ? './images/folder-solid.svg' : './images/file-solid.svg';
}