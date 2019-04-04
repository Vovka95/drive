const db = {
    data: {},

    getData: function() {
        this.sortData();
        return this.data;
    },

    sortData: function() {
        let folder = {};
        let file = {};
        
        for(let key in this.data) {
            if (this.data.hasOwnProperty(key)) {
                if (typeof this.data[key] === 'object') {
                    folder[key] = this.data[key];
                } else {
                    file[key] = this.data[key];
                }
            }
        }

        this.data = { ...folder, ...file };
    },

    addElement: (IsFolder, itemName) => {
		let data = db.getData();
		data[itemName] = IsFolder ? {} : '';
    },

    renameElement: (oldName, newName) => {
		let data = db.getData();
		data[newName] = data[oldName];
		delete data[oldName];
	},
    
    deleteElement: (itemName) => {
        let data = db.getData();
        delete data[itemName];
    }
}

const ui = {
    openModal: (id, elType) => {
        let div = document.getElementById(id);
        let description = document.getElementById('descriptionPlaceholder');
    
        description.innerHTML = `Enter name of ${elType}:`;
    
        div.style.display = 'block';
    },

    closeModal: (id) => {
        document.getElementById(id).style.display = 'none';
    },

    populationFileList: (data) => {
        let fileList = ui.getFileList();

        for(const name in data) {
            if(data.hasOwnProperty(name)) {
                let isFolder = typeof data[name] === 'object';

                if (!document.getElementById('only-folders').checked || isFolder) {
                    fileList.appendChild(ui.crElement(isFolder, name));
                }        
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

        div.addEventListener('click', ui.selectItem);
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

    getSelectedItem: () => {
        let selected = [];

        ui.getFileList().childNodes.forEach(el => {
            if (el.classList.contains('selectedItem'))
				selected.push(el);
		});

        return selected;
    },

    showContextMenu: function(evt) {
        evt.preventDefault();

        if(this.classList && !this.classList.contains('selectedItem')) {
            this.classList.add('selectedItem');
        }

        document.getElementById('renameOption').style.display = (ui.getSelectedItem().length === 1) ? "block" : "none";
        document.getElementById('deleteOption').style.display = (ui.getSelectedItem().length === 0) ? "none" : "block";

        let contextMenu = ui.getContextMenu();

        contextMenu.style.left = evt.pageX + 'px';
        contextMenu.style.top = evt.pageY + 'px'; 
        contextMenu.style.display = 'block';
    },

    selectItem: function() {
        this.classList.toggle('selectedItem');
    },

    getInputValue: (id) => {
		let inputValue = document.getElementById(id).value;
		document.getElementById(id).value = '';
		return inputValue;
	},

    getIsFolder: () => {
        let elType = document.getElementById('descriptionPlaceholder');

        return (elType.innerText.indexOf('folder') > 0);   
    }
}

const handler = {
    openModal: (id, elType) => {
        ui.openModal(id, elType);
    },

    closeModal: (id) => {
        ui.closeModal(id);
    },

    addElement: (id) => {
        let itemName = ui.getInputValue('itemName');
        
        for(let key in db.data) {
           if(key === itemName) {
            ui.closeModal(id);
            alert('this name is already busy, please put another name');
            return;
           }
        }
        
        db.addElement(ui.getIsFolder(), itemName);

        handler.displayFiles();
        ui.closeModal(id);
    },

    selectAll: () => {
        ui.getFileList().childNodes.forEach(el => {
            el.classList.add('selectedItem');
        })
    },

    deleteSelectItem: () => {
        ui.getFileList().childNodes.forEach(el => {
            if(el.classList.contains('selectedItem')) {
                db.deleteElement(el.id);
            }
        })

        handler.displayFiles();
    },

    openRenameModal: (event) => {
        let item = ui.getSelectedItem().shift();
        let elType = item.classList.contains('data-folder') ? 'folder' : 'file';

        let description = document.getElementById('renameDescriptionPlaceholder');
        description.innerText = description.innerText.replace(/folder|file/gi, elType);

        document.getElementById('renameItemName').value = item.id;

        handler.openModal('renameModal');
    },

    renameItem: function (evt, id) {
		let oldName = ui.getSelectedItem().shift().id;
		let newName = ui.getInputValue('renameItemName');
		db.renameElement(oldName, newName);

		handler.displayFiles();
		ui.closeModal(id);
	},

    showContextMenu: function (evt) {
        let hasChild = document.getElementById('files-list');
        if(hasChild.hasChildNodes()) {
            ui.showContextMenu(evt);
        }   
	},

    displayFiles: () => {
        let data = db.getData();
        ui.removeFileList();
        
        ui.populationFileList(data);
    }
}

document.onclick = () => {
    ui.getContextMenu().style.display = 'none';

    /* add not select all*/
}
