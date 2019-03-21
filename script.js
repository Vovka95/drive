const db = {
    data: {},

    getData: () => {
        return db.data;
    },

    addElement: (IsFolder, itemName) => {
		let data = db.getData();
		data[itemName] = IsFolder ? {} : '';
	}
}

const ui = {
    openCreateModal: (id, elType) => {
        let div = document.getElementById(id);
        let p = document.getElementById('descriptionPlaceholder');
    
        p.innerHTML = `Enter name of ${elType}:`;
    
        div.style.display = 'block';
    },

    closeCreateModal: (id) => {
        document.getElementById(id).style.display = 'none';
    },

    populationFileList: (data) => {
        let fileList = ui.getFileList();

        for(const name in data) {
            if(data.hasOwnProperty(name)) {
                let isFolder = typeof data[name] === 'object';

                fileList.appendChild(ui.crElement(isFolder, name));
            }
        }
    },

    getFileList: () => {
        return document.getElementById('files-list');
    },

    removeFileList: () => {
        let fileList = ui.getFileList();
        while (fileList.firstChild) {
            fileList.removeChild(fileList.firstChild);
        }
    },

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
    
        return div;
    },

    createImgItem: (isFolder) => {
        let img = document.createElement('img');
        img.src = isFolder ? './images/folder-solid.svg' : './images/file-solid.svg';

        return img;
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

    addElement: (id) => {
        db.addElement(ui.getIsFolder(), ui.getInputValue('itemName'));

        handler.displayFiles();
        ui.closeCreateModal(id);
    },

    displayFiles: () => {
        let data = db.getData();
        ui.removeFileList();

        
        ui.populationFileList(data);
    }
}

document.onclick = () => {
    ui.getContextMenu().style.display = 'none';
}
