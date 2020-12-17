import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular'; 
import { AccessProviders } from '../../providers/access-providers';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string = "";
  your_name: string = "";
	gender: string = "";
	date_birth: string = "";
	email_address: string = "";
	password: string = "";
	confirm_pass: string = "";

	disabledButton;

  constructor(
  	private router: Router,
  	private toastCtrl: ToastController,
  	private loadingCtrl: LoadingController,
  	private alertCtrl: AlertController,
  	private accessPrvds: AccessProviders,
    private http: HttpClient
  ) { }


  ngOnInit() {
  }

  ionViewDidEnter() {
  	this.disabledButton = false;
  }

/**
*  async tryRegister() {
*  	if(this.your_name==""){
*  		this.presentToast("Ingrese su nombre")
*  	} else if (this.gender==""){
*  		this.presentToast("Ingrese su sexo")
*  	} else if (this.date_birth==""){
*  		this.presentToast("Ingrese su fecha de nacimiento")
*  	} else if (this.email_address==""){
*  		this.presentToast("Ingrese su correo electrónico")
*  	} else if (this.password==""){
*  		this.presentToast("Ingrese su contraseña")
*  	} else if (this.confirm_pass!==this.password){
*  		this.presentToast("Las contraseñas no coinciden")
*	} else {
*		this.disabledButton = true;
*		const loader = await this.loadingCtrl.create({
*		message: "Su cuenta se está registrando. Por favor espere...",
*        });
*		loader.present();
*
*		return new Promise(resolve => {
*
*			let body = {
*			aksi: 'process_register',
*			your_name: this.your_name,
*			gender: this.gender,
*			date_birth: this.date_birth,
*			email_address: this.email_address,
*			password: this.password	
*			}
*
*		this.accessPrvds.postData(body, 'process_api.php').subscribe((res:any)=>{
*			if(res.success==true){
*				loader.dismiss();
*				this.disabledButton = false;
*				this.presentToast(res.msg);
*				this.router.navigate(['/login']);
*			} else {
*				loader.dismiss();
*				this.disabledButton = false;
*				this.presentToast(res.msg);
*			}
*		},(err)=>{
*			loader.dismiss();
*			this.disabledButton = false;
*			this.presentAlert('Timeout');
*		});
*
*		});
*  	}
*  }
*/

  


  tryRegister() {

    if (this.username==""){
     this.presentToast("Ingrese su número de cédula")
     } else if(this.your_name==""){
         this.presentToast("Ingrese su nombre")
     } else if (this.gender==""){
         this.presentToast("Ingrese su sexo")
     } else if (this.date_birth==""){
         this.presentToast("Ingrese su fecha de nacimiento")
     } else if (this.email_address==""){
         this.presentToast("Ingrese su correo electrónico")
     } else if (this.password==""){
         this.presentToast("Ingrese su contraseña")
     } else if (this.confirm_pass!==this.password){
         this.presentToast("Las contraseñas no coinciden")
     } else {


        let today = new Date();

         var dateFormat = this.date_birth.split('T')[0]; 

        let bodyRegister = {
                  "username": this.username,
                  "your_name": this.your_name,
                  "gender": this.gender,
                  "date_birth": dateFormat,
                  "email_address": this.email_address,
                  "password": this.password,
                  "created_at": today,
                  "balance": 0
        }

        this.http.post('http://127.0.0.1:1880/storeUser/', bodyRegister).subscribe((data: any) => {
        console.log(data);

          if(data.affectedRows == 1){
           this.router.navigate(['/login']);
           this.disabledButton = false;

           this.presentToast("Usuario creado éxitosamente");
           console.log(data);

          } else {
           this.presentToast("Error: el usuario no fue registrado");
           console.log(data.message);
          }
        
        }, error => {
           console.log(error);
           this.presentToast("No fue posible crear el usuario");
        });
     }
  }

  async presentToast(a){
  	const toast = await this.toastCtrl.create({
  		message: a,
  		duration: 1500,
  		position: 'top'
  	});
  	toast.present();
  }

  async presentAlert(a) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: a,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Close',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            // action
          }
        }, {
          text: 'Intente de nuevo',
          handler: () => {
            this.tryRegister();
          }
        }
      ]
    });

    await alert.present();
  }

}
