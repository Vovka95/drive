$ = {
    div: (sId, sText, fnOnClick) => {
		let div = document.createElement('div');
		div.appendChild(document.createTextNode(sText));
		if (fnOnClick) {
			div.addEventListener('click', fnOnClick);
		}
		div.id = sId;

		return div;
	}  
}

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
		let data = ui.getCurrentFolder(db.getData());
		data[itemName] = IsFolder ? {} : '';
    },

    renameElement: (oldName, newName) => {
		let data = ui.getCurrentFolder(db.getData());
		data[newName] = data[oldName];
		delete data[oldName];
	},
    
    deleteElement: (itemName) => {
        let data = ui.getCurrentFolder(db.getData());
        delete data[itemName];
    }
}

const ui = {
    location: '/',

    openModal: (id, elType) => {
        let div = document.getElementById(id);
        let description = document.getElementById('descriptionPlaceholder');
    
        description.innerHTML = `Enter name of ${elType}:`;
    
        div.style.display = 'block';
    },

    closeModal: (id) => {
        document.getElementById(id).style.display = 'none';
    },

    getCurrentFolder: (data) => {
		let aLocation = ui.getLocation();
		for(let i = 0; i < aLocation.length; i++) {
				data = data[aLocation[i]];
		}
		return data;
    },
    
	getLocation: () => {
		return ui.location.split('/').filter(el => el !== '');
	},

    populationFileList: (data) => {
        let fileList = ui.getFileList();

        data = ui.getCurrentFolder(data);

		if (ui.getLocation().length > 0) {
			fileList.appendChild(ui.createParentFolder());
		}

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

    createParentFolder: () => {
		let div = document.createElement('div');
		div.appendChild(ui.createImgItem(true, 'parentFolder'));
		
		let text = document.createTextNode('..');
		div.appendChild(text);

		div.id = 'parentFolder';
		div.classList.add('data-folder');

		div.addEventListener('click', ui.selectItem);
		div.addEventListener('dblclick', ui.openParentFolder);

		return div;
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
        div.addEventListener('dblclick', ui.openItem);
        div.addEventListener('contextmenu', ui.showContextMenu);
    
        return div;
    },

    createImgItem: (isFolder, id) => {
        let img = document.createElement('img');
        img.src = isFolder ? ((id === 'parentFolder') ? './images/folder-open-solid.svg' : './images/folder-solid.svg') : './images/file-solid.svg';

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

    openItem: (evt) => {
		let element = evt.target.id ? evt.target : evt.target.parentNode.id ? evt.target.parentNode : evt.target.parentNode.parentNode;
		if (element.classList.contains('data-folder')) {
			ui.location += element.id + '/';
		}
		handler.displayFiles();
    },
    
	openParentFolder: (evt) => {
		let lastIndex = ui.location.lastIndexOf('/', ui.location.length - 2);
		ui.location = lastIndex === 0 ? '/' : ui.location.substring(0, lastIndex + 1);

		handler.displayFiles();
    },
    
	updateBreadcrumbs: () => {
		let totalPath = '/';
		let breadcrumbs = document.getElementById('breadcrumbs');

		while (breadcrumbs.firstChild) {
			breadcrumbs.removeChild(breadcrumbs.firstChild);
		}

		breadcrumbs.appendChild($.div(totalPath, ' / > ', handler.breadcrumbNavigate));

		ui.getLocation().forEach(el => {
			totalPath += el + '/';
			let div_crumb = $.div(totalPath, el + ' > ', handler.breadcrumbNavigate);
			breadcrumbs.appendChild(div_crumb);
		});
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
        
        for(let key in db.data) {
            if(key === newName) {
             ui.closeModal(id);
             alert('this name is already busy, please put another name');
             return;
            }
         }

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
    
    breadcrumbNavigate: function (evt) {
		ui.location = evt.target.id;
		handler.displayFiles();
	},

    displayFiles: () => {
        let data = db.getData();
        ui.removeFileList();

        ui.updateBreadcrumbs();
        
        ui.populationFileList(data);
    }
}

document.onclick = () => {
    ui.getContextMenu().style.display = 'none';

    /* add not select all*/
}
