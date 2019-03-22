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
    
    deleteElement: (itemName) => {
        let data = db.getData();
        delete data[itemName];
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
        let selected = 0;

        ui.getFileList().childNodes.forEach(el => {
            if(el.classList.contains('selectedItem')) {
                selected++;
            }
        })

        return selected;
    },

    showContextMenu: function(evt) {
        evt.preventDefault();

        if(this.classList && !this.classList.contains('selectedItem')) {
            this.classList.add('selectedItem');
        }

        document.getElementById('renameOption').style.display = (ui.getSelectedItem() === 1) ? "block" : "none";
        document.getElementById('deleteOption').style.display = (ui.getSelectedItem() === 0) ? "none" : "block";

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
    openCreateModal: (id, elType) => {
        ui.openCreateModal(id, elType);
    },

    closeCreateModal: (id) => {
        ui.closeCreateModal(id);
    },

    addElement: (id) => {
        let itemName = ui.getInputValue('itemName');
        
        for(let key in db.data) {
           if(key === itemName) {
            ui.closeCreateModal(id);
            alert('this name is already busy, please put another name');
            return;
           }
        }
        
        db.addElement(ui.getIsFolder(), itemName);

        handler.displayFiles();
        ui.closeCreateModal(id);
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
