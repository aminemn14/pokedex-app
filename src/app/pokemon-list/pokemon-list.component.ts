import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
})
export class PokemonListComponent implements OnInit {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  displayedPokemons: any[] = [];
  isLoading: boolean = true;
  typeTranslations: { [key: string]: string } = {
    normal: 'Normal',
    fire: 'Feu',
    water: 'Eau',
    electric: 'Électrik',
    grass: 'Plante',
    ice: 'Glace',
    fighting: 'Combat',
    poison: 'Poison',
    ground: 'Sol',
    flying: 'Vol',
    psychic: 'Psy',
    bug: 'Insecte',
    rock: 'Roche',
    ghost: 'Spectre',
    dragon: 'Dragon',
    dark: 'Ténèbres',
    steel: 'Acier',
    fairy: 'Fée',
  };
  typeColors: { [key: string]: string } = {
    Normal: '#a0a2a0',
    Feu: '#e64110',
    Eau: '#2481ef',
    Électrik: '#fac100',
    Plante: '#3ca224',
    Glace: '#3dd9ff',
    Combat: '#ff8100',
    Poison: '#923fcc',
    Sol: '#92501b',
    Vol: '#82baef',
    Psy: '#ef3f7a',
    Insecte: '#92a212',
    Roche: '#b0aa82',
    Spectre: '#703f70',
    Dragon: '#4f60e2',
    Ténèbres: '#4f3f3d',
    Acier: '#60a2b9',
    Fée: '#ef70ef',
  };

  itemsPerPage: number = 12;
  currentIndex: number = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getPokemons().subscribe((response: any) => {
      response.results.forEach((result: any) => {
        this.dataService
          .getMoreData(result.name)
          .subscribe((uniqResponse: any) => {
            this.dataService
              .getFrenchName(uniqResponse.id)
              .subscribe((speciesResponse: any) => {
                const frenchName = speciesResponse.names.find(
                  (name: any) => name.language.name === 'fr'
                ).name;
                uniqResponse.name = frenchName;
                uniqResponse.types = uniqResponse.types.map((type: any) => {
                  return {
                    ...type,
                    type: {
                      ...type.type,
                      name: this.typeTranslations[type.type.name],
                    },
                  };
                });
                this.pokemons.push(uniqResponse);
                this.filteredPokemons = this.pokemons;
                this.pokemons.sort((a, b) => a.id - b.id);
                this.updateDisplayedPokemons();
                this.isLoading = false;
              });
          });
      });
    });
  }

  filterPokemonsByGeneration(start: number, end: number) {
    this.filteredPokemons = this.pokemons.filter(
      (pokemon) => pokemon.id >= start && pokemon.id <= end
    );
    this.currentIndex = 0;
    this.updateDisplayedPokemons();
  }

  onSearchTerm(term: string) {
    console.log('Filtering with term:', term);
    if (!term) {
      this.filteredPokemons = this.pokemons;
    } else {
      this.filteredPokemons = this.pokemons.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(term.toLowerCase()) ||
          pokemon.id.toString().includes(term)
      );
    }

    this.currentIndex = 0;
    this.updateDisplayedPokemons();

    if (this.filteredPokemons.length === 0) {
      console.log('Aucun Pokémon trouvé.');
    }
  }

  updateDisplayedPokemons() {
    this.displayedPokemons = this.filteredPokemons.slice(
      0,
      this.itemsPerPage * (this.currentIndex + 1)
    );
  }

  loadMorePokemons() {
    this.currentIndex++;
    this.updateDisplayedPokemons();
  }

  convertHeight(heightInDm: number): string {
    const heightInCm = heightInDm * 10;
    if (heightInCm >= 100) {
      const heightInM = heightInCm / 100;
      if (Number.isInteger(heightInM)) {
        return `${heightInM} m`;
      } else {
        return `${heightInM.toFixed(2).replace('.', ',')} m`;
      }
    }
    return `${heightInCm} cm`;
  }

  getCardStyle(pokemon: any) {
    const primaryTypeColor = this.typeColors[pokemon.types[0]?.type.name];
    const secondaryTypeColor = pokemon.types[1]
      ? this.typeColors[pokemon.types[1].type.name]
      : primaryTypeColor;
    return {
      background: `linear-gradient(45deg, ${primaryTypeColor} 50%, ${secondaryTypeColor} 50%)`,
    };
  }
}
