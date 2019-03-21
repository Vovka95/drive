const db = {

}

const ui = {
    crElement: (isFolder, itemName) => {
        let div = document.createElement('div');
        let hintDiv = document.createElement('div');
        let p = document.createElement('p');

        let titleText = document.createTextNode(itemName);
        let hintText = document.createTextNode(itemName)
    
        div.appendChild(ui.createImgItem(isFolder));
        p.appendChild(titleText);
        div.appendChild(p);
        hintDiv.appendChild(hintText);
        div.appendChild(hintDiv);

        div.id = itemName;
        div.classList.add(isFolder ? 'data-folder' : 'data-file');

        div.addEventListener('contextmenu', ui.showContextMenu);
    
        ui.addElement(div);
    },

    addElement: (element) => {
        let fileList = document.getElementById('files-list');
    
        fileList.appendChild(element);
    
        return fileList;
    },

    createImgItem: (isFolder) => {
        let img = document.createElement('img');
        img.src = isFolder ? './images/folder-solid.svg' : './images/file-solid.svg';
        return img;
    },

    openCreateModal: (id, elType) => {
        let div = document.getElementById(id);
        let p = document.getElementById('descriptionPlaceholder');
    
        p.innerHTML = `Enter name of ${elType}:`;
    
        div.style.display = 'block';
    },

    closeCreateModal: (id) => {
        document.getElementById(id).style.display = 'none';
    },

    getContextMenu: () => {
       return document.getElementById('context-menu');
    },

    showContextMenu: (evt) => {
        evt.preventDefault();

        let contextMenu = ui.getContextMenu();

        contextMenu.style.left = evt.pageX + 'px';
        contextMenu.style.top = evt.pageY + 'px'; 
        contextMenu.style.display = 'block';
    },

    getInputValue: (sId) => {
		let inputValue = document.getElementById(sId).value;
		document.getElementById(sId).value = '';
		return inputValue;
	},

    getIsFolder: () => {
        let elType = document.getElementById('descriptionPlaceholder');

        return (elType.innerText.indexOf('folder') > 0);   
    }
}

const handler = {
    openCreateModal: (id, elType) => {
        ui.openCreateModal(id, elType);
    },

    closeCreateModal: (id) => {
        ui.closeCreateModal(id);
    },

    crElement: (id) => {
        ui.crElement(ui.getIsFolder(), ui.getInputValue('itemName'));
        ui.closeCreateModal(id);
    },
}

document.onclick = () => {
    ui.getContextMenu().style.display = 'none';
}
