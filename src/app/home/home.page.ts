import { Component, ViewChild } from '@angular/core';
import { StorageService, Item } from '../services/storage.service'
import { Platform, ToastController, IonList } from '@ionic/angular'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html'
})

export class HomePage {
  
  items: Item[] = [];

  newItem: Item = <Item>{};

  @ViewChild('mylist')mylist: IonList;

  constructor (private storageService: StorageService, private plt: Platform, private toastController: ToastController) {
    this.plt.ready().then( () => {
      this.loadItems();
    });
  }

  // create
  addItem(){
    this.newItem.modified = Date.now();
    this.newItem.id = Date.now();

    this.storageService.addItem(this.newItem).then( item => {
      this.newItem = <Item>{};
      this.showToast('Item adicionado');
      this.loadItems();
    });
  }

  // read
  loadItems() {
    this.storageService.getItems().then( items => {
      this.items = items;
    })
  }

  // update
  updateItem(item: Item) {
    item.title = `${item.title} atualizado`;
    item.modified = Date.now();

    this.storageService.updateItem(item.id).then( items => {
      this.showToast('Item atualizado');
      this.mylist.closeSlidingItems();
      this.loadItems();
    })
  }

  //delete
  deleteItem(item: Item) {
    this.storageService.deleteItem(item.id).then(item => {
      this.showToast('Item deletado');
      this.mylist.closeSlidingItems();
      this.loadItems();
    })
  }

  //helper
  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    })
    toast.present();
  }

}