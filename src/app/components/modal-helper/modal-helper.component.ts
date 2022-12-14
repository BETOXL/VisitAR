import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-modal-helper',
  templateUrl: './modal-helper.component.html',
  styleUrls: ['./modal-helper.component.scss'],
})
export class ModalHelperComponent implements OnInit {
  mensaje;
  titulo;
  constructor(private modalCtrl: ModalController) { }
  ngOnInit() {
    console.log(`${this.mensaje} `);
    console.log(`${this.titulo} `);
  }

  cancel() {
    return this.modalCtrl.dismiss(null);
  }

  confirm() {
    return this.modalCtrl.dismiss(null);
  }

}
