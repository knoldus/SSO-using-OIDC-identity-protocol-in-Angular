import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GoogleApiService, UserInfo } from './google-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-google-oauth-example';

  mailSnippets: string[] = []
  userInfo?: UserInfo

  constructor(private readonly googleApi: GoogleApiService) {
    googleApi.userProfileSubject.subscribe( info => {
      this.userInfo = info
       console.log( info,'1')
    })
  }

  isLoggedIn(): boolean {
    console.log( "2")

    return this.googleApi.isLoggedIn()
  }

  logout() {
    this.googleApi.signOut()
  }

  async getEmails() {
    if (!this.userInfo) {
      console.log( '3')

      return;
    }
    console.log( '4')


    const userId = this.userInfo?.info.sub as string
    const messages = await lastValueFrom(this.googleApi.emails(userId))
    messages.messages.forEach( (element: any) => {
      const mail = lastValueFrom(this.googleApi.getMail(userId, element.id))
      mail.then( mail => {
        console.log( '5',mail)

        this.mailSnippets.push(mail.snippet)
      })
    });
  }
}
