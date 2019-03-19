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

    getInputValue: (sId) => {
		let inputValue = document.getElementById(sId).value;
		document.getElementById(sId).value = '';
		return inputValue;
	},

    getIsFolder: () => {
        let elType = document.getElementById('descriptionPlaceholder');

        return (elType.innerText.indexOf('folder') > 0) ? true : false;   
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
    }
}
