import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Profile } from '../../models/profile';

@Component({
  selector: 'lazy-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  offset = 0;
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
    if (!!this.searchText || this.searchFinish) {
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
  }

  drag(id: HTMLElement, profile: Profile, param: string) {
    profile[param] = id.innerText;
    console.log(profile);
  }

}
