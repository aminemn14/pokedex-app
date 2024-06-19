import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // BehaviorSubject pour stocker et observer les données des Pokémons filtrés
  private filteredPokemons = new BehaviorSubject<any[]>([]);
  currentFilteredPokemons = this.filteredPokemons.asObservable(); // Observable pour accéder aux Pokémons filtrés

  constructor(private http: HttpClient) {}

  // Récupère une liste de Pokémons depuis l'API PokeAPI
  getPokemons() {
    return this.http.get('https://pokeapi.co/api/v2/pokemon?limit=809');
  }

  // Récupère des données supplémentaires pour un Pokémon spécifique par son nom
  getMoreData(name: string) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }

  // Récupère le nom français d'une espèce de Pokémon par son ID
  getFrenchName(id: number) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  }

  // Récupère les informations sur le type français d'un type de Pokémon par son ID
  getFrenchType(id: number) {
    return this.http.get(`https://pokeapi.co/api/v2/type/${id}`);
  }

  // Met à jour le BehaviorSubject filteredPokemons avec de nouvelles données
  changeFilteredPokemons(pokemons: any[]) {
    this.filteredPokemons.next(pokemons);
  }
}
