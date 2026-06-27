import {Component, Input, OnInit} from '@angular/core';
import {tap} from "rxjs";
import {FormBuilder, FormControl} from "@angular/forms";
import {CountryService} from "../../../services/country.service";
import {Country} from "../../../interfaces/entity/country";

@Component({
  selector: 'app-country-select',
  templateUrl: './country-select.component.html',
  styleUrls: ['./country-select.component.scss']
})
export class CountrySelectComponent implements OnInit {
  public countryAutocompleteControl: FormControl = this.formBuilder.control('');
  public allCountriesOption!: Country[];
  public filteredCountriesOptions!: Country[];
  @Input() control!: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryService) {
  }

  ngOnInit(): void {
    this.countryService.getOptions().pipe(
      tap(countries => {
        this.allCountriesOption = countries;
        this.filteredCountriesOptions = countries;
      })
    ).subscribe();

    this.countryAutocompleteControl.valueChanges.pipe(
      tap(value => {
        const text = typeof value === 'string' ? value : value?.name ?? '';
        this.filteredCountriesOptions = text ? this._filter(this.allCountriesOption, text) : this.allCountriesOption.slice();
        const matched = this.allCountriesOption.find(country => country.name === text);
        this.control.setValue(matched?.id ?? null);
      }),
    ).subscribe();
  }

  private _filter(array: { name: string }[], name: string): any {
    const filterValue = name.toLowerCase();
    return array.filter(option => option.name.toLowerCase().includes(filterValue));
  }
}
