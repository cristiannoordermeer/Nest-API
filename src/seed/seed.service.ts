import { Injectable } from '@nestjs/common';
import { PokeSeedResponse } from './interfaces/poke-seed.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private  readonly pokemonModel: Model<Pokemon>,
    private readonly httpService: AxiosAdapter
  ) {}
  
  async fillDB() {
    const data = await this.httpService.get<PokeSeedResponse>('https://pokeapi.co/api/v2/pokemon?limit=250');
    
    const pokemonToInsert: { name: string, num: number}[] = [];

    // if you want to test the seed more than one time, you can unComment next line
    // to avoid "duplicate key" errors
    //await this.pokemonModel.deleteMany({});

    data.results.forEach(async element => {
      const segments = element.url.split('/');
      const num = +segments[segments.length - 2]; // geting the pokemon number from the url property
      
      pokemonToInsert.push({name: element.name , num});
    });


    await this.pokemonModel.insertMany(pokemonToInsert);
    return "seed executed";
  }
}
