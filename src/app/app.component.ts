import { Component, OnInit } from '@angular/core';
// import { OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Profile } from './models/profile';
@Component({
  selector: 'lazy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lazy';
  offset = 25;
  searchFinish = false;
  scrollCallback: Function;
  searchText: string;
  loading = false;
  profiles: Array<any> = [];
  filteredProfiles: Array<any> = [];

  constructor(private http: Http) {

  }

  ngOnInit() {
    this.scrollCallback = this.fetchList.bind(this);
    this.fetchList(true);
  }

  searchProfiles(text) {
    this.searchText = !!text && text.toLowerCase() || '';
    if (!!this.searchText && !!this.searchText.trim()) {
      this.filteredProfiles = this.profiles.filter((profile: Profile) => {
        const found = profile.name.toLowerCase().indexOf(this.searchText) > -1
          || profile.surname.toLowerCase().indexOf(this.searchText) > -1
          || profile.gender.toLowerCase().indexOf(this.searchText) > -1;
        return found;
      });
    } else {
      this.filteredProfiles = this.profiles;
    }
  }

  fetchList(init?: boolean) {
    if (this.searchFinish) {
      return false;
    }
    if (!init) {
      this.offset += 25;
    }
    this.loading = true;
    return this.http.get(`https://uinames.com/api/?ext&amount=${this.offset}`)
      .map(resp => resp.json())
      .do((data) => {
        this.loading = false;
        if (!!data) {
          this.profiles = data;
          this.filteredProfiles = data;
          if (!!this.searchText) {
            this.searchProfiles(this.searchText);
          }
        }
      }, (error: Response) => {
        if (error.status === 403) {
          this.loading = false;
          this.searchFinish = true;
          alert('Loaded all profiles');
        }
      });
    /* .subscribe((response) => {
      if (!!response) {
        // const newList = response.filter((item, index) => {
        //   return index > this.offset - 26;
        // });
        this.profiles = response;
      }
    }); */

  }
}
