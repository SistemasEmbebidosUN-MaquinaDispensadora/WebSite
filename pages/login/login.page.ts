import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular'; 
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  username: string = "";
  password: string = "";

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

  tryLogin() {

    if (this.username==""){
     this.presentToast("Ingrese su número de cédula")
     } else if(this.password==""){
         this.presentToast("Ingrese su contraseña")
     } else {

        let bodyLogin = {
                  "username": this.username,
                  "password": this.password,
        }

        this.http.post('http://127.0.0.1:1880/loginUser/', bodyLogin)
         .subscribe((res:any) => {
            console.log(res);
            if(res.length == 1){
              this.storage.set('storage_xxx', res);
              this.navCtrl.navigateRoot(['/home']);
            } else if(res.length == 0){
                this.presentToast("Nombre de usuario o contraseña incorrectos");
            }
          }, error => {
           console.log(error);
        });
      }
  }

/**
*  searchUser(username: string): Observable<any> {
*    return this.http.get(`${'http://127.0.0.1:1880/loginUser/'}?s=${encodeURI(username)}`).pipe(
*      map(results => results['Search'])
*    );
*  }
*/

  async presentToast(a){
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

  openRegister(){
  	this.router.navigate(['/register']);
  }

}
