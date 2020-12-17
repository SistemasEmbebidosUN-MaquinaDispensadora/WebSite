import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular'; 
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  datastorage: any;
  name: string;
  username: string;
  value: number;
  machine: string;
  userSince: string;
  userBalance: number;
  valueToRecharge: number;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accessPrvds: AccessProviders,
    public navCtrl: NavController,
    private storage: Storage,
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
  	this.storage.get('storage_xxx').then((res) => {
  		let userData = res[0];
  		this.name = (userData.your_name);
  		this.username = (userData.username);
  		this.userSince = (userData.created_at.substring(0, [10]));
  		this.userBalance = (userData.balance);
  		this.datastorage = res;
  	});
  }

  async logout(){
  	this.storage.clear();
  	this.navCtrl.navigateRoot(['/intro']);
  	const toast = await this.toastCtrl.create({
      message: 'Sesión finalizada con éxito',
      duration: 1500,
      position: 'top'
    });
    toast.dismiss();
  }

  rechargeAccount (){

  	let bodyRecharge = {
		"username": this.username,
		"value": this.valueToRecharge,
		"machine": 1
  	}

  	console.log(bodyRecharge);

  	if(bodyRecharge.value > 0) {
		this.http.post('http://127.0.0.1:1880/storeTransaction/', bodyRecharge).subscribe(data => {
	       console.log(data['_body']);
	      }, error => {
	       console.log(error);
	    });

    this.getNewBalance();
    this.navCtrl.navigateRoot(['/home']);
    } else {
    	this.presentToast("Ingrese un valor válido");
    }
  }

  getNewBalance () {

  	let bodyGetNewBalance = {
		"username": this.username
  	}

	this.http.post('http://127.0.0.1:1880/getNewBalance/', bodyGetNewBalance).subscribe(data => {
       console.log(data['_body']);
       this.storage.set('storage_xxx', data);
       let userData = data[0];
       this.userBalance = (userData.balance);
       console.log(this.userBalance);
       this.navCtrl.navigateRoot(['/home']);
      }, error => {
    });
  }

  async presentToast(a){
  	const toast = await this.toastCtrl.create({
  		message: a,
  		duration: 1500,
  		position: 'top'
  	});
  	await toast.present();
  }

}