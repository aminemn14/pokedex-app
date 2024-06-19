import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('nav') nav!: ElementRef;
  @ViewChild('searchIcon') searchIcon!: ElementRef;
  @ViewChild('navOpenBtn') navOpenBtn!: ElementRef;
  @ViewChild('navCloseBtn') navCloseBtn!: ElementRef;

  searchControl = new FormControl();
  @Output() searchTerm = new EventEmitter<string>();
  @Output() filter = new EventEmitter<{ start: number; end: number }>();

  constructor(private dataService: DataService, private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Gestion du clic sur l'icône de recherche
    this.searchIcon.nativeElement.addEventListener('click', () => {
      this.nav.nativeElement.classList.toggle('openSearch');
      this.nav.nativeElement.classList.remove('openNav');
      if (this.nav.nativeElement.classList.contains('openSearch')) {
        return this.searchIcon.nativeElement.classList.replace(
          'uil-search',
          'uil-times'
        );
      }
      this.searchIcon.nativeElement.classList.replace(
        'uil-times',
        'uil-search'
      );
      this.searchControl.reset();
    });

    // Gestion du clic sur le bouton d'ouverture de navigation
    this.navOpenBtn.nativeElement.addEventListener('click', () => {
      this.nav.nativeElement.classList.add('openNav');
      this.nav.nativeElement.classList.remove('openSearch');
      this.searchIcon.nativeElement.classList.replace(
        'uil-times',
        'uil-search'
      );
    });

    // Gestion du clic sur le bouton de fermeture de navigation
    this.navCloseBtn.nativeElement.addEventListener('click', () => {
      this.nav.nativeElement.classList.remove('openNav');
    });

    // Détection des changements de valeur du champ de recherche
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        console.log('Search term:', value);
        this.searchTerm.emit(value);
      });

    // Ajout de la gestion de l'opacité des liens
    const navLinks = this.nav.nativeElement.querySelectorAll('.nav-links a');
    navLinks.forEach((link: any) => {
      this.renderer.listen(link, 'mouseover', () => {
        navLinks.forEach((otherLink: any) => {
          if (otherLink !== link) {
            this.renderer.setStyle(otherLink, 'opacity', '0.5');
          }
        });
      });
      this.renderer.listen(link, 'mouseout', () => {
        navLinks.forEach((otherLink: any) => {
          this.renderer.setStyle(otherLink, 'opacity', '1');
        });
      });
    });
  }
}
